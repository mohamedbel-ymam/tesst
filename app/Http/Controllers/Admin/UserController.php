<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $r)
    {
        // per_page: clamp to [1, 200]
        $perPage = (int) $r->query('per_page', 15);
        $perPage = max(1, min($perPage, 200));

        $query = User::query()
            ->with([
                'subject:id,name',
                'degree:id,name',
                'parentUser:id,firstname,lastname',
            ])
            // only real columns selected
            ->select([
                'id','firstname','lastname','email',
                'degree_id','subject_id','student_parent_id',
                'created_at','updated_at'
            ]);

        // Filter by role (?role=teacher)
        if ($r->filled('role')) {
            $role = (string) $r->query('role');

            // prefer Spatie if its tables exist; fallback to legacy users.role
            $modelHasRoles = config('permission.table_names.model_has_roles', 'model_has_roles');

            if (Schema::hasTable($modelHasRoles)) {
                try {
                    // explicit guard avoids mismatches with Sanctum SPA
                    $query->role($role, 'web');
                } catch (\Throwable $e) {
                    $query->where('role', $role);
                }
            } else {
                $query->where('role', $role);
            }
        }

        // Optional search (?q=smith)
        if ($r->filled('q')) {
            $q = trim((string) $r->query('q', ''));
            if ($q !== '') {
                $query->where(function ($sub) use ($q) {
                    $sub->where('firstname', 'like', "%{$q}%")
                        ->orWhere('lastname', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%");
                });
            }
        }

        $query->orderByDesc('id');

        $page = $query->paginate($perPage);

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
        // Base rules for all roles
        $data = $r->validate([
            'firstname'          => 'required|string|max:255',
            'lastname'           => 'required|string|max:255',
            'email'              => 'required|email|unique:users,email',
            'password'           => 'required|min:8',
            'role'               => 'required|in:admin,teacher,student,parent',
            'address'            => 'nullable|string|max:255',
            'phone'              => 'nullable|string|max:50',
            'gender'             => 'nullable|in:m,f',
            'blood_type'         => 'nullable|string|max:10',
            'date_of_birth'      => 'nullable|date',
            'degree_id'          => 'nullable|exists:degrees,id',
            'subject_id'         => 'nullable|exists:subjects,id',
            'student_parent_id'  => 'nullable|exists:users,id',
        ]);

        // Role-specific requirements
        if ($data['role'] === 'teacher') {
            $r->validate(['subject_id' => 'required|exists:subjects,id']);
        }
        if ($data['role'] === 'student') {
            $r->validate(['degree_id' => 'required|exists:degrees,id']);
        }

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data)->load([
            'subject:id,name',
            'degree:id,name',
            'parentUser:id,firstname,lastname',
        ]);

        // Sync Spatie role if tables exist (won't crash if not)
        $modelHasRoles = config('permission.table_names.model_has_roles', 'model_has_roles');
        if (Schema::hasTable($modelHasRoles)) {
            try {
                $user->syncRoles([$data['role']]);
            } catch (\Throwable $e) {
                // ignore to avoid 500; legacy users.role still set
            }
        }

        return response()->json([
            'data'    => $user,
            'message' => 'User created successfully',
        ], 201);
    }

    public function show($id)
    {
        $user = User::with([
            'subject:id,name',
            'degree:id,name',
            'parentUser:id,firstname,lastname',
        ])->findOrFail($id);

        return response()->json(['data' => $user]);
    }

    public function update(Request $r, $id)
    {
        $user = User::findOrFail($id);

        $data = $r->validate([
            'firstname'          => 'sometimes|string|max:255',
            'lastname'           => 'sometimes|string|max:255',
            'email'              => ['sometimes','email', Rule::unique('users','email')->ignore($user->id)],
            'password'           => 'nullable|min:8',
            'role'               => 'sometimes|in:admin,teacher,student,parent',
            'address'            => 'nullable|string|max:255',
            'phone'              => 'nullable|string|max:50',
            'gender'             => 'nullable|in:m,f',
            'blood_type'         => 'nullable|string|max:10',
            'date_of_birth'      => 'nullable|date',
            'degree_id'          => 'nullable|exists:degrees,id',
            'subject_id'         => 'nullable|exists:subjects,id',
            'student_parent_id'  => 'nullable|exists:users,id',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Enforce role-specific on update too (only if missing both old & new)
        $effectiveRole = $data['role'] ?? $user->role;
        if ($effectiveRole === 'teacher' && empty($data['subject_id']) && !$user->subject_id) {
            return response()->json(['errors' => ['subject_id' => ['Subject is required for teachers.']]], 422);
        }
        if ($effectiveRole === 'student' && empty($data['degree_id']) && !$user->degree_id) {
            return response()->json(['errors' => ['degree_id' => ['Degree is required for students.']]], 422);
        }

        $user->update($data);

        // Sync Spatie role if provided & tables exist
        if (!empty($data['role'])) {
            $modelHasRoles = config('permission.table_names.model_has_roles', 'model_has_roles');
            if (Schema::hasTable($modelHasRoles)) {
                try {
                    $user->syncRoles([$data['role']]);
                } catch (\Throwable $e) {
                    // ignore to avoid 500
                }
            }
        }

        $user->load(['subject:id,name','degree:id,name','parentUser:id,firstname,lastname']);

        return response()->json([
            'data'    => $user,
            'message' => 'User updated successfully',
        ]);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->noContent();
    }
}
