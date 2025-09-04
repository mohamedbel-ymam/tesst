<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'degree_id','teacher_id','subject_id','room_id',
        'day_of_week','period','starts_at','ends_at',
    ];

    public function degree(){ return $this->belongsTo(Degree::class); }
    public function subject(){ return $this->belongsTo(Subject::class); }
    public function teacher(){ return $this->belongsTo(User::class, 'teacher_id'); }
    public function room(){return $this->belongsTo(\App\Models\Room::class);}
}

