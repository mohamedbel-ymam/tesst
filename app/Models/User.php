<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Use the same guard you authenticate with.
     * (Sanctum session auth uses the "web" guard.)
     */
    protected string $guard_name = 'web';

    /** -------------------- Relations -------------------- */
    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // For students: the linked parent user
    public function parentUser()
    {
        return $this->belongsTo(User::class, 'student_parent_id');
    }

    /** -------------------- Mass assignment -------------------- */
    protected $fillable = [
        'firstname',
        'lastname',
        'date_of_birth',
        'gender',
        'blood_type',
        'address',
        'phone',
        'email',
        'password',
        // NOTE: do NOT rely on a 'role' column with Spatie.
        // If you still have it in your DB for legacy display, you may keep it,
        // but filtering/authorization must use Spatie roles.
        // 'role',
        'degree_id',          // students
        'subject_id',         // teachers
        'student_parent_id',  // students -> parent
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts  = [
        'email_verified_at' => 'datetime',
        // Laravel 10+ will hash automatically when setting $user->password = 'plain';
        'password'          => 'hashed',
    ];
}
