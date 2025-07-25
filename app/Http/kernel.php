<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Illuminate\Cookie\Middleware\EncryptCookies;
// Import the middleware you need:
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as MiddlewareVerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Middleware\EnsureStudentHasCorrectDegree;


class Kernel extends HttpKernel
{
    // app/Http/Kernel.php

protected $middlewareGroups = [
    'web' => [
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
        ShareErrorsFromSession::class,
        MiddlewareVerifyCsrfToken::class,
        SubstituteBindings::class,
    ],

    'api' => [
        // ← this middleware makes /api/* honor your session cookie & CSRF token
        EnsureFrontendRequestsAreStateful::class,

        // throttling and route-model bindings as usual
        'throttle:api',
        SubstituteBindings::class,
    ],

    'lock.degree' => EnsureStudentHasCorrectDegree::class,
];

}