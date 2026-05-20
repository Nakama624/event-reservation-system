<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Reservation extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'schedule_id',
        'contact_number',
        'participants',
        'amount',
        'payment_status',
        'payment_method_id',
        'payment_updated_by',
        'paid_at',
        'is_canceled',
    ];

    
    protected $casts = [
        'is_canceled' => 'boolean',
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function paymentMethod(): BelongsTo{
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
    
    public function schedule(): BelongsTo{
        return $this->belongsTo(Schedule::class);
    }
}
