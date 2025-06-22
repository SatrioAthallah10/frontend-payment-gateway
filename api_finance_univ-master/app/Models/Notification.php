<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Notification extends Model
{
    //
    protected $fillable = [
        'billing_id',
        'order_id',
        'status',
        'payment_type',
        'transaction_id',
        'data'
    ];

    public function billing() : BelongsTo
    {
        return $this->belongsTo(Billing::class);
    }
}
