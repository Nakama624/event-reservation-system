"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRouter } from "next/navigation";
import type { EventClickArg, EventInput } from "@fullcalendar/core";

type Props = {
    schedules: EventInput[];
};

export default function SimpleCalendar({ schedules }: Props) {
    const router = useRouter();

    const handleEventClick = (info: EventClickArg) => {
        router.push(`/event/${info.event.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={schedules}
                eventClick={handleEventClick}
                locale="ja"
                height="auto"
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
            />{" "}
        </div>
    );
}
