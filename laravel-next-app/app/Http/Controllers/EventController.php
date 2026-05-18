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

        $currentEvents = Schedule::query()
            ->with(['event', 'reservations'])
            ->where('start_at', '>', now())

            ->whereHas('event', function ($query) use ($keyword) {
                if (! empty($keyword)) {
                    $query->where('title', 'like', '%'.$keyword.'%')
                        ->orWhere('instructor_name', 'like', '%'.$keyword.'%');
                }
            })

        // 開催日で検索
            ->when(! empty($date), function ($query) use ($date) {
                $query->whereDate('start_at', $date);
            })

            ->get();

        return response()->json($currentEvents);
    }

    public function pastEventIndex()
    {
        // 全ての開催が終了しているイベントの場合
        $pastEvents = Event::with('schedules')
            ->whereDoesntHave('schedules', function ($query) {
                $query->where('start_at', '>', now());
            })
            ->get();

        return response()->json($pastEvents);
    }

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
