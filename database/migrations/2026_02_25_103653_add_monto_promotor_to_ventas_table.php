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
        Schema::table('ventas', function (Blueprint $table) {
            $table->decimal('monto_promotor', 10, 2)->nullable()->after('subtotal');
            $table->decimal('precio_venta', 10, 2)->nullable()->after('monto_promotor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['monto_promotor', 'precio_venta']);
        });
    }
};
