<?php
namespace Database\Seeders;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder {
    public function run(): void {
        foreach (['Math','Physics','Biology','arabic','History-geographic','Islamic-studies','french'] as $n) {
            Subject::firstOrCreate(['name'=>$n]);
        }
    }
}