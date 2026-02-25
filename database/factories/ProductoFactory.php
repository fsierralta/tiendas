<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'id_locale' => 1, // Asumimos que existe un locale con ID 1
            'id_categoria' => 1, // Asumimos que existe una categoría con ID 1
            'precio' => fake()->randomFloat(2, 5, 100),
            'cantidad' => fake()->numberBetween(1, 50),
            'precio2' => fake()->randomFloat(2, 5, 100),
            'marca' => fake()->company(),
            'model' => fake()->bothify('??-####'),
            'reposicion' => fake()->numberBetween(1, 20),
            'id_ubicacion' => 1, // Asumimos que existe una ubicación con ID 1
        ];
    }
}
