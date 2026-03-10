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
        Schema::table('venta_promotores', function (Blueprint $table) {
            $table->enum('pagado', ['S', 'N'])->default('N')->after('id_factura_venta');
        });

        Schema::table('venta_tecnicos', function (Blueprint $table) {
            $table->enum('pagado', ['S', 'N'])->default('N')->after('id_factura_venta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venta_promotores', function (Blueprint $table) {
            $table->dropColumn('pagado');
        });

        Schema::table('venta_tecnicos', function (Blueprint $table) {
            $table->dropColumn('pagado');
        });
    }
};
