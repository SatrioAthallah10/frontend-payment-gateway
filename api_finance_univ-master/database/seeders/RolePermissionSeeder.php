<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    protected $roles = [
        'superadmin',
        'user'
    ];

    protected $rolePermissions = [
        'superadmin' => [
            'view kewajiban',
            'add kewajiban',
            'edit kewajiban',
            'delete kewajiban',

            'view billing',
            'add billing',
            'edit billing',
            'delete billing',
        ],
        'user' => [
            'view transaction',
            'add transaction',
            'edit transaction',
            'delete transaction',
        ],
    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        foreach ($this->roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Create permissions
        foreach ($this->rolePermissions as $roleName => $permissions) {
            foreach ($permissions as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName]);
            }
        }

        // Assign permissions to roles
        foreach ($this->rolePermissions as $roleName => $permissions) {
            $role = Role::findByName($roleName);
            foreach ($permissions as $permissionName) {
                $permission = Permission::findByName($permissionName);
                $role->givePermissionTo($permission);
            }
        }
    }
}
