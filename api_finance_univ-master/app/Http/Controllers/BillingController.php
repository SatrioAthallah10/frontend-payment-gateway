<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BillingResource;
use App\Http\Resources\BillingCollection;
use App\Http\Resources\ErrorResource;
use App\Models\Billing;
use App\Http\Resources\SuccessResource;
use App\Helpers\MidtransHelper;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;
class BillingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() : BillingCollection
    {
        $billings = Billing::with(['user', 'debt'])->get();
        return new BillingCollection($billings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) : BillingResource
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'debt_id' => 'required|exists:debts,id',
            'user_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
            'month' => 'required|min:1|max:12|integer',
            'year' => 'required|integer|min:2000',
        ]);

        
        $request->merge(['created_by' => auth()->user()->name]);
        $billing = Billing::create($request->all());
        return new BillingResource($billing);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) : BillingResource
    {
        $billing = Billing::with(['user', 'debt'])->findOrFail($id);
        if(!auth()->user()->hasRole('superadmin') && auth()->id() !== Billing::findOrFail($id)->user_id) {
            return new ErrorResource([
                'message' => 'You are not authorized to view this billing record.',
            ]);
        }
        return new BillingResource($billing);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) : BillingResource
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'debt_id' => 'required|exists:debts,id',
            'user_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
            'month' => 'required|min:1|max:12|integer',
            'year' => 'required|integer|min:2000',
        ]);

        $billing = Billing::findOrFail($id);
        $billing->update($request->all());
        return new BillingResource($billing);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) : SuccessResource
    {
        $billing = Billing::findOrFail($id);
        $billing->delete();
        return new SuccessResource([
            'message' => 'Billing record deleted successfully',
        ]);
    }

    public function userBillings(Request $request) : BillingCollection
    {
        $request->validate([
            'status' => 'nullable|in:paid,unpaid',
        ]);
        
        $billings = Billing::with(['user', 'debt'])
            ->where('user_id', auth()->id())
            ->when($request->status, function ($query) use ($request) {
                return $query->where('status', $request->status);
            })
            ->get();
        
        return new BillingCollection($billings);
    }

    public function userCheckout(string $id)
    {
        $billing = Billing::with(['user', 'debt'])->findOrFail($id);
        
        if($billing->user_id !== auth()->id()) {
            return (new ErrorResource([
                'message' => 'You are not authorized to pay this billing record.',
            ]))->response()->setStatusCode(403);
        }
        
        if($billing->status === 'paid') {
            return (new ErrorResource([
                'message' => 'This billing record has already been paid.',
                'data' => new BillingResource($billing),
            ]))->response()->setStatusCode(400);
        }

        if($billing->amount <= 0) {
            return (new ErrorResource([
                'message' => 'Billing amount must be greater than zero.',
            ]))->response()->setStatusCode(400);
        }

        if($billing->payment_status === 'pending') {
            return (new ErrorResource([
                'message' => 'This billing record is still pending.',
                'data' => new BillingResource($billing),
            ]))->response()->setStatusCode(400);
        }

        $billing->order_id = 'ITATS-' . time() . '-' . rand(0, 100);
        $billing->order_id = substr($billing->order_id, 0, 50); // Ensure order_id is not too long
        $billing->payment_gateway = 'midtrans';
        $billing->payment_status = 'pending';
        $billing->requested_at = now();
        $billing->expired_at = now()->addDay(1); // Set expiration time to 24 hours from now

        $params = array(
            'transaction_details' => array(
                'order_id' => $billing->order_id,
                'gross_amount' => $billing->amount,
            ),
            'customer_details' => array(
                'first_name' => $billing->user->name,
                'email' => $billing->user->email,
            ),
            'item_details' => array(
                array(
                    'id' => $billing->id,
                    'price' => $billing->amount,
                    'quantity' => 1,
                    'name' => 'Billing for ' . $billing->debt->name . ' - ' . $billing->month . '/' . $billing->year,
                ),
            ),
        );

        $snapToken = MidtransHelper::getSnapToken($params);
        $paymentUrl = MidtransHelper::getPaymentUrl($snapToken);

        $billing->request_data = json_encode($params);
        $billing->response_data = json_encode([
            'redirect_url' => $paymentUrl,
            'snap_token' => $snapToken,
        ]);
        $billing->save();
        return response()->json([
            'message' => 'Checkout initiated successfully.',
            'redirect_url' => $paymentUrl,
            'snap_token' => $snapToken,
            'billing' => new BillingResource($billing),
        ]);
        // return new BillingResource($billing);
    }

    public function cancelCheckout(string $id)
    {
        $billing = Billing::findOrFail($id);
        
        if($billing->user_id !== auth()->id()) {
            return (new ErrorResource([
                'message' => 'You are not authorized to cancel this billing record.',
            ]))->response()->setStatusCode(403);
        }

        if($billing->status === 'paid') {
            return (new ErrorResource([
                'message' => 'This billing record has already been paid.',
                'data' => new BillingResource($billing),
            ]))->response()->setStatusCode(400);
        }

        try {
            $status = MidtransHelper::getPaymentStatus($billing->order_id);
            if(!$status || !in_array(@$status->transaction_status, ['paid', 'settlement', 'capture'])) {
                // If the payment is still pending or expired, we can cancel it
                MidtransHelper::cancelPayment($billing->order_id);
            } else {
                return (new ErrorResource([
                    'message' => 'This billing record cannot be cancelled as it has already been paid.',
                    'data' => new BillingResource($billing),
                ]))->response()->setStatusCode(400);
            }
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Failed to cancel payment for billing ID ' . $billing->id . ': ' . $th->getMessage());
        }

        $billing->payment_status = 'cancelled';
        $billing->request_data = null;
        $billing->response_data = null;
        $billing->expired_at = null;
        $billing->save();

        return new SuccessResource([
            'message' => 'Checkout cancelled successfully.',
            'data' => new BillingResource($billing),
        ]);
    }

    public function checkPaymentStatus(string $id)
    {
        $billing = Billing::with(['user', 'debt'])->findOrFail($id);
        
        if($billing->user_id !== auth()->id()) {
            return (new ErrorResource([
                'message' => 'You are not authorized to check this billing record.',
            ]))->response()->setStatusCode(403);
        }
        $status = null;
        try {
            $status = MidtransHelper::getPaymentStatus($billing->order_id);
        } catch (\Throwable $th) {
            Log::error('Failed to check payment status for billing ID ' . $billing->id . ': ' . $th->getMessage());
        }
        if($status) {
            $notification = new Notification();
            $notification->billing_id = $billing->id;
            $notification->order_id = $billing->order_id;
            $notification->status = @$status->transaction_status;
            $notification->payment_type = @$status->payment_type;
            $notification->transaction_id = @$status->transaction_id;
            $notification->data = json_encode($status);
            $notification->save();
        }
        if(in_array(@$status->transaction_status, ['settlement', 'capture'])) {
            $billing->status = 'paid';
            $billing->payment_status = 'paid';
            $billing->transaction_id = @$status->transaction_id;
            $billing->paid_at = @$status->settlement_time ?? now();

            $response_data = json_decode($billing->response_data, true) ?? [];
            $vaNumber = @$status->va_numbers;
            $billing->response_data = json_encode(array_merge($response_data, [
                'va_number' => $vaNumber
            ]));
        } elseif(@$status->transaction_status == 'expire') {
            $billing->status = 'unpaid';
            $billing->payment_status = 'expired';
        } elseif(@$status->transaction_status == 'cancel') {
            $billing->status = 'cancelled';
            $billing->payment_status = 'cancelled';
        }
        $billing->save();
        return new SuccessResource([
            'message' => 'Payment status checked successfully.',
            'data' => new BillingResource($billing),
        ]);
    }
}
