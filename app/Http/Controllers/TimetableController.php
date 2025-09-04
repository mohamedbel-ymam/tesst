<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class TimetableController extends Controller
{
    /** Admin listing with optional filters. */
    public function adminList(Request $req)
    {
        $q = Timetable::with([
            'subject:id,name',
            'degree:id,name',
            'room:id,name',
            'teacher:id,firstname,lastname',
        ]);

        if ($t = $req->query('teacher_id')) $q->where('teacher_id', $t);
        if ($d = $req->query('degree_id'))  $q->where('degree_id', $d);

        return $q->orderBy('degree_id')
                 ->orderBy('day_of_week')
                 ->orderBy('period')
                 ->paginate((int)$req->query('per_page', 100));
    }

    /** Create (period OR start/end time required). Auto-fill title if column exists. */
    public function store(Request $request)
    {
        // Normalize FE keys
        $request->merge([
            'start_time' => $request->input('start_time') ?? $request->input('starts_at'),
            'end_time'   => $request->input('end_time')   ?? $request->input('ends_at'),
        ]);

        $data = $request->validate([
            'degree_id'   => ['required','exists:degrees,id'],
            'subject_id'  => ['required','exists:subjects,id'],
            'teacher_id'  => ['required','exists:users,id'],
            'room_id'     => ['nullable','exists:rooms,id'],
            'day_of_week' => ['required','integer', Rule::in([1,2,3,4,5,6,7])],

            // Either period OR time range
            'period'      => ['nullable','integer','min:1','required_without_all:start_time,end_time'],
            'start_time'  => ['nullable','date_format:H:i','required_without:period'],
            'end_time'    => ['nullable','date_format:H:i','required_with:start_time','after:start_time'],

            // Let clients optionally send title; we’ll also compose one if missing
            'title'       => ['sometimes','string','max:255'],
        ]);

        // Auto-compose title only if the column exists and it's empty
        if (Schema::hasColumn('timetables', 'title') && empty($data['title'])) {
            $data['title'] = $this->composeTitle($data);
        }

        $row = Timetable::create($data)->load([
            'subject:id,name',
            'degree:id,name',
            'room:id,name',
            'teacher:id,firstname,lastname',
        ]);

        return response()->json(['data' => $row], 201);
    }

    /** Update; recompose title if relevant fields change (when column exists). */
    public function update(Request $request, Timetable $timetable)
    {
        $request->merge([
            'start_time' => $request->input('start_time') ?? $request->input('starts_at'),
            'end_time'   => $request->input('end_time')   ?? $request->input('ends_at'),
        ]);

        $data = $request->validate([
            'degree_id'   => ['sometimes','exists:degrees,id'],
            'subject_id'  => ['sometimes','exists:subjects,id'],
            'teacher_id'  => ['sometimes','exists:users,id'],
            'room_id'     => ['sometimes','nullable','exists:rooms,id'],
            'day_of_week' => ['sometimes','integer', Rule::in([1,2,3,4,5,6,7])],
            'period'      => ['sometimes','nullable','integer','min:1'],
            'start_time'  => ['sometimes','nullable','date_format:H:i'],
            'end_time'    => ['sometimes','nullable','date_format:H:i','after:start_time'],
            'title'       => ['sometimes','string','max:255'],
        ]);

        // Validate the invariant: either period or time range after merging
        $period     = array_key_exists('period', $data)     ? $data['period']     : $timetable->period;
        $start_time = array_key_exists('start_time', $data) ? $data['start_time'] : $timetable->start_time;
        $end_time   = array_key_exists('end_time', $data)   ? $data['end_time']   : $timetable->end_time;

        if (empty($period) && (empty($start_time) || empty($end_time))) {
            return response()->json([
                'message' => 'Provide either a period or start_time & end_time (HH:MM).',
            ], 422);
        }

        // Recompose title if the column exists and user didn’t explicitly set it,
        // but any of the ingredients changed.
        if (Schema::hasColumn('timetables', 'title') && !array_key_exists('title', $data)) {
            $dirtyPreview = array_merge($timetable->only([
                'subject_id','teacher_id','day_of_week','period','start_time','end_time'
            ]), $data);

            $data['title'] = $this->composeTitle($dirtyPreview);
        }

        $timetable->update($data);

        return response()->json([
            'data' => $timetable->fresh()->load([
                'subject:id,name','degree:id,name','room:id,name','teacher:id,firstname,lastname'
            ]),
        ]);
    }

    public function destroy(Timetable $timetable)
    {
        $timetable->delete();
        return response()->noContent();
    }

    /** ---------- helpers ---------- */

    private function composeTitle(array $d): string
    {
        // subject & teacher names are best-effort
        $subject = !empty($d['subject_id']) ? optional(Subject::find($d['subject_id']))->name : null;
        $teacher = !empty($d['teacher_id']) ? optional(User::find($d['teacher_id'])) : null;

        $teacherName = $teacher ? trim(($teacher->firstname ?? '').' '.($teacher->lastname ?? '')) : null;

        $day = [
            1=>'Mon',2=>'Tue',3=>'Wed',4=>'Thu',5=>'Fri',6=>'Sat',7=>'Sun'
        ][$d['day_of_week'] ?? null] ?? 'Day';

        $when = null;
        if (!empty($d['start_time']) && !empty($d['end_time'])) {
            $when = "{$day} {$d['start_time']}–{$d['end_time']}";
        } elseif (!empty($d['period'])) {
            $when = "{$day} • Period {$d['period']}";
        } else {
            $when = $day;
        }

        // Build: "<Subject> — <When> [— <Teacher>]"
        $pieces = array_filter([
            $subject ?: 'Lesson',
            $when,
            $teacherName ? "— {$teacherName}" : null,
        ]);

        return implode(' — ', $pieces);
    }
}
