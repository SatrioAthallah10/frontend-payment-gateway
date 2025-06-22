<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a superadmin user
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin12345')
        ]);
        $roleSuperAdmin = Role::firstOrCreate(['name' => 'superadmin']);
        $superadmin->assignRole($roleSuperAdmin);

        // Create a regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@user.com',
            'password' => bcrypt('user12345')
        ]);
        $roleUser = Role::firstOrCreate(['name' => 'user']);
        $user->assignRole($roleUser);
        
    }
}
