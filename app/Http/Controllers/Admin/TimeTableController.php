<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $r)
    {
        $perPage = (int) $r->integer('per_page', 15);

        $page = Timetable::query()
            ->with('degree:id,name')
            ->when($r->filled('degree_id'), fn($q) => $q->where('degree_id', $r->degree_id))
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
}
