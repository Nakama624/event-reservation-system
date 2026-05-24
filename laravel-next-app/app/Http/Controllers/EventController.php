<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Schedule;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function eventList(Request $request)
    {
        return $this->getEventList($request, 'future');
    }

    public function pastEventIndex(Request $request)
    {
        return $this->getEventList($request, 'past');
    }

    private function getEventList(Request $request, string $type)
    {
        $keyword = $request->input('keyword');
        $date = $request->input('date');

        $events = Schedule::query()
            ->with(['event', 'reservations'])
            ->when($type === 'future', function ($query) {
                $query->where('start_at', '>=', now());
            })
            ->when($type === 'past', function ($query) {
                $query->where('start_at', '<', now());
            })
            ->whereHas('event', function ($query) use ($keyword) {
                if (! empty($keyword)) {
                    $query->where('title', 'like', '%'.$keyword.'%')
                        ->orWhere('instructor_name', 'like', '%'.$keyword.'%');
                }
            })
            ->when(! empty($date), function ($query) use ($date) {
                $query->whereDate('start_at', $date);
            })
            ->orderBy('start_at', $type === 'future' ? 'asc' : 'desc')
            ->paginate(20);

        $events->getCollection()->transform(function ($schedule) {
            $totalParticipants = $schedule->reservations->sum('participants');
            $capacity = $schedule->event->capacity;

            return [
                'id' => $schedule->id,
                'event_id' => $schedule->event_id,
                'title' => $schedule->event->title,
                'instructor_name' => $schedule->event->instructor_name,
                'start_at' => $schedule->start_at->format('Y-m-d H:i'),
                'finish_at' => $schedule->finish_at?->format('Y-m-d H:i'),
                'lesson_img1' => $schedule->event->lesson_img1,
                'capacity' => $capacity,
                'total_participants' => $totalParticipants,
                'remaining_capacity' => $capacity - $totalParticipants,
                'price' => $schedule->event->price,
                'is_bookable' => $capacity > $totalParticipants,
                'is_past_event' => $schedule->start_at < now(),
            ];
        });

        return response()->json($events);
    }

    public function eventDetail(Request $request, $schedule_id)
    {
        $schedule = Schedule::with('event.schedules', 'reservations')
            ->findOrFail($schedule_id);

        $totalParticipants = $schedule->reservations->sum('participants');

        $remainingCapacity = $schedule->event->capacity - $totalParticipants;
        $isBookable = $remainingCapacity > 0;
        $isPastEvent = $schedule->start_at < now();

        $isReserved = false;

        $user = $request->user('sanctum');

        if ($user) {
            $isReserved = Reservation::where('user_id', $user->id)
                ->where('schedule_id', $schedule->id)
                ->where('is_canceled', 0)
                ->exists();
        }

        return response()->json([
            'schedule' => $schedule,
            'remainingCapacity' => $remainingCapacity,
            'isBookable' => $isBookable,
            'isPastEvent' => $isPastEvent,
            'isReserved' => $isReserved,
        ]);
    }
}
