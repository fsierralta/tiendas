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
        Schema::create('factura_ventas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->string('nrofactura', 100)->nullable();
            $table->unsignedBigInteger('id_venta_cabezera');
            $table->unsignedBigInteger('id_locale')->nullable();
            $table->unsignedBigInteger('id_tasabcv')->nullable();
             $table->foreign('id_venta_cabezera')
                  ->references('id')->on('venta_cabezeras')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_locale')
                  ->references('id')->on('locales')
                  ->onDelete('set null');

            $table->foreign('id_tasabcv')
                  ->references('id')->on('tasabcvs')
                  ->onDelete('set null')
                  ->onUpdate('cascade');

            $table->index('id_venta_cabezera');
            $table->index('id_locale');
            $table->index('id_tasabcv');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factura_ventas');
    }
};
