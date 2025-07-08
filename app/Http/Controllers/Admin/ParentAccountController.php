<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ParentAccountController extends Controller
{
    /**
     * Display a listing of parent accounts.
     */
    public function index()
    {
        $parents = User::where('role', UserRole::PARENT->value)
                       ->orderBy('created_at', 'desc')
                       ->get();

        return response()->json([
            'data' => $parents,
        ]);
    }

    /**
     * Store a newly created parent account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname'     => ['required', 'string', 'max:255'],
            'lastname'      => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'      => ['required', 'string', 'min:6'],
            'phone'         => ['nullable', 'string', 'max:15'],
            'address'       => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'gender'        => ['nullable', Rule::in(['m', 'f'])],
            'blood_type'    => ['nullable', 'string', 'max:5'],
        ]);

        $parent = User::create([
            'firstname'     => $validated['firstname'],
            'lastname'      => $validated['lastname'],
            'email'         => $validated['email'],
            'password'      => Hash::make($validated['password']),
            'phone'         => $validated['phone'] ?? null,
            'address'       => $validated['address'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender'        => $validated['gender'] ?? null,
            'blood_type'    => $validated['blood_type'] ?? null,
            'role'          => UserRole::PARENT->value,
        ]);

        return response()->json([
            'data'    => $parent,
            'message' => 'Parent created successfully',
        ], 201);
    }

    /**
     * Display the specified parent account.
     */
    public function show(User $parent)
    {
        abort_if($parent->role !== UserRole::PARENT->value, 404);

        return response()->json([
            'data' => $parent,
        ]);
    }

    /**
     * Update the specified parent account.
     */
    public function update(Request $request, User $parent)
    {
        abort_if($parent->role !== UserRole::PARENT->value, 404);

        $validated = $request->validate([
            'firstname'     => ['sometimes', 'required', 'string', 'max:255'],
            'lastname'      => ['sometimes', 'required', 'string', 'max:255'],
            'email'         => [
                'sometimes', 'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($parent->id),
            ],
            'password'      => ['nullable', 'string', 'min:6'],
            'phone'         => ['nullable', 'string', 'max:15'],
            'address'       => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'gender'        => ['nullable', Rule::in(['m', 'f'])],
            'blood_type'    => ['nullable', 'string', 'max:5'],
        ]);

        // Hash new password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $parent->update($validated);

        return response()->json([
            'data'    => $parent,
            'message' => 'Parent updated successfully',
        ]);
    }

    /**
     * Remove the specified parent account.
     */
    public function destroy(User $parent)
    {
        abort_if($parent->role !== UserRole::PARENT->value, 404);

        $parent->delete();

        return response()->json([
            'data'    => $parent,
            'message' => 'Parent deleted successfully',
        ]);
    }
}
