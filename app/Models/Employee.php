<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * These correspond to the @tags in your Document Mapper.
     */
    protected $fillable = [
        'full_name',  // Maps to @Employee Name
        'role',       // Maps to @Role
        'department', // Maps to @Department
        'email',      // Maps to @Email
        'join_date',  // Maps to @Join Date
    ];

    /**
     * Optional: Cast the join_date to a date object for easier formatting
     * in your generated reports.
     */
    protected $casts = [
        'join_date' => 'date',
    ];
}