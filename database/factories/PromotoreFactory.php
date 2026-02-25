<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promotore>
 */
class PromotoreFactory extends Factory
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
            'apellidos' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'celular' => fake()->phoneNumber(),
        ];
    }
}
