<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Reports\TemplateController; 
use App\Http\Controllers\EmployeeController;     
use Illuminate\Foundation\Application;  
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Grouping all authenticated routes for ManPro
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

   
   
    // --- REPORT & TEMPLATE ROUTES ---
    Route::get('/generate-reports', [TemplateController::class, 'index'])->name('generate-reports.index');

    Route::get('/generate-report/select', function () {
        return Inertia::render('GenerateReport/SelectTemplate'); 
    })->name('templates.select');

    //Templates
    Route::get('/generate-report/text-editor', function () {
        return Inertia::render('GenerateReport/Templates/TextTemplateEditor');
    })->name('templates.text-editor');

    Route::get('/generate-report/mapper', function () {
        return Inertia::render('GenerateReport/Templates/DocumentMapper');
    })->name('templates.mapper');

    Route::post('/generate-report/save', [TemplateController::class, 'store'])->name('templates.save');

    // PDF GENERATION
    Route::get('/generate-report/{template}/{employee}', [TemplateController::class, 'generate'])
        ->name('reports.generate'); 

    //  EXCEL EXPORT
    Route::get('/export-excel/{template}', [TemplateController::class, 'exportExcel'])
        ->name('reports.export-excel');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';