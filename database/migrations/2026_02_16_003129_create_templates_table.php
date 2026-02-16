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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['text', 'upload']); // This tells Laravel which one it is
            $table->text('content')->nullable();      // Used for 'text' templates
            $table->string('file_path')->nullable();  // Used for 'upload' templates (PDF path)
            $table->json('field_mappings')->nullable(); // Stores the drag-and-drop coordinates
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
