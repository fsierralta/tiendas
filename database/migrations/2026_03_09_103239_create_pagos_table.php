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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->decimal('monto', 10, 2);
            $table->date('fecha');
            $table->string('referencia')->nullable();
            $table->text('observacion')->nullable();
            $table->foreignId('formapago_id')->constrained('formapagos');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('venta_promotore_id')->nullable()->constrained('venta_promotores')->cascadeOnDelete();
            $table->foreignId('venta_tecnico_id')->nullable()->constrained('venta_tecnicos')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
