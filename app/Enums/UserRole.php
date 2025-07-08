<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case TEACHER = 'teacher';
    case PARENT = 'parent';
    case STUDENT = 'student';
}
