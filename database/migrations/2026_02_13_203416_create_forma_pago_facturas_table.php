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
        Schema::create('forma_pago_facturas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('id_factura_venta')->nullable();
            $table->unsignedBigInteger('id_forma_pago');
            $table->decimal('monto', 10, 2); // Cambiado a decimal
            $table->string('referencia', 100)->nullable();
              $table->foreign('id_factura_venta')
                  ->references('id')->on('factura_ventas')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_forma_pago')
                  ->references('id')->on('formapagos')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_factura_venta');
            $table->index('id_forma_pago');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forma_pago_facturas');
    }
};
