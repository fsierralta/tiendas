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
        Schema::create('role_users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
             $table->unsignedBigInteger('id_role');
            $table->unsignedBigInteger('id_user');
              $table->foreign('id_role')
                  ->references('id')->on('roles')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('id_user')
                  ->references('id')->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index('id_role');
            $table->index('id_user');

            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_users');
    }
};
