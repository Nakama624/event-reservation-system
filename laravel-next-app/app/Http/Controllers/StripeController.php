<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripeController extends Controller
{
    // クレジットカードのみ
    public function checkout(Request $request, $schedule_id)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $reservation = Reservation::with('schedule.event')
            ->findOrFail($request->reservation_id);

        $session = Session::create([
            'payment_method_types' => ['card'],

            'line_items' => [[
                'price_data' => [
                    'currency' => 'jpy',
                    'product_data' => [
                        'name' => $reservation->schedule->event->title,
                    ],
                    'unit_amount' => $reservation->amount,
                ],
                'quantity' => 1,
            ]],

            'mode' => 'payment',

            'metadata' => [
                'reservation_id' => $reservation->id,
                'schedule_id' => $reservation->schedule_id,
                'payment_method_id' => $reservation->payment_method_id,
                'user_id' => $reservation->user_id,
            ],

            'success_url' => env('FRONTEND_URL')
                ."/event/{$reservation->schedule_id}/reservation/payment-success"
                ."?reservation_id={$reservation->id}",

            'cancel_url' => env('FRONTEND_URL')
                ."/event/{$reservation->schedule_id}/reservation/confirm",
        ]);

        return response()->json([
            'url' => $session->url,
        ]);

    }

    public function paymentSuccess(Request $request)
    {
        $reservation = Reservation::findOrFail(
            $request->reservation_id
        );

        $reservation->update([
            'payment_status' => '支払済み',
            'paid_at' => now(),
        ]);

        return response()->json([
            'message' => '支払済みに更新しました',
        ]);
    }
}
