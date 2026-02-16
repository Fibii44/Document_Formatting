<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\Template;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
// 1. We change this to the TCPDF-based version of FPDI
use setasign\Fpdi\Tcpdf\Fpdi; 

class TemplateController extends Controller
{   
    public function index()
    {
        return Inertia::render('GenerateReport/Index', [
            'templates' => Template::latest()->get(),
            'employees' => Employee::all() 
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

    /**
     * Generate the filled PDF report
     */
    public function generate(Template $template, Employee $employee)
    {
        $pdf = new Fpdi();
        
        $filePath = storage_path('app/public/' . $template->file_path);
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'Template file not found.');
        }
    
        $pdf->setSourceFile($filePath);
        $templateId = $pdf->importPage(1);
        
        $pdf->AddPage('P', 'A4'); 
        $pdf->useTemplate($templateId);
    
        $pdf->SetFont('Helvetica', 'B', 10); 
        $pdf->SetTextColor(0, 0, 0);
    
        $mappings = $template->field_mappings ?? [];
    
        foreach ($mappings as $mapping) {
            $value = '';
            $scale = 0.264583;

            // --- ADJUST THESE OFFSETS ---
            // Decreased from 4.5 to 2.5 to move text UP
            $y_offset = 2.5; 
            $x_offset = 1.0; 
    
            $x_mm = (floatval($mapping['x']) * $scale) + $x_offset;
            $y_mm = (floatval($mapping['y']) * $scale) + $y_offset;
    
            switch ($mapping['tag']) {
                case '@Employee Name': 
                    $value = strtoupper($employee->full_name); 
                    break;
                case '@Role':           
                    $value = $employee->role; 
                    break;
                case '@Department':    
                    $value = $employee->department; 
                    break;
                case '@Email':         
                    $value = $employee->email; 
                    break;
                case '@Join Date':     
                    $value = $employee->join_date->format('M d, Y'); 
                    break;
            }
    
            $pdf->SetXY($x_mm, $y_mm);
            $pdf->Write(0, $value);
        }
    
        if (ob_get_contents()) ob_end_clean();

        return response($pdf->Output('Report.pdf', 'S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="Report_'.$employee->full_name.'.pdf"');
    }
}