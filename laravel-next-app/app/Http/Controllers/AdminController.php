<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Reservation;
use App\Models\Schedule;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function adminReservationList(Request $request)
    {
        $keyword = $request->input('keyword');
        $date = $request->input('date');

        $reservations = Reservation::query()
            ->with(['user', 'schedule.event'])
            ->when(!empty($keyword), function ($query) use ($keyword) {
                $query->whereHas('schedule.event', function ($q) use ($keyword) {
                    $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('instructor_name', 'like', "%{$keyword}%");
                });
            })
            ->when(!empty($date), function ($query) use ($date) {
                $query->whereHas('schedule', function ($q) use ($date) {
                    $q->whereDate('start_at', $date);
                });
            })
            ->latest()
            ->paginate(20);

        $reservations->getCollection()->transform(function ($reservation) {
            return [
                'id' => $reservation->id,
                'schedule_id' => $reservation->schedule_id,
                'event_id' => $reservation->schedule?->event_id,

                'user_name' => $reservation->user?->name,
                'participants' => $reservation->participants,
                'payment_status' => $reservation->payment_status,
                'event_title' => $reservation->schedule?->event?->title,
                'instructor_name' => $reservation->schedule?->event?->instructor_name,
                'start_at' => $reservation->schedule?->start_at?->format('Y-m-d H:i'),
            ];
        });
        return response()->json($reservations);
    }
    public function adminReservationDetail($schedule_id)
    {
        $schedule = Schedule::with([
            'event',
            'reservations.user',
            'reservations.paymentMethod',
        ])->findOrFail($schedule_id);

        $totalParticipants = $schedule->reservations->sum('participants');

        $remainingCapacity = $schedule->event->capacity - $totalParticipants;

        $isBookable = $remainingCapacity > 0;

        $isPastEvent = $schedule->start_at < now();

        $reservations = $schedule->reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'user_id' => $reservation->user_id,
                'user_name' => $reservation->user?->name,
                'user_email' => $reservation->user?->email,
                'participants' => $reservation->participants,
                'payment_status' => $reservation->payment_status,
                'payment_method' => $reservation->paymentMethod?->payment_method,
                'is_canceled' => (bool) $reservation->is_canceled,
                'created_at' => $reservation->created_at->format('Y-m-d H:i'),
            ];
        });

        return response()->json([
            'schedule' => [
                'id' => $schedule->id,
                'event_id' => $schedule->event_id,
                'title' => $schedule->event->title,
                'detail' => $schedule->event->detail,
                'instructor_name' => $schedule->event->instructor_name,
                'lesson_img1' => $schedule->event->lesson_img1,
                'start_at' => $schedule->start_at->format('Y-m-d H:i'),
                'finish_at' => $schedule->finish_at?->format('Y-m-d H:i'),
                'capacity' => $schedule->event->capacity,
                'total_participants' => $totalParticipants,
                'remaining_capacity' => $remainingCapacity,
                'is_bookable' => $isBookable,
                'isPastEvent' => $isPastEvent,
            ],
            'reservations' => $reservations,
        ]);
    }

    public function adminReservationPaid($reservation_id)
    {
        $reservation = Reservation::findOrFail($reservation_id);

        $reservation->update([
            'payment_status' => '支払済み',
            'payment_updated_by' => auth()->id(),
            'paid_at' => now(),
        ]);

        return response()->json([
            'message' => '支払済みに更新しました',
        ]);
    }

    // お問合せ
    public function adminContactList()
    {
        $contacts = Contact::with('user', 'contactStatus')
            ->latest()
            ->get()
            ->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'user_id' => $contact->user_id,
                    'user_name' => $contact->user?->name,
                    'title' => $contact->title,
                    'status' => $contact->contactStatus->status,
                    'created_at' => $contact->created_at->format('Y-m-d H:i'),
                ];
            });

        return response()->json($contacts);
    }

    public function adminContactDetail($contact_id)
    {
        $contact = Contact::with('user', 'contactStatus')
            ->findOrFail($contact_id);

        return response()->json([
            'id' => $contact->id,
            'user_name' => $contact->user?->name,
            'title' => $contact->title,
            'detail' => $contact->detail,
            'status' => $contact->contactStatus?->status,
            'img' => $contact->img,
        ]);
    }
}
