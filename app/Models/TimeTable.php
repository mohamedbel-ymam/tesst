<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = ['degree_id', 'title', 'week_start'];

    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)
            ->orderBy('day_of_week')
            ->orderBy('start_time');
    }
}
