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

    public function index()
    {
        return inertia('GenerateReport/Index', [
            'templates' => Template::latest()->get(),
            'users' => User::all(),
        ]);
    }

    public function review($id)
    {
        $template = Template::findOrFail($id);

        return Inertia::render('GenerateReport/ReviewTemplate', [
            'template' => $template
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

    public function generate(Template $template, User $employee) 
    {
        if ($template->type === 'text') {
            return $this->generateTextPdf($template, $employee);
        }
        
        return $this->generateMappedPdf($template, $employee);
    }

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
        $finalHtml = $this->processHtmlContent($content, $replacements);

        $pdf = new Fpdi();
        $pdf->SetMargins(20, 20, 20);
        $pdf->AddPage('P', 'A4');
        
        $pdf->SetFont('helvetica', '', 11);
        $pdf->writeHTMLCell(0, 0, '', '', $finalHtml, 0, 1, 0, true, 'L', true);

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->Output('', 'S');
        }, "Report_{$template->name}_{$employee->last_name}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * UPDATED Logic for Visual Mapper with Dynamic Paper Size detection.
     */
    private function generateMappedPdf($template, $employee) 
    {
        $pdf = new Fpdi();
        $pdf->SetAutoPageBreak(false);
        $pdf->SetMargins(0, 0, 0);
        
        $fullPath = storage_path('app/public/' . $template->file_path);
        $pdf->setSourceFile($fullPath);
        
        $templateId = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($templateId);
    
        $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
        $pdf->useTemplate($templateId);
        
        $pdf->SetTextColor(0, 0, 0);
        $ratio = $size['width'] / 794; 
    
        foreach ($template->field_mappings ?? [] as $mapping) {
            $tag = $mapping['tag'];
            
            // Detect if the tag is the Employer Signature
            $isSignature = str_contains($tag, 'Signature');
            
            $value = $this->getMappingValue($tag, $employee); 
            
            $x_mm = floatval($mapping['x']) * $ratio;
            $y_mm = floatval($mapping['y']) * $ratio;
            $y_corrected = $y_mm + 3.5; 
    
            // CASE 1: Render the current user's E-Signature Image
            if ($isSignature) {
                $currentUser = auth()->user(); 
                
                if ($currentUser->signature_path) {
                    $sigPath = storage_path('app/public/' . $currentUser->signature_path);
                    
                    if (file_exists($sigPath)) {
                        // Coordinates and sizing for the signature PNG
                        $pdf->Image($sigPath, $x_mm, $y_mm, 0, 12, 'PNG');
                    }
                }
                continue; 
            }
    
            // CASE 2: TIN Digits
            if (str_contains($tag, 'TIN')) {
                $pdf->SetFont('Courier', 'B', 10); 
                $digits = str_split(preg_replace('/[^\d]/', '', $value));
                $currentX = $x_mm;
                foreach ($digits as $index => $digit) {
                    $pdf->Text($currentX + 1.2, $y_corrected, $digit);
                    $currentX += 5.9; 
                    if ($index == 2 || $index == 5 || $index == 8) $currentX += 2.22;
                }
            } 
            // CASE 3: Standard Text
            else {
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

    public function exportExcel(Request $request, Template $template)
    {
        $userIds = explode(',', $request->query('user_ids'));
        $users = User::whereIn('id', $userIds)->get();
        $lastName = $users->first() ? $users->first()->last_name : 'Export';

        return Excel::download(
            new TemplateExcelExport($users, $template), 
            "Report_{$template->name}_{$lastName}.xlsx"
        );
    }
}