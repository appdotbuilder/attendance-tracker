<?php

use App\Models\User;

test('admin can view users index', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->get('/users');
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/index')
        ->has('users')
    );
});

test('employee cannot view users index', function () {
    $employee = User::factory()->employee()->create();
    
    $response = $this->actingAs($employee)->get('/users');
    
    $response->assertForbidden();
});

test('admin can create user', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->post('/users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'employee',
    ]);
    
    $response->assertRedirect();
    
    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'employee',
    ]);
});

test('employee cannot create user', function () {
    $employee = User::factory()->employee()->create();
    
    $response = $this->actingAs($employee)->post('/users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'employee',
    ]);
    
    $response->assertForbidden();
});

test('admin can view user profile', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($admin)->get("/users/{$user->id}");
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/show')
        ->has('user')
    );
});

test('user can view own profile', function () {
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($user)->get("/users/{$user->id}");
    
    $response->assertOk();
});

test('employee cannot view other user profiles', function () {
    $employee1 = User::factory()->employee()->create();
    $employee2 = User::factory()->employee()->create();
    
    $response = $this->actingAs($employee1)->get("/users/{$employee2->id}");
    
    $response->assertForbidden();
});

test('admin can update user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($admin)->put("/users/{$user->id}", [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => 'admin',
    ]);
    
    $response->assertRedirect();
    
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'role' => 'admin',
    ]);
});

test('admin can delete user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->employee()->create();
    
    $response = $this->actingAs($admin)->delete("/users/{$user->id}");
    
    $response->assertRedirect();
    
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->admin()->create();
    
    $response = $this->actingAs($admin)->delete("/users/{$admin->id}");
    
    $response->assertForbidden();
});

test('unauthenticated user cannot access user management', function () {
    $response = $this->get('/users');
    
    $response->assertRedirect('/login');
});