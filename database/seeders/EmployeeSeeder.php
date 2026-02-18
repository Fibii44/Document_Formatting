<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Example for Jhon Lester
        Employee::create([
            'first_name' => 'Jhon Lester',
            'middle_name' => 'Paypa',
            'last_name' => 'Ybanez',
            'full_name' => 'Jhon Lester Paypa Ybanez',
            'role' => 'Admin',
            'department' => 'Infinity Hub Interns',
            'email' => 'jhonlester@example.com',
            'join_date' => '2026-02-16',
        ]);

        // Example for Feby
        Employee::create([
            'first_name' => 'Feby',
            'middle_name' => null, // Middle name can be nullable
            'last_name' => 'Student',
            'full_name' => 'Feby Student',
            'role' => 'Web Developer',
            'department' => 'BSU IT Dept',
            'email' => 'feby@example.com',
            'join_date' => '2026-01-20',
        ]);
    }
}