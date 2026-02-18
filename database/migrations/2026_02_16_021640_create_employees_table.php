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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            // Split names for better formatting flexibility
            $table->string('first_name');      
            $table->string('last_name');       
            $table->string('middle_name')->nullable(); 
            
            // Keep a virtual or standard full_name for general use
            $table->string('full_name');       

            $table->string('role');            
            $table->string('department');      
            $table->string('email')->unique(); 
            $table->date('join_date');         
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
