<?php

namespace Database\Factories;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceRecord>
 */
class AttendanceRecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\AttendanceRecord>
     */
    protected $model = AttendanceRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['check_in', 'check_out']),
            'recorded_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'latitude' => fake()->latitude(40.5, 40.9), // NYC area
            'longitude' => fake()->longitude(-74.5, -73.5), // NYC area
            'location_address' => fake()->address(),
        ];
    }

    /**
     * Indicate that the attendance record is a check-in.
     */
    public function checkIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'check_in',
        ]);
    }

    /**
     * Indicate that the attendance record is a check-out.
     */
    public function checkOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'check_out',
        ]);
    }

    /**
     * Indicate that the attendance record is from today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'recorded_at' => fake()->dateTimeBetween('today', 'today 23:59:59'),
        ]);
    }
}