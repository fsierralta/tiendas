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
        Schema::create('venta_tecnicos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->unsignedBigInteger('id_locale');
            $table->unsignedBigInteger('id_tecnico');
            $table->decimal('monto', 10, 2);
            $table->unsignedBigInteger('id_factura_venta');
            $table->date('fecha_venta')->nullable();
            $table->date('fecha_pago')->nullable();
            $table->string('referencia', 100)->nullable();
            $table->string('pagado', 45)->default('N'); // Normalizado

            $table->foreign('id_locale')
                  ->references('id')->on('locales')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreign('id_tecnico')
                    ->references('id')->on('tecnicos')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            
            $table->foreign('id_factura_venta')
                    ->references('id')->on('factura_ventas')
                    ->onDelete('cascade')   
                    ->onUpdate('cascade');
                $table->index('id_locale');
                $table->index('id_tecnico');
                $table->index('id_factura_venta');
                

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_tecnicos');
    }
};
