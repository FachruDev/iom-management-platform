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
        Schema::create('iom_documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('iom_number')->nullable()->unique();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->foreignId('uploaded_by_id')->constrained('user_mappings')->restrictOnDelete();
            $table->text('description');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['department_id', 'created_at']);
            $table->index(['uploaded_by_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iom_documents');
    }
};
