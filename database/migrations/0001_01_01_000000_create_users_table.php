<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // 1. Identification & Formatting Support
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('middle_initial', 10)->nullable();
            $table->string('tin_number')->nullable(); 
            
            // 2. Security & Auth
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // 3. Professional Details
            $table->string('role')->nullable(); 
            $table->string('department')->nullable(); 
            $table->date('join_date')->nullable(); 
            
            // 4. Dynamic Logic Flags
            $table->boolean('is_mwe')->default(false); 

            // 5. Raw Payroll Data
            $table->decimal('salary', 15, 2)->default(0); 
            $table->decimal('holiday_pay', 15, 2)->default(0);
            $table->decimal('overtime_pay', 15, 2)->default(0);
            $table->decimal('hazard_pay', 15, 2)->default(0);
            $table->decimal('bonus_total', 15, 2)->default(0); 

            // 6. Statutory Contributions
            $table->decimal('sss_contri', 15, 2)->default(0);
            $table->decimal('ph_contri', 15, 2)->default(0); 
            $table->decimal('pi_contri', 15, 2)->default(0);

            // --- ADDED THIS LINE FOR E-SIGNATURE ---
            $table->string('signature_path')->nullable(); 

            $table->rememberToken();
            $table->timestamps();
        });

        // ... rest of your file (password_resets and sessions)
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};