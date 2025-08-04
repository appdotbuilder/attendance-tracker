<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create sample employees
        $employees = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($employees as $employeeData) {
            $employee = User::create($employeeData);
            
            // Create sample attendance records for each employee
            for ($i = 0; $i < 10; $i++) {
                $date = now()->subDays(random_int(0, 30));
                
                // Check-in record
                AttendanceRecord::create([
                    'user_id' => $employee->id,
                    'type' => 'check_in',
                    'recorded_at' => $date->setHour(random_int(8, 10))->setMinute(random_int(0, 59)),
                    'latitude' => 40.7128 + (random_int(-100, 100) / 10000), // NYC area with variation
                    'longitude' => -74.0060 + (random_int(-100, 100) / 10000),
                    'location_address' => 'Office Building, New York, NY',
                ]);
                
                // Check-out record (same day, later time)
                AttendanceRecord::create([
                    'user_id' => $employee->id,
                    'type' => 'check_out',
                    'recorded_at' => $date->setHour(random_int(17, 19))->setMinute(random_int(0, 59)),
                    'latitude' => 40.7128 + (random_int(-100, 100) / 10000),
                    'longitude' => -74.0060 + (random_int(-100, 100) / 10000),
                    'location_address' => 'Office Building, New York, NY',
                ]);
            }
        }
    }
}