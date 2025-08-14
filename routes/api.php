<?php

use Illuminate\Support\Facades\Route;

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
    Route::get('/me', fn(\Illuminate\Http\Request $r) => $r->user()->load('degree:id,name'));

    /**
     * ADMIN-ONLY
     */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // simple health check
        Route::get('ping', fn() => response()->json(['ok' => true]));

        Route::apiResource('users',      \App\Http\Controllers\Admin\UserController::class);
        Route::apiResource('degrees',    \App\Http\Controllers\Admin\DegreeController::class);
        Route::apiResource('subjects',   \App\Http\Controllers\Admin\SubjectController::class);

        Route::apiResource('timetables', \App\Http\Controllers\Admin\TimetableController::class);
        Route::apiResource('timetables.lessons', \App\Http\Controllers\Admin\LessonController::class)
              ->shallow();
    });

    /**
     * Role-based views
     */
    Route::get('/student/timetable', [\App\Http\Controllers\TimetableViewController::class, 'student']);
    Route::get('/teacher/timetable', [\App\Http\Controllers\TimetableViewController::class, 'teacher']);

    // logout
    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['message' => 'Logged out'], 200);
    });
});
