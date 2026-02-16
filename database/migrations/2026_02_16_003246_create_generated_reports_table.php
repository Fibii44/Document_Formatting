<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('generated_reports', function (Blueprint $table) {
            $table->id();
            // Links to the master template used
            $table->foreignId('template_id')->constrained()->onDelete('cascade'); 
            
            // Tracks which admin generated the report
            $table->foreignId('user_id')->constrained(); 
        
            // The "Meat": Stores the actual data entered into the placeholders
            // Example: {"employee_name": "Feby", "total_pay": "5000"}
            $table->json('dynamic_values'); 
        
            // Metadata for the generated file
            $table->string('report_name'); // e.g., "Payroll_Feb_2026_Feby"
            $table->string('file_path')->nullable(); // Path to the final PDF/Doc generated
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_reports');
    }
};
