<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee; // Ensure this model exists

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        Employee::create([
            'full_name' => 'Jhon Lester Paypa Ybanez',
            'role' => 'Admin',
            'department' => 'Infinity Hub Interns',
            'email' => 'jhonlester@example.com',
            'join_date' => '2026-02-16',
        ]);

        Employee::create([
            'full_name' => 'Feby Student',
            'role' => 'Web Developer',
            'department' => 'BSU IT Dept',
            'email' => 'feby@example.com',
            'join_date' => '2026-01-20',
        ]);
    }
}