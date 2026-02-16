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
        // 1. Handle UPLOAD (PDF-based) templates
        if ($template->type === 'upload') {
            $pdf = new Fpdi();
            $filePath = storage_path('app/public/' . $template->file_path);
            
            if (!$template->file_path || !file_exists($filePath)) {
                return back()->with('error', 'Template file not found.');
            }
    
            $pdf->setSourceFile($filePath);
            $templateId = $pdf->importPage(1);
            $pdf->AddPage('P', 'A4'); 
            $pdf->useTemplate($templateId);
    
            $pdf->SetFont('Helvetica', 'B', 10); 
            $pdf->SetTextColor(0, 0, 0);
    
            foreach ($template->field_mappings ?? [] as $mapping) {
                $value = $this->getMappingValue($mapping['tag'], $employee);
                $scale = 0.264583;
                $x_mm = (floatval($mapping['x']) * $scale) + 1.0;
                $y_mm = (floatval($mapping['y']) * $scale) + 2.5;
    
                $pdf->SetXY($x_mm, $y_mm);
                $pdf->Write(0, $value);
            }
    
            if (ob_get_contents()) ob_end_clean();
            return response($pdf->Output('Report.pdf', 'S'), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="Report_'.$employee->full_name.'.pdf"');
        }
    
        // 2. Handle TEXT templates (Simple TCPDF generation)
        if ($template->type === 'text') {
            $pdf = new Fpdi(); // Fpdi extends TCPDF, so we can use it for plain text too
            $pdf->AddPage();
            $pdf->SetFont('Helvetica', '', 12);
            
            // Replace the tag in the content
            $content = str_replace('@Employee Name', strtoupper($employee->full_name), $template->content);
            
            $pdf->Write(5, $content);
            
            if (ob_get_contents()) ob_end_clean();
            return response($pdf->Output('Report.pdf', 'S'), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="Report_'.$employee->full_name.'.pdf"');
        }
    
        return back()->with('error', 'Invalid template type.');
    }
    
    /**
     * Helper to get employee values based on tags
     */
    private function getMappingValue($tag, $employee) {
        return match ($tag) {
            '@Employee Name' => strtoupper($employee->full_name),
            '@Role' => $employee->role,
            '@Department' => $employee->department,
            '@Email' => $employee->email,
            '@Join Date' => $employee->join_date->format('M d, Y'),
            default => '',
        };
    }
}