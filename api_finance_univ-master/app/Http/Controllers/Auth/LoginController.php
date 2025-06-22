<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\LoginResource;
use App\Http\Resources\ErrorResource;
class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if(!auth()->attempt($credentials)) {
            return (new ErrorResource(['message' => 'Invalid credentials']))
                ->response()
                ->setStatusCode(401);
        }
        $user = auth()->user();

        return (new LoginResource($user))
            ->response()
            ->setStatusCode(200);
    }
}
