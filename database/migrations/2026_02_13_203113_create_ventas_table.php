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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('id_producto')->nullable();
            $table->integer('cantidad')->nullable();
            $table->decimal('precio', 10, 2);
            $table->string('descripcion', 200);
            $table->unsignedBigInteger('venta_cabezera_id'); // FK añadida
            $table->decimal('precio_promotor', 10, 2)->nullable();
            $table->decimal('total', 10, 2);

            $table->foreign('id_producto')
                  ->references('id')->on('productos')
                  ->onDelete('set null');

            $table->foreign('venta_cabezera_id')
                  ->references('id')->on('venta_cabezeras')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_producto');
            $table->index('venta_cabezera_id');

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
