<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'middle_initial',
        'email',
        'password',
        'role',
        'department',
        'tin_number',
        'is_mwe',
        'salary',
        'holiday_pay',
        'overtime_pay',
        'hazard_pay',
        'bonus_total',
        'sss_contri',
        'ph_contri',
        'pi_contri',
        'join_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_mwe' => 'boolean',
            'join_date' => 'date',
        ];
    }
}