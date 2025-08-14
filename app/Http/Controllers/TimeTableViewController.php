<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Models\Lesson;
use Illuminate\Http\Request;

class TimetableViewController extends Controller
{
    // Student sees timetable of their assigned degree
    public function student(Request $r)
    {
        $user = $r->user()->load('degree:id,name');

        if (!$user || $user->role !== 'student' || !$user->degree_id) {
            return response()->json([
                'message' => 'No degree assigned or not a student',
            ], 403);
        }

        $timetable = Timetable::where('degree_id', $user->degree_id)
            ->latest('id')
            ->first();

        if (!$timetable) {
            return response()->json([
                'data'    => ['timetable' => null, 'lessons' => []],
                'message' => 'No timetable attributed yet',
            ], 200);
        }

        $lessons = Lesson::with(['subject:id,name', 'teacher:id,firstname,lastname'])
            ->where('timetable_id', $timetable->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => [
                'timetable' => $timetable->load('degree:id,name'),
                'lessons'   => $lessons,
            ],
        ]);
    }

    // Teacher sees all their lessons (across timetables) grouped by day
    public function teacher(Request $r)
    {
        $user = $r->user();
        if (!$user || $user->role !== 'teacher') {
            return response()->json(['message' => 'Not a teacher'], 403);
        }

        $lessons = Lesson::with(['subject:id,name', 'timetable.degree:id,name'])
            ->where('teacher_id', $user->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json(['data' => ['lessons' => $lessons]]);
    }
}
