<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Reports\TemplateController; // Import your TemplateController
use App\Http\Controllers\EmployeeController;          // ADD THIS LINE
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

    // --- EMPLOYEE ROUTES ---
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');

    // --- REPORT & TEMPLATE ROUTES ---
    
    // Updated to use the Controller index to fetch saved templates
    Route::get('/generate-reports', [TemplateController::class, 'index'])->name('generate-reports.index');

    Route::get('/generate-report/select', function () {
        return Inertia::render('GenerateReport/SelectTemplate'); 
    })->name('templates.select');

    Route::get('/generate-report/mapper', function () {
        return Inertia::render('GenerateReport/Templates/DocumentMapper');
    })->name('templates.mapper');

    Route::post('/generate-report/save', [TemplateController::class, 'store'])->name('templates.save');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';