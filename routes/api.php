<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::middleware('auth:sanctum')->group(function () {
    // “Who am I?”
    Route::get('me', function (Request $request) {
        return response()->json($request->user(), 200);
    })->name('api.me');

    // API logout (session)
    Route::post('logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out'], 200);
    })->name('api.logout');

    // …your other API resources…
});
