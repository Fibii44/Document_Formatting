<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\Template;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi; // Ensure you ran 'composer require setasign/fpdi'

class TemplateController extends Controller
{   
    public function index()
    {
        return Inertia::render('GenerateReport/Index', [
            // Fetch all templates for the grid view
            'templates' => Template::latest()->get(),
            
            // Fetch all employees for the "Select Employee" modal
            'employees' => Employee::all() 
        ]);
    }

    public function store(StoreTemplateRequest $request)
    {
        $data = $request->validated();

        if ($request->get('type') === 'upload' && $request->hasFile('file')) {
            // Save PDF to public storage
            $data['file_path'] = $request->file('file')->store('templates', 'public');
            
            // Request 'mappings' saved to 'field_mappings'
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
        
        // Get the absolute path from public storage
        $filePath = storage_path('app/public/' . $template->file_path);
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'Template file not found.');
        }
    
        // Set up PDF source and import the first page
        $pdf->setSourceFile($filePath);
        $templateId = $pdf->importPage(1);
        
        // Explicitly set A4 Portrait to match standard BIR 2316 dimensions
        $pdf->addPage('P', 'A4'); 
        $pdf->useTemplate($templateId);
    
        // Set font style (Bold helps the text stand out on busy forms)
        $pdf->SetFont('Helvetica', 'B', 10); 
        $pdf->SetTextColor(0, 0, 0);
    
        // Process field mappings stored in the database
        $mappings = $template->field_mappings ?? [];
    
        foreach ($mappings as $mapping) {
            $value = '';
    
            // 1. CONVERT PIXELS TO MILLIMETERS
            // Standard factor for 96 DPI screens
            $scale = 0.264583;
    
            // 2. APPLY OFFSETS
            // y_offset: Moves text down to compensate for the height of the React tag box
            // x_offset: Moves text slightly right to avoid touching box borders
            $y_offset = 4.5; 
            $x_offset = 1.0; 
    
            $x_mm = (floatval($mapping['x']) * $scale) + $x_offset;
            $y_mm = (floatval($mapping['y']) * $scale) + $y_offset;
    
            // Map the visual tags to actual Employee data
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
    
            // Write the data at the final calculated coordinates
            $pdf->SetXY($x_mm, $y_mm);
            $pdf->Write(0, $value);
        }
    
        // Output the PDF directly to the browser for viewing/printing
        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="Report_'.$employee->full_name.'.pdf"');
    }
}