<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;
    public function degree()
{
    return $this->belongsTo(Degree::class);
}
    

    protected $fillable = [
        'firstname','lastname','date_of_birth','gender',
        'blood_type','address','phone','email',
        'password','role','degree_id'
    ];

    protected $hidden = ['password','remember_token'];
    protected $casts  = ['email_verified_at' => 'datetime'];
}
