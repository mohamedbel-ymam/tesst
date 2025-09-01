<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;



class DatabaseSeeder extends Seeder
{


public function run(): void
{
    // Create roles
    foreach (['admin', 'teacher', 'student', 'parent'] as $r) {
        Role::firstOrCreate(['name' => $r, 'guard_name' => 'web']);
    }

    // Example: assign admin role to a specific user
    $admin = User::where('email', 'admin@example.com')->first();
    if ($admin) {
        $admin->syncRoles(['admin']);
    }

    // Example: assign teacher role to some users
    $teachers = User::whereIn('email', ['t1@example.com','t2@example.com'])->get();
    foreach ($teachers as $teacher) {
        $teacher->syncRoles(['teacher']);
    }
}
}
