<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Timetables (single controller for admin + views)
use App\Http\Controllers\TimetableController;

// Admin CRUD you already have
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DegreeController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\RoomController;

/**
 * PUBLIC
 */
Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'login'])
    ->name('api.login');

/**
 * PROTECTED (Sanctum)
 */
Route::middleware('auth:sanctum')->group(function () {

    // whoami
    Route::get('/me', fn(Request $r) => $r->user()->load('degree:id,name'));

    /**
     * ADMIN-ONLY
     */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // simple health check
        Route::get('ping', fn() => response()->json(['ok' => true]));

        // existing admin resources
        Route::apiResource('users',    UserController::class);
        Route::apiResource('degrees',  DegreeController::class);
        Route::apiResource('subjects', SubjectController::class);
    
        Route::apiResource('rooms', RoomController::class)->only(['index','store','show','update','destroy']);

        // Timetable admin list + CRUD (rows)
        Route::get(   '/timetables',        [TimetableController::class, 'adminList']);
        Route::post('/timetables',          [TimetableController::class, 'store']);
        Route::put(   '/timetables/{id}',   [TimetableController::class, 'update']);
        Route::delete('/timetables/{id}',   [TimetableController::class, 'destroy']);
    });

    /**
     * Role-based views
     */
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        Route::get('/timetable', [TimetableController::class, 'teacher']);
    });

    Route::prefix('student')->middleware('role:student')->group(function () {
        Route::get('/timetable', [TimetableController::class, 'student']);
    });

    Route::prefix('parent')->middleware('role:parent')->group(function () {
        Route::get('/timetable', [TimetableController::class, 'parent']);
    });

    // logout
    Route::post('/logout', function (Request $request) {
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });
});
