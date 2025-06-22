<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Debt;
use App\Models\User;
use Illuminate\Support\Str;

class DebtSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::role('superadmin')->first();

        $debts = [
            [
                'id' => Str::uuid(),
                'user_id' => $superadmin->id,
                'name' => 'BPP',
                'description' => 'Biaya Penyelenggaraan Pendidikan (BPP)',
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $superadmin->id,
                'name' => 'Non BPP',
                'description' => 'biaya pendidikan selain Biaya Penyelenggaraan Pendidikan (BPP)',
            ],
        ];

        Debt::insert($debts);
    }
}
