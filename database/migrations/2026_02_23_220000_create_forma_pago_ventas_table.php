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
        Schema::create('forma_pago_ventas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('venta_cabezera_id');
            $table->unsignedBigInteger('forma_pago_id');
            $table->decimal('monto', 10, 2);
            $table->string('referencia', 100)->nullable();
            $table->text('notas')->nullable();

            $table->foreign('venta_cabezera_id')
                  ->references('id')->on('venta_cabezeras')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('forma_pago_id')
                  ->references('id')->on('formapagos')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');

            $table->index('venta_cabezera_id');
            $table->index('forma_pago_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forma_pago_ventas');
    }
};
