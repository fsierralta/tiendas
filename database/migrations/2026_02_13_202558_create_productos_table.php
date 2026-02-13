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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->string('name', 100);
            $table->unsignedBigInteger('id_locale');
            $table->unsignedBigInteger('id_categoria');
            $table->decimal('precio', 10, 2); // Se asume decimal
            $table->integer('cantidad')->nullable();
            $table->decimal('precio2', 10, 2)->nullable();
            $table->string('marca', 100)->nullable();
            $table->string('model', 100)->nullable();
            $table->integer('reposicion')->nullable();
            $table->unsignedBigInteger('id_ubicacion')->nullable(); // Cambiado de '_id_ubicacion' a 'id_ubicacion'
             $table->foreign('id_locale')
                  ->references('id')->on('locales')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_categoria')
                  ->references('id')->on('categorias')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_ubicacion')
                  ->references('id')->on('ubicaciones')
                  ->onDelete('set null'); // Si se elimina la ubicación, queda null

            // Índices
            $table->index(['name', 'marca']); // Índice compuesto como en el original
            $table->index('id_categoria');
            $table->index('id_locale');
            $table->index('id_ubicacion');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
