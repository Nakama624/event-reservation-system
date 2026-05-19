import LinkButton from "@/components/LinkButton";
import EventSearchForm from "@/components/EventSearchForm";
// import Image from "next/image";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

interface Schedule {
    id: number;
    event_id: number;
    start_at: string;
    finish_at: string;
    event: {
        id: number;
        title: string;
        capacity: number;
        lesson_img1: string;
        lesson_img2: string;
        lesson_img3: string;
        catch_copy: string;
        instructor_name: string;
        instructor_img: string;
        instructor_profile: string;
        price: number;
    };
}

type Props = {
    searchParams: Promise<{
        keyword?: string;
        date?: string;
    }>;
};

async function getEvents(keyword = "", date = ""): Promise<Schedule[]> {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (date) params.set("date", date);

    // const session = await getServerSession(authOptions);

    // if (!session?.accessToken) {
    //     redirect("/login");
    // }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/list?${params.toString()}`;
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

export default async function EventListPage({ searchParams }: Props) {
    const params = await searchParams;

    const keyword = params?.keyword ?? "";
    const date = params?.date ?? "";

    const currentEvents = await getEvents(keyword, date);

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <section className="mt-10">
                <EventSearchForm
                    keyword={keyword}
                    date={date}
                    action="/event/list"
                />
            </section>

            <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 pb-20">
                <div className="flex justify-between items-center mt-10 mb-4">
                    <h1 className="text-left text-2xl font-bold text-gray-500">
                        イベント一覧
                    </h1>
                    <LinkButton
                        href="/past-event/list"
                        className="bg-blue-500 text-white text-sm"
                    >
                        過去のイベント
                    </LinkButton>
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
                                    定員
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    金額
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEvents.map((currentEvent) => (
                                <tr
                                    key={currentEvent.id}
                                    className="text-center h-16 border border-gray-300"
                                >
                                    <td className="w-32 h-24">
                                        <div className="flex items-center justify-center w-full h-full">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${currentEvent.event.lesson_img1}`}
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
                                        {new Date(
                                            currentEvent.start_at,
                                        ).toLocaleString("ja-JP")}
                                    </td>
                                    <td className="px-4">
                                        {currentEvent.event.title}
                                    </td>
                                    <td className="px-4">
                                        {currentEvent.event.instructor_name}
                                    </td>
                                    <td className="px-4">
                                        {currentEvent.event.capacity}
                                    </td>
                                    <td>
                                        ¥
                                        {currentEvent.event.price.toLocaleString()}
                                    </td>
                                    <td className="px-4">
                                        <LinkButton
                                            href={`/event/${currentEvent.id}`}
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
