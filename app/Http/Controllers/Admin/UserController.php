<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $r)
{
    $perPage = (int) $r->integer('per_page', 15);

    $users = User::query()
        ->when($r->filled('role'), fn ($q) => $q->where('role', $r->role))
        ->with([
            'subject:id,name',
            'degree:id,name',
            'parentUser:id,firstname,lastname',
        ])
        ->orderByDesc('id')
        ->paginate($perPage);

    return response()->json([
        'data' => $users->items(),  // only the current page items
        'meta' => [
            'current_page' => $users->currentPage(),
            'last_page'    => $users->lastPage(),
            'per_page'     => $users->perPage(),
            'total'        => $users->total(),
        ],
    ]);
}

    public function store(Request $r)
{
    // Base rules for all roles
    $data = $r->validate([
        'firstname'        => 'required|string|max:255',
        'lastname'         => 'required|string|max:255',
        'email'            => 'required|email|unique:users',
        'password'         => 'required|min:8',
        'role'             => 'required|in:admin,teacher,student,parent',
        'address'          => 'nullable|string|max:255',
        'phone'            => 'nullable|string|max:50',
        'gender'           => 'nullable|in:m,f',
        'blood_type'       => 'nullable|string|max:10',
        'date_of_birth'    => 'nullable|date',
        'degree_id'        => 'nullable|exists:degrees,id',
        'subject_id'       => 'nullable|exists:subjects,id',
        'student_parent_id'=> 'nullable|exists:users,id',
    ]);

    // Role-specific requirements
    if ($data['role'] === 'teacher') {
        $r->validate(['subject_id' => 'required|exists:subjects,id']);
    }
    if ($data['role'] === 'student') {
        $r->validate(['degree_id' => 'required|exists:degrees,id']);
        // parent may remain nullable if not always assigned
    }

    $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
    $user = User::create($data)->load([
        'subject:id,name',
        'degree:id,name',
        'parentUser:id,firstname,lastname',
    ]);

    return response()->json(['data' => $user, 'message' => 'User created successfully'], 201);
}
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['data' => $user]);
    }

    public function update(Request $r, $id)
{
    $user = User::findOrFail($id);

    $data = $r->validate([
        'firstname'         => 'sometimes|string|max:255',
        'lastname'          => 'sometimes|string|max:255',
        'email'             => "sometimes|email|unique:users,email,{$id}",
        'password'          => 'nullable|min:8',
        'role'              => 'sometimes|in:admin,teacher,student,parent',
        'address'           => 'nullable|string|max:255',
        'phone'             => 'nullable|string|max:50',
        'gender'            => 'nullable|in:m,f',
        'blood_type'        => 'nullable|string|max:10',
        'date_of_birth'     => 'nullable|date',
        'degree_id'         => 'nullable|exists:degrees,id',
        'subject_id'        => 'nullable|exists:subjects,id',
        'student_parent_id' => 'nullable|exists:users,id',
    ]);

    if (!empty($data['password'])) {
        $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
    } else {
        unset($data['password']);
    }

    // Optional: enforce role-specific fields on update too
    if (($data['role'] ?? $user->role) === 'teacher' && empty($data['subject_id']) && !$user->subject_id) {
        return response()->json(['errors' => ['subject_id' => ['Subject is required for teachers.']]], 422);
    }
    if (($data['role'] ?? $user->role) === 'student' && empty($data['degree_id']) && !$user->degree_id) {
        return response()->json(['errors' => ['degree_id' => ['Degree is required for students.']]], 422);
    }

    $user->update($data);
    $user->load(['subject:id,name', 'degree:id,name', 'parentUser:id,firstname,lastname']);

    return response()->json(['data' => $user, 'message' => 'User updated successfully']);
}

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->noContent();
    }
}
