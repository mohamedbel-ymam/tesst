<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\ParentAccountController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\DegreeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These all get the "api" middleware group with Sanctum’s SPA support
| (session + CSRF) and rate-limits.
|
*/

// PUBLIC: login via session cookie
Route::post('login', function (LoginRequest $request) {
    $request->authenticate();
    $request->session()->regenerate();
    return response()->json(['user' => $request->user()], 200);
})->name('login');

// PROTECTED: only accessible once the laravel_session cookie is sent
Route::middleware(['auth:sanctum'])->group(function () {
    // get current user
    Route::get('me', function (Request $request) {
        return response()->json($request->user(), 200);
    });

    // logout
    Route::post('logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out'], 200);
    });
    Route::prefix('admin')->group(function () {
      Route::apiResource('parents',   ParentAccountController::class);
      Route::apiResource('teachers',  TeacherController::class);
      Route::apiResource('students',  StudentController::class);
      Route::apiResource('subjects',  SubjectController::class)->only('index');
      Route::apiResource('degrees',   DegreeController::class)->only('index');
    });
});
