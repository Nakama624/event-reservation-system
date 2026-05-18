<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContactStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
    ];

    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class);
    }
}
