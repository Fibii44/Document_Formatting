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
     */
    private function generateTextPdf($template, $employee) 
    {
        // 1. The "Search List": Tell Laravel which tags to look for in the text
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

        // 2. The "Replacement Map": Use the Trait to get real values for each tag
        $replacements = [];
        foreach ($tags as $tag) {
            $replacements[$tag] = $this->getMappingValue($tag, $employee);
        }

        // 3. The "Swap": Replace the tags in your template content with the real data
        $finalText = str_replace(array_keys($replacements), array_values($replacements), $template->content);

        // 4. PDF Generation
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