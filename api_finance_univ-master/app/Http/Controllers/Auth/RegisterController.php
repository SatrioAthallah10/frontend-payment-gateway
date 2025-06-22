<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Http\Resources\RegisterResource;
use App\Http\Resources\ErrorResource;
class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:superadmin,user',
        ]);

        // Check if the user already exists
        if (User::where('email', $request->input('email'))->exists()) {
            return (new ErrorResource(['message' => 'User already exists']))
                ->response()
                ->setStatusCode(422);
        }

        $role = Role::where('name', $request->input('role'))->first();

        if(!$role) {
            $role = Role::create(['name' => $request->input('role')]);
        }
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
        ]);

        $user->assignRole($role);

        $token = $user->createToken('api_token')->plainTextToken;

        return (new RegisterResource($user))
            ->response()
            ->setStatusCode(201);
        // return response()->json([
        //     'message' => 'User registered successfully',
        //     'user' => $user,
        //     'role' => $role->name,
        //     'token' => $token,
        // ], 201);
    }
}
