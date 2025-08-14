<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $r)
    {
        $perPage = (int) $r->input('per_page', 15);

        $page = Timetable::query()
            ->with('degree:id,name')
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'data' => $page->items(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page'    => $page->lastPage(),
                'per_page'     => $page->perPage(),
                'total'        => $page->total(),
            ],
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'degree_id'  => ['required','exists:degrees,id'],
            'title'      => ['required','string','max:150'],
            'week_start' => ['nullable','date'],
        ]);

        $tt = Timetable::create($data);

        return response()->json([
            'data'    => $tt->load('degree:id,name'),
            'message' => 'Timetable created',
        ], 201);
    }

    public function show(Timetable $timetable)
    {
        return response()->json(['data' => $timetable->load('degree:id,name')]);
    }

    public function update(Request $r, Timetable $timetable)
    {
        $data = $r->validate([
            'degree_id'  => ['sometimes','exists:degrees,id'],
            'title'      => ['sometimes','string','max:150'],
            'week_start' => ['nullable','date'],
        ]);

        $timetable->update($data);

        return response()->json([
            'data'    => $timetable->load('degree:id,name'),
            'message' => 'Timetable updated',
        ]);
    }

    public function destroy(Timetable $timetable)
    {
        $timetable->delete();
        return response()->noContent();
    }
}
