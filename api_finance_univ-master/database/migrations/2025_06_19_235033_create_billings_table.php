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
        Schema::create('billings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_id')->unique()->nullable();
            $table->foreignUuid('debt_id')->constrained()->onDelete('cascade');
            $table->integer('month')->nullable();
            $table->integer('year')->nullable();
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->string('status')->default('unpaid'); // unpaid, paid
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->json('request_data')->nullable();
            $table->json('response_data')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('payment_status')->default('pending')->nullable(); // pending, settled, expired
            $table->string('payment_gateway')->nullable(); // e.g., stripe, paypal, etc.
            $table->dateTime('requested_at')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('expired_at')->nullable();
            
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->string('deleted_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
