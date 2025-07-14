<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // app/Http/Kernel.php

protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'api' => [
        // ← this middleware makes /api/* honor your session cookie & CSRF token
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

        // throttling and route-model bindings as usual
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'lock.degree' => \App\Http\Middleware\EnsureStudentHasCorrectDegree::class,
];

}