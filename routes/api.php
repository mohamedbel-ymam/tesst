<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DegreeController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TimetableController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\TimetableViewController;

// --- AUTH ROUTES (all roles use the same login endpoint) ---
Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login'])->name('api.login');

// --- PROTECTED ROUTES ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $r) => $r->user()->load('degree:id,name'));

    // ADMIN-ONLY (one group)
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::apiResource('users',      UserController::class);
        Route::apiResource('degrees',    DegreeController::class);
        Route::apiResource('subjects',   SubjectController::class);
        Route::apiResource('timetables', TimetableController::class);
        Route::apiResource('timetables.lessons', LessonController::class)->shallow();
    });

    // Role-based views
    Route::get('/student/timetable', [TimetableViewController::class, 'student']);
    Route::get('/teacher/timetable', [TimetableViewController::class, 'teacher']);

    Route::post('/logout', function (Request $request) {
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });
});