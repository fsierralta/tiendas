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
        Schema::create('venta_footers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->decimal('iva', 10, 2)->nullable();
            $table->decimal('descuento', 10, 2)->nullable();
            $table->decimal('total', 10, 2)->nullable();
            $table->decimal('subtotal', 10, 2)->nullable();
            $table->unsignedBigInteger('venta_cabezera_id');
             $table->foreign('venta_cabezera_id')
                  ->references('id')->on('venta_cabezeras')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->index('venta_cabezera_id');
            



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_footers');
    }
};
