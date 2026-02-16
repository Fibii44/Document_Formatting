<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * These must match the $data array in your TemplateController.
     */
    protected $fillable = [
        'name',
        'type',           // 'text' or 'upload'
        'content',        // For text templates
        'file_path',      // For PDF uploads
        'field_mappings', // For the drag-and-drop coordinates
    ];

    /**
     * The attributes that should be cast.
     * This ensures 'field_mappings' is treated as a clean PHP array instead of a raw string.
     */
    protected $casts = [
        'field_mappings' => 'array', // Crucial for storing your X/Y coordinates
    ];
}