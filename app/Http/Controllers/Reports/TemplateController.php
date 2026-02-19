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
use Inertia\Inertia;

class TemplateController extends Controller
{
    use HasReportMapping; 

    /**
     * Display a listing of templates and users.
     */
    public function index()
    {
        return inertia('GenerateReport/Index', [
            'templates' => Template::latest()->get(),
            'users' => User::all(),
        ]);
    }

    /**
     * Dedicated preview page for template design validation.
     */
    public function review($id)
    {
        $template = Template::findOrFail($id);

        return Inertia::render('GenerateReport/ReviewTemplate', [
            'template' => $template
        ]);
    }

    /**
     * Store a newly created template.
     */
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
            '@Full Name (First MI Last)', '@Full Name (Last, First MI)',
            '@Full Name (Last, First)', '@Middle Name', '@TIN', '@Role',
            '@Department', '@Email', '@Join Date', '@Monthly Salary',
            '@Holiday Pay', '@Overtime Pay', '@Hazard Pay', '@MWE Status',
            '@Exempt Bonus', '@Taxable Bonus', '@Total Contributions',
        ];

        $replacements = [];
        foreach ($tags as $tag) {
            $replacements[$tag] = $this->getMappingValue($tag, $employee);
        }

        $content = $template->content ?? '';
        
        // NEW: We process the HTML to replace placeholders but KEEP the HTML tags
        $finalHtml = $this->processHtmlContent($content, $replacements);

        $pdf = new Fpdi();
        $pdf->SetMargins(20, 20, 20);
        $pdf->AddPage('P', 'A4');
        
        // Set a default font
        $pdf->SetFont('helvetica', '', 11);

        // USE writeHTMLCell instead of MultiCell to render Bold/Italic/Underline
        // Parameters: width, height, x, y, html, border, ln, fill, reseth, align, autopadding
        $pdf->writeHTMLCell(0, 0, '', '', $finalHtml, 0, 1, 0, true, 'L', true);

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->Output('', 'S');
        }, "Report_{$template->name}_{$employee->last_name}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Logic for Visual Mapper (coordinate placement on PDF).
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
            $value = $this->getMappingValue($tag, $employee); 
            
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

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->Output('', 'S');
        }, "Report_{$template->name}_{$employee->last_name}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Convert template content to plain text, handling Quill HTML spans.
     */
    private function contentToPlainText(string $content, array $replacements): string
    {
        $hasHtml = str_contains($content, 'data-placeholder') || preg_match('/<[a-z][^>]*>/i', $content);

        if (!$hasHtml) {
            return str_replace(array_keys($replacements), array_values($replacements), $content);
        }

        $wrapper = '<div id="quill-root">' . $content . '</div>';
        $dom = new \DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $wrapper, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
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
     * Process HTML content: Replaces data-placeholder spans with real values
     * while keeping other HTML tags (<b>, <i>, etc.) intact.
     */
    private function processHtmlContent(string $content, array $replacements): string
    {
        $dom = new \DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8"><div>' . $content . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        
        $xpath = new \DOMXPath($dom);
        $placeholders = $xpath->query('//*[@data-placeholder]');

        foreach ($placeholders as $node) {
            $tag = $node->getAttribute('data-placeholder');
            $value = $replacements[$tag] ?? $tag;
            
            $textNode = $dom->createTextNode($value);
            $node->parentNode->replaceChild($textNode, $node);
        }

        $root = $dom->getElementsByTagName('div')->item(0);
        $html = "";
        if ($root) {
            foreach ($root->childNodes as $child) {
                $html .= $dom->saveHTML($child);
            }
        }

        return $html;
    }
    /**
     * Excel Export for one or more users.
     */
    public function exportExcel(Request $request, Template $template)
    {
        $userIds = explode(',', $request->query('user_ids'));
        $users = User::whereIn('id', $userIds)->get();

        // Match PDF naming convention: uses first selected user's last name
        $lastName = $users->first() ? $users->first()->last_name : 'Export';

        return Excel::download(
            new TemplateExcelExport($users, $template), 
            "Report_{$template->name}_{$lastName}.xlsx"
        );
    }
}