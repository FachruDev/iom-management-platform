<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('iom_documents', function (Blueprint $table) {
            $table->date('effective_date')->nullable()->after('iom_number')->index();
        });

        DB::table('iom_documents')
            ->whereNull('effective_date')
            ->update(['effective_date' => now()->toDateString()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('iom_documents', function (Blueprint $table) {
            $table->dropColumn('effective_date');
        });
    }
};
