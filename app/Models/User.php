<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'firstname','lastname','date_of_birth','gender',
        'blood_type','address','phone','email',
        'password','role'
    ];

    protected $hidden = ['password','remember_token'];
    protected $casts  = ['email_verified_at' => 'datetime'];
}
