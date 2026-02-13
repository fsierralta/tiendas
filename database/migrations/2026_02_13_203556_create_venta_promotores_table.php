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
        Schema::create('venta_promotores', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('id_promotor')->nullable();
            $table->decimal('monto', 10, 2);
            $table->date('fecha_venta')->nullable();
            $table->date('fecha_pago')->nullable();
            $table->string('referencia', 100)->nullable();
            $table->string('pagado', 100)->default('N'); // El original tiene '"N"' con comillas, lo normalizamos
            $table->unsignedBigInteger('id_factura_venta');
            $table->unsignedBigInteger('id_locale');

            $table->foreign('id_promotor')
                  ->references('id')->on('promotores')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreign('id_factura_venta')
                  ->references('id')->on('factura_ventas')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_locale')
                  ->references('id')->on('locales')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_promotor');
            $table->index('id_factura_venta');
            $table->index('id_locale');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_promotores');
    }
};
