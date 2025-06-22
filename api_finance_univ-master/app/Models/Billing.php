<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Debt;
use App\Models\User;

class Billing extends Model
{
    use SoftDeletes, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'debt_id',
        'month',
        'year',
        'amount',
        'status',
        'description',
        'user_id',
        'request_data',
        'response_data',
        'payment_method',
        'transaction_id',
        'payment_status',
        'payment_gateway',
        'requested_at',
        'paid_at',
        'expired_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function debt() : BelongsTo
    {
        return $this->belongsTo(Debt::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
