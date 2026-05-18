<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'capacity',
        'lesson_img1',
        'lesson_img2',
        'lesson_img3',
        'catch_copy',
        'instructor_name',
        'instructor_img',
        'instructor_profile',
        'price',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
}
