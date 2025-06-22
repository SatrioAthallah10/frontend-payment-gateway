<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\ErrorResource;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'midtrans.credentials' => \App\Http\Middleware\EnsureMidtransCredentialValid::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (UnauthorizedException $exception): JsonResponse {
            return (new ErrorResource(['message' => $exception->getMessage()]))
                ->response()
                ->setStatusCode(403);
            // return response()->json(['message' => 'Unauthorized'], 403);
        });

        $exceptions->render(function (AuthenticationException $exception): JsonResponse {
            return (new ErrorResource(['message' => $exception->getMessage()]))
                ->response()
                ->setStatusCode(401);
            // return response()->json(['message' => 'Unauthenticated'], 401);
        });
        $exceptions->render(function (NotFoundHttpException $exception): JsonResponse {
            return (new ErrorResource(['message' => 'Resource not found']))
                ->response()
                ->setStatusCode(404);
            // return response()->json(['message' => 'Resource not found'], 404);
        });
    })->create();
