<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    public function run(): void
{
    // Seed degrees first!
    $this->call(DegreeSeeder::class);

    // Seed users (admin, parent, teacher, student)
    $this->call(UserSeeder::class);

    // Optionally: seed students via StudentSeeder
}
}
