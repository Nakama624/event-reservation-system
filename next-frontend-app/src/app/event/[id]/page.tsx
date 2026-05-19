import LinkButton from "@/components/LinkButton";
// import Image from "next/image";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

interface EventSchedule {
    id: number;
    event_id: number;
    start_at: string;
    finish_at: string;
}

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
        schedules: EventSchedule[];
    };
}

interface EventDetailResponse {
    schedule: Schedule;
    remainingCapacity: number;
    isBookable: boolean;
    isPastEvent: boolean;
}

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function getEventDetail(id: string): Promise<EventDetailResponse> {
    // const session = await getServerSession(authOptions);

    // if (!session?.accessToken) {
    //     redirect("/login");
    // }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}`;

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
        throw new Error("イベント詳細が取得できませんでした");
    }

    return res.json();
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;

    const { schedule, remainingCapacity, isBookable, isPastEvent } =
        await getEventDetail(id);

    return (
        <div className="m-20">
            <h1 className="block text-left text-3xl mb-4 font-bold text-gray-500">
                {schedule.event.title}
            </h1>

            <div className="w-98 mb-20">
                <img
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${schedule.event.lesson_img1}`}
                    width={400}
                    height={240}
                    alt="イベントイメージ"
                    className="w-full h-auto"
                />
            </div>

            <div className="mb-10 justify-center">
                <p className="flex justify-center text-4xl">
                    {schedule.event.catch_copy}
                </p>
            </div>

            <div className="mb-20 justify-center">
                <table className="mx-auto mb-10 text-xl">
                    <tbody>
                        <tr className="h-16">
                            <th>日時</th>
                            <td>
                                {isPastEvent ? (
                                    <div className="grid gap-2">
                                        {schedule.event.schedules.map(
                                            (eventSchedule) => (
                                                <p key={eventSchedule.id}>
                                                    {new Date(
                                                        eventSchedule.start_at,
                                                    ).toLocaleString("ja-JP")}
                                                </p>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    new Date(schedule.start_at).toLocaleString(
                                        "ja-JP",
                                    )
                                )}
                            </td>
                        </tr>

                        <tr className="h-16">
                            <th>講師</th>
                            <td>{schedule.event.instructor_name}</td>
                        </tr>

                        <tr className="h-16">
                            <th>定員</th>
                            <td>{schedule.event.capacity}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {isPastEvent ? (
                <p className="text-center">終了しました</p>
            ) : isBookable ? (
                <>
                    <div className="mb-8 justify-center">
                        <p className="flex justify-center">
                            残り{remainingCapacity}名
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <LinkButton
                            href={`/event/${schedule.id}/reservation`}
                            className="bg-red-500 text-white px-20 py-2 rounded mx-auto"
                        >
                            予約する
                        </LinkButton>
                    </div>
                </>
            ) : (
                <p className="text-center">満席です</p>
            )}
            <div className="flex justify-center">
                <LinkButton
                    href="/event/list"
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    一覧へ戻る
                </LinkButton>
            </div>
        </div>
    );
}
