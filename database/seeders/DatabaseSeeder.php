<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // disable FK-checks so truncate works
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // now seed your four specific users
        User::factory()->create([
            'firstname' => 'Mohamed',
            'lastname'  => 'Belymam',
            'email'     => 'mohamed@belymam.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::STUDENT->value,
        ]);

        User::factory()->create([
            'firstname' => 'Super',
            'lastname'  => 'Admin',
            'email'     => 'admin@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::ADMIN->value,
        ]);

        User::factory()->create([
            'firstname' => 'Parent',
            'lastname'  => 'One',
            'email'     => 'parent@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::PARENT->value,
        ]);

        User::factory()->create([
            'firstname' => 'Teacher',
            'lastname'  => 'One',
            'email'     => 'teacher@school.com',
            'password'  => Hash::make('123456789'),
            'role'      => UserRole::TEACHER->value,
        ]);
    }
}
