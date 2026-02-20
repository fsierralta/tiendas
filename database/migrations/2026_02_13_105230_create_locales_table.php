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
        Schema::create('locales', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->string('name', 200)->unique();
            $table->string('rif', 100)->unique();
            $table->string('direccion', 200);
            $table->string('estado', 100)->nullable();
            $table->string('ciudad', 100)->nullable();
            $table->string('email', 100)->unique();
            $table->string('celular', 100)->nullable();
             $table->string('telefono', 100)->nullable();
             $table->string('logo', 200)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locales');
    }
};
