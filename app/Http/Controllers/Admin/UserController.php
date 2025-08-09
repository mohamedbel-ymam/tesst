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
        // Optional: filter by role, search by name/email, etc.
        return User::when($r->role, fn($q) => $q->where('role', $r->role))
                   ->paginate();
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'firstname'   => 'required|string|max:255',
            'lastname'    => 'required|string|max:255',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|min:8',
            'role'        => 'required|in:admin,teacher,student,parent',
            'degree_id'   => 'nullable|exists:degrees,id',  // For students only
            'address'     => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'gender'      => 'nullable|in:m,f',
            'blood_type'  => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
            // Add other common fields as needed
        ]);
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
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
            'firstname'   => 'sometimes|string|max:255',
            'lastname'    => 'sometimes|string|max:255',
            'email'       => "sometimes|email|unique:users,email,{$id}",
            'password'    => 'nullable|min:8',
            'role'        => 'sometimes|in:admin,teacher,student,parent',
            'degree_id'   => 'nullable|exists:degrees,id',
            'address'     => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'gender'      => 'nullable|in:m,f',
            'blood_type'  => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
        ]);
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $user->update($data);
        return response()->json(['data' => $user, 'message' => 'User updated successfully']);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->noContent();
    }
}
