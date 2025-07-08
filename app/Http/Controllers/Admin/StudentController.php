<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with('degree')->get();

        return response()->json([
            'data' => $students,
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
            'address'       => ['required', 'string', 'max:255'],
            'phone'         => ['required', 'string', 'max:20'],
            'email'         => ['required', 'email', 'max:100', 'unique:students,email'],
            'password'      => ['required', 'string', 'min:8'],
            'degree_id'     => ['required', 'exists:degrees,id'],
        ]);

        // hash the password
        $validated['password'] = Hash::make($validated['password']);

        $student = Student::create($validated);
        $student->load('degree');

        return response()->json([
            'data'    => $student,
            'message' => 'Student created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        $student->load('degree');

        return response()->json([
            'data' => $student,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'firstname'     => ['sometimes', 'required', 'string', 'max:50'],
            'lastname'      => ['sometimes', 'required', 'string', 'max:50'],
            'date_of_birth' => ['sometimes', 'required', 'date'],
            'gender'        => ['sometimes', 'required', Rule::in(['m', 'f'])],
            'address'       => ['sometimes', 'required', 'string', 'max:255'],
            'phone'         => ['sometimes', 'required', 'string', 'max:20'],
            'email'         => ['sometimes', 'required', 'email', 'max:100', Rule::unique('students','email')->ignore($student->id)],
            'password'      => ['sometimes', 'required', 'string', 'min:8'],
            'degree_id'     => ['sometimes', 'required', 'exists:degrees,id'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $student->update($validated);
        $student->load('degree');

        return response()->json([
            'data'    => $student,
            'message' => 'Student updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'data'    => $student,
            'message' => 'Student deleted successfully',
        ]);
    }
}
