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
        Schema::create('iom_document_files', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('iom_document_id')->constrained('iom_documents')->cascadeOnDelete();
            $table->string('disk');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type');
            $table->string('extension', 20)->index();
            $table->unsignedBigInteger('size');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['iom_document_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iom_document_files');
    }
};
