<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Degree;

class DegreeSeeder extends Seeder
{
    public function run()
    {
        // Remove all existing degrees
        Degree::query()->delete();

        // Seed degrees
        Degree::query()->insert([
            ['name' => 'First Year',  'description' => '1st year'],
            ['name' => 'Second Year', 'description' => '2nd year'],
            ['name' => 'Third Year',  'description' => '3rd year'],
            ['name' => 'Fourth Year', 'description' => '4th year'],
            ['name' => 'Final Year',  'description' => 'Final year'],
        ]);
    }
}
