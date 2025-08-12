<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userRole = strtolower((string) $user->role);
        $roles    = array_map('strtolower', $roles);

        if (!in_array($userRole, $roles, true)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}
