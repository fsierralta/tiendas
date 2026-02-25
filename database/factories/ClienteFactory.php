<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'apellido' => fake()->lastName(),
            'cedula_rif' => fake()->unique()->numerify('V-########'),
            'email' => fake()->unique()->safeEmail(),
            'telefono' => fake()->phoneNumber(),
            'ciudad' => fake()->city(),
            'direccion' => fake()->address(),
            'tipo' => fake()->randomElement(['N', 'J']), // Natural o Jurídico
        ];
    }
}
