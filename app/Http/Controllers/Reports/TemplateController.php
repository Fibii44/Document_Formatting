<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreTemplateRequest;
use App\Models\Template;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('GenerateReport/Index', [
            'templates' => Template::latest()->get()
        ]);
    }

    public function store(StoreTemplateRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('templates', 'public');
        }

        Template::create($data);

        return redirect()->back()->with('success', 'Template created!');
    }
}