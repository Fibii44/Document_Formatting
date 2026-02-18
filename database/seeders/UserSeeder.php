<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. The Minimum Wage Earner (MWE)
        // Tests: Non-Taxable Earnings logic
        User::create([
            'first_name' => 'FEBY ANGELA',
            'last_name' => 'FELICES',
            'middle_name' => 'HILUDO',
            'middle_initial' => 'H.',
            'email' => 'felicesfebyangela@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'UTILITY WORKER',
            'department' => 'MAINTENANCE',
            'tin_number' => '123-456-789-000',
            'is_mwe' => true, // Triggers Non-Taxable Logic
            'salary' => 12000.00,
            'holiday_pay' => 1500.00,
            'overtime_pay' => 2000.00,
            'hazard_pay' => 500.00,
            'bonus_total' => 12000.00, // Below 90k threshold
            'sss_contri' => 500.00,
            'ph_contri' => 200.00,
            'pi_contri' => 100.00,
            'join_date' => '2023-01-15',
        ]);

        // 2. The High Earner (Above 90k Bonus)
        // Tests: 90k Tax Threshold logic
        User::create([
            'first_name' => 'JHON LESTER',
            'last_name' => 'YBANEZ',
            'middle_name' => 'PAYPA',
            'middle_initial' => 'P.',
            'email' => 'jhonlester@example.com',
            'password' => Hash::make('password'),
            'role' => 'SENIOR WEB DEVELOPER',
            'department' => 'IT DEPARTMENT',
            'tin_number' => '987-654-321-000',
            'is_mwe' => false, // Triggers Taxable Logic
            'salary' => 85000.00,
            'holiday_pay' => 5000.00,
            'overtime_pay' => 8000.00,
            'hazard_pay' => 0,
            'bonus_total' => 120000.00, // Tests: 90k exempt / 30k taxable
            'sss_contri' => 1125.00,
            'ph_contri' => 1800.00,
            'pi_contri' => 200.00,
            'join_date' => '2026-02-17',
        ]);

        // 3. The Standard Employee
        // Tests: Name formatting variations
        User::create([
            'first_name' => 'JUAN',
            'last_name' => 'LUNA',
            'middle_name' => 'PROTACIO',
            'middle_initial' => 'P.',
            'email' => 'juan@example.com',
            'password' => Hash::make('password'),
            'role' => 'OFFICE STAFF',
            'department' => 'ADMIN',
            'tin_number' => '444-555-666-000',
            'is_mwe' => false,
            'salary' => 25000.00,
            'holiday_pay' => 0,
            'overtime_pay' => 1200.00,
            'hazard_pay' => 0,
            'bonus_total' => 25000.00,
            'sss_contri' => 1125.00,
            'ph_contri' => 800.00,
            'pi_contri' => 200.00,
            'join_date' => '2024-05-20',
        ]);
    }
}