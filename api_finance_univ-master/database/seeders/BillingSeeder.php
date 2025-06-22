<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Billing;
use App\Models\User;
use App\Models\Debt;
use Illuminate\Support\Str;

class BillingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::role('user')->get();
        $debts = Debt::all();

        foreach ($users as $user) {
            foreach ($debts as $debt) {
                // Create a billing record for each user and their associated debt
                Billing::create([
                    'id' => Str::uuid(),
                    'debt_id' => $debt->id,
                    'month' => now()->month,
                    'year' => now()->year,
                    'amount' => 1000000, // Example amount, adjust as needed
                    'status' => 'unpaid',
                    'description' => 'Billing for ' . $user->name,
                    'user_id' => $user->id,
                    'request_data' => null,
                    'response_data' => null,
                    'payment_method' => null,
                    'transaction_id' => null,
                    'payment_status' => null,
                    'payment_gateway' => null,
                    'requested_at' => null,
                    'paid_at' => null,
                    'expired_at' => null,
                    'created_by' => $user->name,
                    'updated_by' => $user->name,
                    'deleted_by' => null,
                ]);
            }
        }
    }
}
