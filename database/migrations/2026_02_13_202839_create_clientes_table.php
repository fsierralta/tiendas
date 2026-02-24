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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('apellido');
            $table->string('email')->nullable();
            $table->string('ciudad')->nullable()->default('barquisimeto');
            $table->string('direccion')->nullable()->default('barquisimeto');
            $table->string('telefono')->nullable()->default('0412-');
            $table->string('cedula_rif')->unique()->index();
            $table->string('tipo')->default('N');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
