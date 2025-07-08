<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::with('subject')->get();
        return response()->json([
            'data' => $teachers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname'     => ['required', 'string', 'max:50'],
            'lastname'      => ['required', 'string', 'max:50'],
            'date_of_birth' => ['required', 'date'],
            'gender'        => ['required', Rule::in(['m', 'f'])],
            'subject_id'    => ['required', 'exists:subjects,id'],
        ]);

        $teacher = Teacher::create($validated);
        $teacher->load('subject');

        return response()->json([
            'data'    => $teacher,
            'message' => 'Teacher created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        $teacher->load('subject');

        return response()->json([
            'data' => $teacher,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'firstname'     => ['sometimes', 'required', 'string', 'max:50'],
            'lastname'      => ['sometimes', 'required', 'string', 'max:50'],
            'date_of_birth' => ['sometimes', 'required', 'date'],
            'gender'        => ['sometimes', 'required', Rule::in(['m', 'f'])],
            'subject_id'    => ['sometimes', 'required', 'exists:subjects,id'],
        ]);

        $teacher->update($validated);
        $teacher->load('subject');

        return response()->json([
            'data'    => $teacher,
            'message' => 'Teacher updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return response()->json([
            'data'    => $teacher,
            'message' => 'Teacher deleted successfully',
        ]);
    }
}
