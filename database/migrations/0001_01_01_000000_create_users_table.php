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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // 1. Identification & Formatting Support
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('middle_initial', 10)->nullable();
            $table->string('tin_number')->nullable(); // Required for BIR 2316
            
            // 2. Security & Auth
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // 3. Professional Details
            $table->string('role')->nullable(); // For @Role tag
            $table->string('department')->nullable(); // For @Department tag
            $table->date('join_date')->nullable(); // For @Join Date tag
            
            // 4. Dynamic Logic Flags
            // This determines if holiday/OT pay is taxable or not
            $table->boolean('is_mwe')->default(false); 

            // 5. Raw Payroll Data (Source Values)
            // Stored as decimal for currency precision
            $table->decimal('salary', 15, 2)->default(0); // Basic Salary
            $table->decimal('holiday_pay', 15, 2)->default(0);
            $table->decimal('overtime_pay', 15, 2)->default(0);
            $table->decimal('hazard_pay', 15, 2)->default(0);
            $table->decimal('bonus_total', 15, 2)->default(0); // For the 90k logic

            // 6. Statutory Contributions (Employee Shares)
            $table->decimal('sss_contri', 15, 2)->default(0);
            $table->decimal('ph_contri', 15, 2)->default(0); // PhilHealth
            $table->decimal('pi_contri', 15, 2)->default(0); // Pag-IBIG

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};