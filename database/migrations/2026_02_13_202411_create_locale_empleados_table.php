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
        Schema::create('locale_empleados', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->unsignedBigInteger('id_empleado')->nullable();
            $table->unsignedBigInteger('id_locale')->nullable();
            $table->foreign('id_empleado')
                  ->references('id')->on('empleados')
                  ->onDelete("cascade"); // El original no especifica, se asume CASCADE

            $table->foreign('id_locale')
                  ->references('id')->on('locales')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_empleado');
            $table->index('id_locale');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locale_empleados');
    }
};
