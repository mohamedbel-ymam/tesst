<?php

// app/Http/Controllers/Admin/TimetableController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Throwable;

class TimetableController extends Controller
{
    public function index(Request $r)
    {
        try {
            $perPage = (int) $r->input('per_page', 15);

            $q = Timetable::query()->with('degree:id,name');

            if ($r->filled('degree_id')) {
                $q->where('degree_id', $r->input('degree_id'));
            }

            $page = $q->orderByDesc('id')->paginate($perPage);

            // With zero rows, this still returns 200 and [].
            return response()->json([
                'data' => $page->items(),
                'meta' => [
                    'current_page' => $page->currentPage(),
                    'last_page'    => $page->lastPage(),
                    'per_page'     => $page->perPage(),
                    'total'        => $page->total(),
                ],
            ], 200);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'Timetables index failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
