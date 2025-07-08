<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of subjects.
     */
    public function index()
    {
        // Eager‐load any relations if needed, e.g. ->with('teachers')
        $subjects = Subject::all();

        return response()->json([
            'data' => $subjects,
        ]);
    }

    /**
     * (Optional) Store a newly created subject.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'data'    => $subject,
            'message' => 'Subject created successfully',
        ], 201);
    }

    /**
     * (Optional) Display the specified subject.
     */
    public function show(Subject $subject)
    {
        return response()->json([
            'data' => $subject,
        ]);
    }

    /**
     * (Optional) Update the specified subject.
     */
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $subject->update($validated);

        return response()->json([
            'data'    => $subject,
            'message' => 'Subject updated successfully',
        ]);
    }

    /**
     * (Optional) Remove the specified subject.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json([
            'data'    => $subject,
            'message' => 'Subject deleted successfully',
        ]);
    }
}
