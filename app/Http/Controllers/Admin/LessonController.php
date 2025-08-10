<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Timetable;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Timetable $timetable)
    {
        $lessons = $timetable->lessons()
            ->with(['subject:id,name','teacher:id,firstname,lastname'])
            ->get();

        return response()->json(['data' => $lessons]);
    }
}
