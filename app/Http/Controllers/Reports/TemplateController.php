<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\User;
use App\Models\Template;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Tcpdf\Fpdi; 

class TemplateController extends Controller
{   
   

        public function index()
        {
            return inertia('GenerateReport/Index', [
                'templates' => Template::all(),
                'users' => User::all(), // Make sure this is 'users' and NOT 'employees'
            ]);
        }
            public function store(StoreTemplateRequest $request)
    {
        $data = $request->validated();

        if ($request->get('type') === 'upload' && $request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('templates', 'public');
            $data['field_mappings'] = $request->mappings;
        }

        if ($request->get('type') === 'text') {
            $data['content'] = $request->content;
        }

        Template::create($data);

        return redirect()->route('generate-reports.index')->with('success', 'Template created successfully!');
    }

    public function generate(Template $template, User $employee) 
{
    $pdf = new \setasign\Fpdi\Tcpdf\Fpdi();
    // Disable automatic margins that shift the origin
    $pdf->SetAutoPageBreak(false);
    $pdf->SetMargins(0, 0, 0);
    
    $fileName = "{$template->name}_{$employee->last_name}.pdf";

    if ($template->type === 'upload') {
        $pdf->setSourceFile(storage_path('app/public/' . $template->file_path));
        $templateId = $pdf->importPage(1);
        $pdf->AddPage('P', 'A4');
        $pdf->useTemplate($templateId);
        
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(0, 0, 0);

        foreach ($template->field_mappings ?? [] as $mapping) {
            $value = $this->getMappingValue($mapping['tag'], $employee);
            
            // Standard Ratio (210mm / 794px)
            $ratio = 0.26448; 

            // Calibration Logic
            // X: Usually needs a 0.5mm nudge for browser scrollbar gaps
            $x_mm = (floatval($mapping['x']) * $ratio) + 4.5;

            // Y: Adding 3.8mm is the "Sweet Spot" for 10pt font height.
            // This aligns the baseline of the PDF text to the visual center in React.
            $y_mm = (floatval($mapping['y']) * $ratio) + 2.8; 

            $pdf->Text($x_mm, $y_mm, $value);
        }
    }

    return response($pdf->Output($fileName, 'S'), 200)
            ->header('Content-Type', 'application/pdf');
}
    /**
     * Logic Engine: Resolves universal tags into formatted employee data.
     */
    private function getMappingValue($tag, $employee) 
    {
        // 90k Tax Threshold Logic
        $bonus = $employee->bonus_total;
        $exemptBonus = min($bonus, 90000);
        $taxableBonus = max(0, $bonus - 90000);
        
        // Dynamic Statutory Summation
        $totalStatutory = $employee->sss_contri + $employee->ph_contri + $employee->pi_contri;

        return match ($tag) {
            // Dynamic Name Formatting based on split fields
            '@Full Name (First MI Last)' => strtoupper("{$employee->first_name} {$employee->middle_initial} {$employee->last_name}"),
            '@Full Name (Last, First MI)' => strtoupper("{$employee->last_name}, {$employee->first_name} {$employee->middle_initial}"),
            '@Full Name (Last, First)'    => strtoupper("{$employee->last_name}, {$employee->first_name}"),
            
            // Professional & Identity Details
            '@TIN'         => $employee->tin_number,
            '@Role'        => strtoupper($employee->role),
            '@Department'  => strtoupper($employee->department),
            '@Email'       => $employee->email,
            '@Join Date'   => $employee->join_date ? $employee->join_date->format('M d, Y') : '',
            
            // Complex Payroll Sorting
            // Moves earnings based on Minimum Wage Earner (MWE) status
            '@Non-Taxable Earnings' => $employee->is_mwe 
                ? number_format($employee->salary + $employee->holiday_pay + $employee->hazard_pay, 2) 
                : '0.00',
            
            '@Taxable Earnings'     => !$employee->is_mwe 
                ? number_format($employee->salary + $employee->overtime_pay, 2) 
                : number_format($employee->salary, 2),
            
            // Tax Compliance Logic
            '@Exempt Bonus'         => number_format($exemptBonus, 2),
            '@Taxable Bonus'        => number_format($taxableBonus, 2),
            '@Total Contributions'  => number_format($totalStatutory, 2),
            
            default => '',
        };
    }
}