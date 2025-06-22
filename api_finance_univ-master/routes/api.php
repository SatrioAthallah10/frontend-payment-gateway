<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BillingController;

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum')->middleware('role:superadmin');

Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    Route::middleware('role:superadmin')->group(function () {
        Route::apiResource('/debts', DebtController::class);
        // Route::apiResource('/users', UserController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::apiResource('/billings', BillingController::class)->only(['index', 'show', 'update', 'destroy', 'store']);
        Route::get('/superadmin/role/user', [UserController::class, 'roleUser'])->name('users.role.user');
    });

    Route::prefix('user')->middleware('role:user')->group(function () {
        Route::get('/billings', [BillingController::class, 'userBillings'])->name('user.billings.index');
        Route::get('/billings/{id}', [BillingController::class, 'show'])->name('user.billings.show');

        Route::middleware('midtrans.credentials')->group(function () {
            Route::post('/billings/checkout/{id}', [BillingController::class, 'userCheckout'])->name('user.billings.checkout');
            Route::post('/billings/cancel/{id}', [BillingController::class, 'cancelCheckout'])->name('user.billings.cancel');
            Route::post('/billings/check-status/{id}', [BillingController::class, 'checkPaymentStatus'])->name('user.billings.check-status');
        });

    });
    // Add other routes that require superadmin role here
});