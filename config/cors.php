<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

'paths' => [
    'api/*',
    'sanctum/csrf-cookie',
    'login',
    'logout',
    'register',
    'forgot-password',
    'reset-password',
    'email/verification-notification',
    'verify-email/*',
],
'allowed_methods'   => ['*'],
'allowed_origins'   => ['http://localhost:3000'],
'allowed_headers'   => ['*'],
'supports_credentials' => true,

];
