<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('billing_id')->constrained('billings')->onDelete('cascade');
            $table->string('order_id');
            $table->string('status')->default('pending'); // pending, settlement, expired, failed
            $table->string('payment_type')->nullable(); // e.g., 'credit_card', 'bank_transfer'
            $table->string('transaction_id')->nullable(); // Unique transaction identifier
            $table->json('data')->nullable(); // Data sent to payment gateway
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
