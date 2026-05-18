<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationRequest;
use App\Models\PaymentMethod;
use App\Models\Reservation;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function reservationList(Request $request): JsonResponse
    {
        $user = auth()->user();

        $keyword = $request->input('keyword');
        $date = $request->input('date');

        $reservations = Reservation::query()
            ->where('user_id', $user->id)
            // タイトルまたは講師名で検索
            ->whereHas('schedule.event', function ($query) use ($keyword) {
                if (! empty($keyword)) {
                    $query->where('title', 'like', '%'.$keyword.'%')
                        ->orWhere('instructor_name', 'like', '%'.$keyword.'%');
                }
            })

            // 開催日で検索
            ->whereHas('schedule', function ($query) use ($date) {
                if (! empty($date)) {
                    $query->whereDate('start_at', $date);
                }
            })
            ->join('schedules', 'reservations.schedule_id', '=', 'schedules.id')
            ->with('schedule.event')
            ->orderBy('schedules.start_at', 'desc')
            ->select('reservations.*')
            ->get();

        return response()->json($reservations);
    }

    public function Detail($reservation_id)
    {
        $reservation = Reservation::with([
            'schedule.event',
            'paymentMethod',
        ])->findOrFail($reservation_id);

        return response()->json($reservation);
    }

    // 予約入力画面を表示
    public function reserveIndex($schedule_id)
    {
        $schedule = Schedule::with('event', 'reservations')
            ->findOrFail($schedule_id);

        // 既存予約の人数を総計
        $totalParticipants = $schedule
            ->reservations
            ->sum('participants');

        $remainingCapacity = $schedule->event->capacity - $totalParticipants;

        $paymentMethods = PaymentMethod::all();

        return response()->json([
            'schedule' => $schedule,
            'paymentMethods' => $paymentMethods,
            'remainingCapacity' => max($remainingCapacity, 0),
        ]);
    }

    // 確認画面を表示
    public function confirm(ReservationRequest $request, $schedule_id)
    {
        $schedule = Schedule::with('event')->findOrFail($schedule_id);

        $reserve = $request->only([
            'participants',
            'contact_number',
            'payment_method_id',
        ]);

        $paymentMethod = PaymentMethod::findOrFail(
            $reserve['payment_method_id']
        );

        return response()->json([
            'schedule' => $schedule,
            'reserve' => $reserve,
            'paymentMethod' => $paymentMethod,
        ]);
    }

    public function complete(ReservationRequest $request, $schedule_id)
    {
        $user = auth()->user();

        $schedule = Schedule::with('event')->findOrFail($schedule_id);

        $reservation = Reservation::create([
            'user_id' => $user->id,
            'schedule_id' => $schedule->id,
            'participants' => $request->participants,
            'contact_number' => $request->contact_number,
            'amount' => $schedule->event->price * $request->participants,
            'payment_status' => '未払い',
            'payment_method_id' => $request->payment_method_id,
        ]);

        return response()->json([
            'reservation' => $reservation,
        ]);
    }

    // お支払が未払いの場合のみ一覧からキャンセルが可能
    public function canceled($reservation_id, Request $request)
    {
        $canceledReservation = Reservation::where('id', $reservation_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $canceledReservation->update([
            'is_canceled' => true,
        ]);

        return response()->json();
    }
}
