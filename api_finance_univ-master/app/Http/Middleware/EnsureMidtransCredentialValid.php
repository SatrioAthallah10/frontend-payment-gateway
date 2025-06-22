<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\ErrorResource;

class EnsureMidtransCredentialValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(!config('midtrans.server_key') || !config('midtrans.client_key')) {
            return (new ErrorResource([
                'message' => 'Midtrans credentials are not set. Please configure your Midtrans server and client keys in the .env file.',
            ]))->response()->setStatusCode(500);
        }
        return $next($request);
    }
}
