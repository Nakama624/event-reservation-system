// import SimpleCalendar from "@/app/calendar/components/SimpleCalendar";
import SimpleCalendar from "./components/SimpleCalendar";

import type { EventInput } from "@fullcalendar/core";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

async function getEventCalendar(): Promise<EventInput[]> {
    // const session = await getServerSession(authOptions);

    // if (!session?.accessToken) {
    //     redirect("/login");
    // }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar`;

    const res = await fetch(url, {
        cache: "no-store",
        // headers: {
        //     Accept: "application/json",
        //     Authorization: `Bearer ${session.accessToken}`,
        // },
    });

    // if (res.status === 401) {
    //     redirect("/login");
    // }

    if (!res.ok) {
        throw new Error("イベント一覧の取得に失敗しました");
    }

    return res.json();
}

export default async function Page() {
    const schedules = await getEventCalendar();

    return (
        <div className="p-4">
            <SimpleCalendar schedules={schedules} />
        </div>
    );
}
