<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_method',
    ];

    public function reservation(): HasOne
    {
        return $this->hasOne(Reservation::class);
    }
}
