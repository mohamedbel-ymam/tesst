<?php

namespace App\Http\Controllers;
use App\Models\Timetable;
use App\Models\Lesson;
use Illuminate\Http\Request;

class TimetableViewController extends Controller
{
  public function student(Request $r) {
    $user = $r->user()->load('degree:id,name');
    if ($user->role !== 'student' || !$user->degree_id) {
      return response()->json(['errors'=>['auth'=>['Not a student or no degree assigned']]], 403);
    }
    // latest timetable for this degree (change policy if you prefer explicit pick)
    $timetable = Timetable::where('degree_id',$user->degree_id)->latest('id')->first();
    if (!$timetable) return response()->json(['data'=>['timetable'=>null,'lessons'=>[]]]);
    $lessons = $timetable->lessons()->with(['subject:id,name','teacher:id,firstname,lastname'])->get();
    return response()->json(['data'=>['timetable'=>$timetable,'lessons'=>$lessons]]);
  }

  public function teacher(Request $r) {
    $teacherId = $r->user()->id;
    if ($r->user()->role !== 'teacher') {
      return response()->json(['errors'=>['auth'=>['Not a teacher']]], 403);
    }
    // all upcoming lessons grouped by timetable
    $lessons = Lesson::with(['subject:id,name','timetable.degree:id,name'])
      ->where('teacher_id',$teacherId)
      ->orderBy('day_of_week')->orderBy('start_time')
      ->get();
    return response()->json(['data'=>['lessons'=>$lessons]]);
  }
}