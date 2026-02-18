<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'full_name', // Kept for standard certificates
        'role',
        'department',
        'email',
        'join_date',
    ];

    protected $casts = [
        'join_date' => 'date',
    ];

    /**
     * Helper to get Middle Initial (e.g., "P.")
     */
    public function getMiddleInitialAttribute()
    {
        return $this->middle_name ? strtoupper(substr($this->middle_name, 0, 1)) . '.' : '';
    }
}