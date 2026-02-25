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
        Schema::create('venta_cabezeras', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->date('fecha');
            $table->unsignedBigInteger('id_cliente'); // Sin FK porque no existe tabla clientes en el script
            $table->unsignedBigInteger('id_promotor')->nullable();
            $table->unsignedBigInteger('id_tecnico')->nullable();
            $table->decimal('monto_promotor', 10, 2)->nullable();
            $table->unsignedBigInteger('user_id'); // Usuario que realiza la venta
            $table->decimal('monto_total', 10, 2); // Total general de la venta
            $table->unsignedBigInteger('locale_id'); // Corregido: referencia a locales
            $table->foreign('id_cliente')
                  ->references('id')->on('clientes')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            
             $table->foreign('locale_id')
                  ->references('id')->on('locales')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            // FK a promotores y tecnicos si existen
            $table->foreign('id_promotor')
                  ->references('id')->on('promotores')
                  ->onDelete('set null');

            $table->foreign('id_tecnico')
                  ->references('id')->on('tecnicos')
                  ->onDelete('set null');

            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');

            $table->index('locale_id');
            $table->index('id_promotor');
            $table->index('id_tecnico');
            $table->index('id_cliente');
            $table->index('user_id');
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_cabezeras');
    }
};
