<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Admin\ParentAccountController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\DegreeController;

// PUBLIC
Route::post('/login', [AuthController::class, 'login']);

// PROTECTED — only accepts Bearer tokens
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn(Request $r) => response()->json($r->user()));

    Route::prefix('admin')->group(function () {
      Route::apiResource('parents',   ParentAccountController::class);
      Route::apiResource('teachers',  TeacherController::class);
      Route::apiResource('students',  StudentController::class);
      Route::apiResource('subjects',  SubjectController::class)->only('index');
      Route::apiResource('degrees',   DegreeController::class)->only('index');
    });
});
