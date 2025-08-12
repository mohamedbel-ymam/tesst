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
    Route::get('/me', fn(\Illuminate\Http\Request $r) => $r->user()->load('degree:id,name'));

    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
       Route::get('ping', fn() => response()->json(['ok' => true]));
        Route::apiResource('users',      \App\Http\Controllers\Admin\UserController::class);
        Route::apiResource('degrees',    \App\Http\Controllers\Admin\DegreeController::class);
        Route::apiResource('subjects',   \App\Http\Controllers\Admin\SubjectController::class);
        Route::apiResource('timetables', \App\Http\Controllers\Admin\TimetableController::class);
        Route::apiResource('timetables.lessons', \App\Http\Controllers\Admin\LessonController::class)->shallow();
    });

    Route::get('/student/timetable', [\App\Http\Controllers\TimetableViewController::class, 'student']);
    Route::get('/teacher/timetable', [\App\Http\Controllers\TimetableViewController::class, 'teacher']);

    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });
});