<?php

use App\Models\AttendanceRecord;
use App\Models\User;

test('employee can view attendance index', function () {
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($user)->get('/attendance');
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('attendance/index')
        ->has('records')
        ->where('isAdmin', false)
    );
});

test('admin can view attendance index with all records', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/attendance');
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('attendance/index')
        ->has('records')
        ->where('isAdmin', true)
    );
});

test('employee can check in', function () {
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($user)->post('/attendance', [
        'type' => 'check_in',
        'latitude' => 40.7128,
        'longitude' => -74.0060,
        'location_address' => 'New York, NY',
    ]);
    
    $response->assertRedirect();
    
    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $user->id,
        'type' => 'check_in',
        'latitude' => 40.7128,
        'longitude' => -74.0060,
    ]);
});

test('employee can check out', function () {
    $user = User::factory()->employee()->create();
    
    // First check in
    AttendanceRecord::create([
        'user_id' => $user->id,
        'type' => 'check_in',
        'recorded_at' => now(),
        'latitude' => 40.7128,
        'longitude' => -74.0060,
    ]);
    
    $response = $this->actingAs($user)->post('/attendance', [
        'type' => 'check_out',
        'latitude' => 40.7128,
        'longitude' => -74.0060,
        'location_address' => 'New York, NY',
    ]);
    
    $response->assertRedirect();
    
    $this->assertDatabaseHas('attendance_records', [
        'user_id' => $user->id,
        'type' => 'check_out',
    ]);
});

test('employee cannot check out without checking in first', function () {
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($user)->post('/attendance', [
        'type' => 'check_out',
        'latitude' => 40.7128,
        'longitude' => -74.0060,
    ]);
    
    $response->assertRedirect();
    $response->assertSessionHasErrors(['type']);
});

test('unauthenticated user cannot access attendance', function () {
    $response = $this->get('/attendance');
    
    $response->assertRedirect('/login');
});