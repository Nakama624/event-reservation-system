<?php

namespace App\Http\Controllers;

use App\Models\Schedule;

class CalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function calendar()
    {
        $schedules = Schedule::with('event')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'title' => $schedule->event->title,
                    'start' => $schedule->start_at,
                    'end' => $schedule->finish_at,
                    'extendedProps' => [
                        'event_id' => $schedule->event_id,
                    ],
                ];
            });

        return response()->json($schedules);
    }
}
