import LinkButton from "@/components/LinkButton";
import EventSearchForm from "@/components/EventSearchForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface EventItem {
    id: number;
    event_id: number;
    title: string;
    instructor_name: string;
    start_at: string;
    finish_at: string | null;
    lesson_img1: string;
    capacity: number;
    total_participants: number;
    is_past_event: boolean;
}

interface EventResponse {
    events: EventItem[];
}

type Props = {
    searchParams: Promise<{
        keyword?: string;
        date?: string;
    }>;
};

async function getEvents(keyword = "", date = ""): Promise<EventItem[]> {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (date) params.set("date", date);

    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/event/list?${params.toString()}`;

    const res = await fetch(url, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (res.status === 401) {
        redirect("/login");
    }

    if (!res.ok) {
        throw new Error("イベント一覧の取得に失敗しました");
    }

    const data: EventResponse = await res.json();

    return data.events;
}

export default async function EventListPage({ searchParams }: Props) {
    const params = await searchParams;

    const keyword = params?.keyword ?? "";
    const date = params?.date ?? "";

    const events = await getEvents(keyword, date);

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 pb-20">
            <section className="mt-10">
                <EventSearchForm
                    keyword={keyword}
                    date={date}
                    action="/admin/event/list"
                />
            </section>

            <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
                <div className="flex justify-between items-center mt-10 mb-4">
                    <h1 className="text-left text-2xl font-bold text-gray-500">
                        イベント一覧
                    </h1>
                </div>

                <div className="overflow-x-auto border border-gray-300">
                    <table className="w-full">
                        <thead>
                            <tr className="border border-gray-300 bg-gray-300 h-12 text-lg">
                                <th className="px-4 py-3 whitespace-nowrap"></th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    開催日時
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    イベント名
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    講師
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    申込済人数
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    状態
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {events.map((allEvents) => (
                                <tr
                                    key={allEvents.id}
                                    className="text-center h-16 border border-gray-300"
                                >
                                    <td className="w-32 h-24">
                                        <div className="flex items-center justify-center w-full h-full">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${allEvents.lesson_img1}`}
                                                alt="イベントイメージ"
                                                width={80}
                                                height={48}
                                                className="
                                                    object-contain
                                                    max-h-20
                                                    w-auto
                                                    hover:scale-125
                                                    transition-transform
                                                    duration-300
                                                "
                                            />
                                        </div>
                                    </td>

                                    <td className="px-4">
                                        {allEvents.start_at}
                                    </td>

                                    <td className="px-4">{allEvents.title}</td>

                                    <td className="px-4">
                                        {allEvents.instructor_name}
                                    </td>

                                    <td className="px-4">
                                        {allEvents.total_participants}
                                    </td>

                                    <td className="px-4">
                                        {allEvents.is_past_event ? (
                                            <span className="text-gray-400">
                                                終了
                                            </span>
                                        ) : (
                                            <span className="text-green-600">
                                                開催予定
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4">
                                        <LinkButton
                                            href={`/admin/event/${allEvents.id}`}
                                            className="bg-blue-500 text-white"
                                        >
                                            詳細
                                        </LinkButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
