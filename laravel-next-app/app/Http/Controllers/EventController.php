<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Schedule;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function eventList(Request $request)
    {
        $keyword = $request->input('keyword');
        $date = $request->input('date');

        $events = Schedule::query()
            ->with(['event', 'reservations'])
            ->whereHas('event', function ($query) use ($keyword) {
                if (! empty($keyword)) {
                    $query->where('title', 'like', '%'.$keyword.'%')
                        ->orWhere('instructor_name', 'like', '%'.$keyword.'%');
                }
            })
            ->when(! empty($date), function ($query) use ($date) {
                $query->whereDate('start_at', $date);
            })
            ->orderBy('start_at', 'desc')
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

    // public function pastEventIndex()
    // {
    //     // 全ての開催が終了しているイベントの場合
    //     $pastEvents = Event::with('schedules')
    //         ->whereDoesntHave('schedules', function ($query) {
    //             $query->where('start_at', '>', now());
    //         })
    //         ->get();

    //     return response()->json($pastEvents);
    // }

    // // 未来日付で開催予定があるイベント詳細
    public function eventDetail($schedule_id)
    {
        // 【開催日の表示】
        // イベントの全工程を終了した場合は、すべての開催日を表示
        // まだ終了していない場合は、各scheduleの開催日を表示
        $schedule = Schedule::with('event.schedules', 'reservations')
            ->findOrFail($schedule_id);

        $totalParticipants = $schedule
            ->reservations
            ->sum('participants');

        $remainingCapacity = $schedule->event->capacity - $totalParticipants;
        $isBookable = $remainingCapacity > 0;

        $isPastEvent = $schedule->start_at < now();

        return response()->json([
            'schedule' => $schedule,
            'remainingCapacity' => $remainingCapacity,
            'isBookable' => $isBookable,
            'isPastEvent' => $isPastEvent,
        ]);
    }
}
