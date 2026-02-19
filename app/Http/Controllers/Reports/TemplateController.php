<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\User;
use App\Models\Template;
use App\Traits\HasReportMapping; 
use App\Exports\TemplateExcelExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use setasign\Fpdi\Tcpdf\Fpdi;

class TemplateController extends Controller
{
    use HasReportMapping; // Use the Trait logic here

    public function index()
    {
        return inertia('GenerateReport/Index', [
            'templates' => Template::latest()->get(),
            'users' => User::all(),
        ]);
    }

    public function store(StoreTemplateRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('templates', 'public');
            $data['field_mappings'] = $request->mappings;
        }
        Template::create($data);
        return redirect()->route('generate-reports.index');
    }

    /**
     * Entry point for report generation.
     */
    public function generate(Template $template, User $employee) 
    {
        if ($template->type === 'text') {
            return $this->generateTextPdf($template, $employee);
        }
        
        return $this->generateMappedPdf($template, $employee);
    }

   
    /**
     * Logic for Text Editor (dynamic string replacement).
     * Supports both plain @tags and Quill HTML (spans with data-placeholder).
     */
    private function generateTextPdf($template, $employee) 
    {
        $tags = [
            '@Full Name (First MI Last)',
            '@Full Name (Last, First MI)',
            '@Full Name (Last, First)',
            '@Middle Name',
            '@TIN',
            '@Role',
            '@Department',
            '@Email',
            '@Join Date',
            '@Monthly Salary',
            '@Holiday Pay',
            '@Overtime Pay',
            '@Hazard Pay',
            '@MWE Status',
            '@Exempt Bonus',
            '@Taxable Bonus',
            '@Total Contributions',
        ];

        $replacements = [];
        foreach ($tags as $tag) {
            $replacements[$tag] = $this->getMappingValue($tag, $employee);
        }

        $content = $template->content ?? '';
        $finalText = $this->contentToPlainText($content, $replacements);

        // PDF Generation
        $pdf = new Fpdi();
        $pdf->SetMargins(20, 20, 20);
        $pdf->AddPage('P', 'A4');
        $pdf->SetFont('Helvetica', '', 12);
        
        // MultiCell allows the text to wrap to the next line automatically
        $pdf->MultiCell(0, 10, $finalText, 0, 'L');

        // 5. Response: Send headers to force an automatic download
        return response($pdf->Output("Report_{$employee->last_name}.pdf", 'S'), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="Report_'.$employee->last_name.'.pdf"');
    }

    /**
     * Convert template content to plain text for PDF.
     * Handles Quill HTML (spans with data-placeholder) and plain @tag content.
     */
    private function contentToPlainText(string $content, array $replacements): string
    {
        $hasHtml = str_contains($content, 'data-placeholder') || preg_match('/<[a-z][^>]*>/i', $content);

        if (!$hasHtml) {
            return str_replace(array_keys($replacements), array_values($replacements), $content);
        }

        $wrapper = '<div id="quill-root">' . $content . '</div>';
        $dom = new \DOMDocument();
        @$dom->loadHTML(
            '<?xml encoding="UTF-8">' . $wrapper,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        $xpath = new \DOMXPath($dom);
        $placeholders = $xpath->query('//*[@data-placeholder]');

        foreach ($placeholders as $node) {
            $tag = $node->getAttribute('data-placeholder');
            $value = $replacements[$tag] ?? $tag;
            $textNode = $dom->createTextNode($value);
            $node->parentNode->replaceChild($textNode, $node);
        }

        $root = $dom->getElementById('quill-root') ?: $dom->getElementsByTagName('div')->item(0);
        $plain = $root ? $root->textContent : ($dom->documentElement->textContent ?? '');

        return html_entity_decode($plain, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Logic for Visual Mapper (coordinate placement).
     */
    private function generateMappedPdf($template, $employee) 
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pdf->SetMargins(0, 0, 0);
        
        $fullPath = storage_path('app/public/' . $template->file_path);
        $pdf->setSourceFile($fullPath);
        $templateId = $pdf->importPage(1);
        $pdf->AddPage('P', 'A4');
        $pdf->useTemplate($templateId);
        
        $pdf->SetTextColor(0, 0, 0);
        $ratio = 210 / 794; 

        foreach ($template->field_mappings ?? [] as $mapping) {
            $tag = $mapping['tag'];
            $value = $this->getMappingValue($tag, $employee); // Calls the Trait
            
            $x_mm = floatval($mapping['x']) * $ratio;
            $y_mm = floatval($mapping['y']) * $ratio;
            $y_corrected = $y_mm + 3.5; 
        
            if (str_contains($tag, 'TIN')) {
                $pdf->SetFont('Courier', 'B', 10); 
                $digits = str_split(preg_replace('/[^\d]/', '', $value));
                $currentX = $x_mm;
                foreach ($digits as $index => $digit) {
                    $pdf->Text($currentX + 1.2, $y_corrected, $digit);
                    $currentX += 5.9; 
                    if ($index == 2 || $index == 5 || $index == 8) $currentX += 2.22;
                }
            } else {
                $pdf->SetFont('Helvetica', 'B', 10);
                $pdf->Text($x_mm, $y_corrected, $value);
            }
        }

        return response($pdf->Output("Report_{$employee->last_name}.pdf", 'S'), 200)
                ->header('Content-Type', 'application/pdf');
    }

    // Exceel Export
    public function exportExcel(Request $request, Template $template)
    {
        // Get user IDs from the URL query
        $userIds = explode(',', $request->query('user_ids'));
        $users = User::whereIn('id', $userIds)->get();

        return Excel::download(
            new TemplateExcelExport($users, $template), 
            "Report_{$template->name}.xlsx"
        );
    }
}