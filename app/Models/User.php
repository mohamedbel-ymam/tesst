<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles;
use App\Enums\UserRole; // <-- keep if you’re using the enum cast below

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Spatie\Permission guard to use with this model.
     * (Sanctum session auth also uses the "web" guard.)
     */
    protected $guard_name = 'web';

    /* ----------------------------------------------------------------------
     | Relationships
     |-----------------------------------------------------------------------*/

    /** Student/Teacher may belong to a degree */
    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    /** Teacher may belong to a main subject (optional) */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * For students: their parent user (FK: student_parent_id).
     * Use either `parent()` or `parentUser()`—they point to the same relation.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'student_parent_id');
    }

    /** Backwards-compatible alias */
    public function parentUser()
    {
        return $this->parent();
    }

    /**
     * For parents: the children users (students) that reference them.
     * This is a HasMany, so in seeders/controllers use `$parent->children()->save($student)`
     * or `$student->parent()->associate($parent)->save()` (NOT syncWithoutDetaching).
     */
    public function children()
    {
        return $this->hasMany(User::class, 'student_parent_id');
    }

    /* ----------------------------------------------------------------------
     | Mass assignment / Hidden / Casts
     |-----------------------------------------------------------------------*/

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
        'role',            // string or enum-backed value
        'degree_id',       // students
        'subject_id',      // teachers (optional)
        'student_parent_id', // students → parent
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts  = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        // If your `role` column stores a PHP 8.1 backed enum value:
        // comment out if you're NOT using the enum.
        'role'              => UserRole::class,
    ];

    /* ----------------------------------------------------------------------
     | Convenience helpers (optional)
     |-----------------------------------------------------------------------*/

    public function getFullNameAttribute(): string
    {
        return trim("{$this->firstname} {$this->lastname}");
    }

    public function isAdmin(): bool    { return (string)$this->role === (string)(UserRole::ADMIN->value ?? 'admin'); }
    public function isTeacher(): bool  { return (string)$this->role === (string)(UserRole::TEACHER->value ?? 'teacher'); }
    public function isStudent(): bool  { return (string)$this->role === (string)(UserRole::STUDENT->value ?? 'student'); }
    public function isParent(): bool   { return (string)$this->role === (string)(UserRole::PARENT->value ?? 'parent'); }
}
