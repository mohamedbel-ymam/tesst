<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DegreeController;

// --- AUTH ROUTES (all roles use the same login endpoint) ---
Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login'])->name('api.login');

// --- PROTECTED ROUTES ---
Route::middleware('auth:sanctum')->group(function () {

    // Get the current authenticated user
    Route::get('/me', function (Request $request) {
        return response()->json($request->user(), 200);
    });

    // --- USER MANAGEMENT (all roles handled by UserController) ---
    Route::prefix('admin')->group(function () {
        Route::apiResource('users', UserController::class);  // index, store, show, update, destroy

        // --- DEGREE MANAGEMENT ---
        Route::apiResource('degrees', DegreeController::class); // index, store, show, update, destroy
    });

    // --- LOGOUT ---
    Route::post('/logout', function (Request $request) {
        Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });
});
