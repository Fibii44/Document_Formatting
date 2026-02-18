<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\Template;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
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

    public function generate(Template $template, Employee $employee)
    {
        $pdf = new \setasign\Fpdi\Tcpdf\Fpdi(); 
        $fileName = $template->name . '_' . $employee->full_name . '.pdf';

        if ($template->type === 'upload') {
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
                $scale = 0.264583; // PX to MM conversion
                
                // --- CALIBRATION OFFSETS ---
                $x_offset = 1.0; 
                $y_offset = 4.0; // Calibration for vertical alignment
            
                $x_mm = (floatval($mapping['x']) * $scale) + $x_offset;
                $y_mm = (floatval($mapping['y']) * $scale) + $y_offset;
            
                $pdf->SetXY($x_mm, $y_mm);
                $pdf->Write(0, $value);
            }
        } 
        else if ($template->type === 'text') {
            $pdf->AddPage('P', 'A4');
            $pdf->SetFont('Helvetica', 'B', 10);
            $pdf->SetMargins(20, 20, 20);
            
            $content = $template->content;
            
            // Updated tag list to match your new frontend tags
            $tags = [
                '@Employee Name (First, MI, Last)', 
                '@Employee Name (Last, First, MI)', 
                '@Employee Name (Last, First)', 
                '@Role', 
                '@Department', 
                '@Email', 
                '@Join Date'
            ];

            foreach ($tags as $tag) {
                $content = str_replace($tag, $this->getMappingValue($tag, $employee), $content);
            }
            
            $pdf->MultiCell(0, 10, $content, 0, 'L');
        }

        if (ob_get_contents()) ob_end_clean();
        
        $fileData = $pdf->Output($fileName, 'S');

        return response($fileData, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    }
    
    /**
     * Updated Helper to match your exact frontend tag requirements
     */
    private function getMappingValue($tag, $employee) {
        return match ($tag) {
            // "Full name of the Employee" Format: JHON LESTER PAYPA YBANEZ
            '@Employee Name (First, MI, Last)' => strtoupper("{$employee->first_name} {$employee->middle_name} {$employee->last_name}"),
            
            // "Formal format" (BIR 2316): YBANEZ, JHON LESTER P.
            '@Employee Name (Last, First, MI)' => strtoupper("{$employee->last_name}, {$employee->first_name} " . ($employee->middle_initial ?: substr($employee->middle_name, 0, 1) . '.')),
            
            // "Last and First name only": YBANEZ, JHON LESTER
            '@Employee Name (Last, First)' => strtoupper("{$employee->last_name}, {$employee->first_name}"),
            
            '@Role' => strtoupper($employee->role),
            '@Department' => strtoupper($employee->department),
            '@Email' => $employee->email,
            '@Join Date' => $employee->join_date ? $employee->join_date->format('M d, Y') : '',
            default => '',
        };
    }
}