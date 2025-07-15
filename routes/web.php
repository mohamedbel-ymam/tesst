<?php
// routes/web.php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Load all the session‐based auth routes (login, register, logout, etc.)
require __DIR__ . '/auth.php';
