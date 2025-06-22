<?php

    namespace App\Helpers;

    class MidtransHelper
    {
        public static function getConfig()
        {
            return [
                'merchant_id' => config('midtrans.merchant_id'),
                'server_key' => config('midtrans.server_key'),
                'client_key' => config('midtrans.client_key'),
                'is_production' => config('midtrans.is_production'),
                'is_sanitized' => config('midtrans.is_sanitized'),
                'is_3ds' => config('midtrans.is_3ds'),
            ];
        }

        public static function setConfig()
        {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
        }

        public static function getPaymentUrl($snapToken)
        {
            return config('midtrans.payment_url') . '/' . $snapToken;
            // return \Midtrans\Snap::createTransaction($params)->redirect_url;
        }
        public static function getSnapToken($params)
        {
            return \Midtrans\Snap::getSnapToken($params);
        }

        public static function getPaymentStatus($orderId)
        {
            return \Midtrans\Transaction::status($orderId);
        }

        public static function cancelPayment($orderId)
        {
            return \Midtrans\Transaction::cancel($orderId);
        }
    }

    MidtransHelper::setConfig();