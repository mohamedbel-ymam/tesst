<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $degrees = \App\Models\Degree::all();
        $firstDegree = $degrees->first();

        User::factory()->create([
            'firstname' => 'Mohamed',
            'lastname'  => 'Belymam',
            'email'     => 'mohamed@belymam.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::STUDENT->value,
            'degree_id' => $firstDegree?->id,
        ]);
        User::factory()->create([
            'firstname' => 'Super',
            'lastname'  => 'Admin',
            'email'     => 'admin@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::ADMIN->value,
            'degree_id' => null,
        ]);
        User::factory()->create([
            'firstname' => 'Parent',
            'lastname'  => 'One',
            'email'     => 'parent@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::PARENT->value,
            'degree_id' => null,
        ]);
        User::factory()->create([
            'firstname' => 'Teacher',
            'lastname'  => 'One',
            'email'     => 'teacher@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::TEACHER->value,
            'degree_id' => null,
        ]);
    }
}
