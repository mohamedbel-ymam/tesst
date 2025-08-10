<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ---- Relations ----
    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function subject()
    {
        // for teachers
        return $this->belongsTo(Subject::class);
    }

    public function parentUser()
    {
        // for students: FK -> users.id
        return $this->belongsTo(User::class, 'student_parent_id');
    }
    protected function casts(): array
        {
            return [
                'role' => 'string',
            ];
        }

    public function setRoleAttribute($value)
        {
            $this->attributes['role'] = strtolower($value);
        }


    // ---- Mass assignment ----
    protected $fillable = [
        'firstname','lastname','date_of_birth','gender',
        'blood_type','address','phone','email',
        'password','role',
        'degree_id',          // students
        'subject_id',         // teachers
        'student_parent_id',  // students
    ];

    protected $hidden = ['password','remember_token'];
    protected $casts  = ['email_verified_at' => 'datetime'];
}
