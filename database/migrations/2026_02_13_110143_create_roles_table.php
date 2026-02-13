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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name', 45)->unique();
            $table->string('descripcion', 200);
            // Permisos como string 'N'/'Y' (se puede cambiar a boolean si se desea)
            $table->string('update', 1)->default('N');
            $table->string('create', 1)->default('N');
            $table->string('read', 1)->default('N');
            $table->string('delete', 1)->default('N');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
