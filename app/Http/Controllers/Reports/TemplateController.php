<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\User;
use App\Models\Template;
use Illuminate\Http\Request;
use setasign\Fpdi\Tcpdf\Fpdi;
use Carbon\Carbon;

class TemplateController extends Controller
{
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

    public function generate(Template $template, User $employee) 
    {
        // --- TYPE 1: TEXT EDITOR TEMPLATES ---
    if ($template->type === 'text') {
        $content = $template->content;
        
        // Define tags using the same data logic
        $tags = [
            '@Employee Name' => $this->getMappingValue('@Full Name (First MI Last)', $employee),
            '@Role'          => $this->getMappingValue('@Role', $employee),
            '@Department'    => $this->getMappingValue('@Department', $employee),
            '@Email'         => $this->getMappingValue('@Email', $employee),
            '@Join Date'     => $this->getMappingValue('@Join Date', $employee),
        ];

        // Fill the content with real data
        $finalText = str_replace(array_keys($tags), array_values($tags), $content);

        // Initialize PDF for Text
        $pdf = new Fpdi();
        $pdf->SetCreator('ManPro');
        $pdf->SetAuthor('ManPro System');
        $pdf->SetTitle("Report - {$employee->last_name}");
        
        $pdf->SetMargins(20, 20, 20); // 20mm margins for a clean document look
        $pdf->AddPage('P', 'A4');
        
        // Use a standard font for the report body
        $pdf->SetFont('Helvetica', '', 12);
        
        // WriteHTML or MultiCell handles line breaks (\n) from the textarea correctly
        $pdf->MultiCell(0, 10, $finalText, 0, 'L');

        return response($pdf->Output("Report_{$employee->last_name}.pdf", 'S'), 200)
                ->header('Content-Type', 'application/pdf');
    }
        // --- TYPE 2: UPLOAD (PDF) TEMPLATES ---
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
                // SIMPLIFIED: Uses the exact X and Y from the frontend.
                $pdf->SetFont('Helvetica', 'B', 10);
                $pdf->Text($x_mm, $y_corrected, $value);
            }
        }

        return response($pdf->Output("Report_{$employee->last_name}.pdf", 'S'), 200)
                ->header('Content-Type', 'application/pdf');
    }

    private function getMappingValue($tag, $employee) 
    {
        $bonus = $employee->bonus_total ?? 0;
        $exemptBonus = min($bonus, 90000);
        $taxableBonus = max(0, $bonus - 90000);
        $totalStatutory = ($employee->sss_contri ?? 0) + ($employee->ph_contri ?? 0) + ($employee->pi_contri ?? 0);

        return match ($tag) {
            '@Full Name (First MI Last)' => strtoupper("{$employee->first_name} {$employee->middle_initial} {$employee->last_name}"),
            '@Full Name (Last, First MI)' => strtoupper("{$employee->last_name}, {$employee->first_name} {$employee->middle_initial}"),
            '@Full Name (Last, First)'    => strtoupper("{$employee->last_name}, {$employee->first_name}"),
            '@Middle Name'   => strtoupper($employee->middle_name),
            '@TIN'           => $employee->tin_number,
            '@Role'          => strtoupper($employee->role),
            '@Department'    => strtoupper($employee->department),
            '@Email'         => $employee->email,
            '@Join Date'     => $employee->join_date ? Carbon::parse($employee->join_date)->format('M d, Y') : '',
            '@Monthly Salary'=> number_format($employee->salary ?? 0, 2),
            '@Holiday Pay'   => number_format($employee->holiday_pay ?? 0, 2),
            '@Overtime Pay'  => number_format($employee->overtime_pay ?? 0, 2),
            '@Hazard Pay'    => number_format($employee->hazard_pay ?? 0, 2),
            '@MWE Status'    => $employee->is_mwe ? 'YES' : 'NO',
            '@Exempt Bonus'  => number_format($exemptBonus, 2),
            '@Taxable Bonus' => number_format($taxableBonus, 2),
            '@Total Contributions' => number_format($totalStatutory, 2),
            default => '',
        };
    }
}