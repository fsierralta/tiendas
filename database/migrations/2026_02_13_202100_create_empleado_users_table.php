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
        Schema::create('empleado_users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_empleado');
             $table->foreign('id_user')
                  ->references('id')->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_empleado')
                  ->references('id')->on('empleados')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_user');
            $table->index('id_empleado');



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleado_users');
    }
};
