<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\Template;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('GenerateReport/Index', [
            // Fetching all templates to display in the list
            'templates' => Template::latest()->get()
        ]);
    }

    public function store(StoreTemplateRequest $request)
    {
        // 1. Get validated data from your StoreTemplateRequest
        $data = $request->validated();

        // 2. Handle File Upload if the type is 'upload'
        if ($request->get('type') === 'upload' && $request->hasFile('file')) {
            // Save the PDF to the public storage
            $data['file_path'] = $request->file('file')->store('templates', 'public');
            
            // The request 'mappings' array will be saved to 'field_mappings'
            $data['field_mappings'] = $request->mappings;
        }

        // 3. Handle Text Content if the type is 'text'
        if ($request->get('type') === 'text') {
            $data['content'] = $request->content;
        }

        // 4. Create the record in your single database table
        Template::create($data);

        return redirect()->route('generate-reports.index')->with('success', 'Template created successfully!');
    }
}