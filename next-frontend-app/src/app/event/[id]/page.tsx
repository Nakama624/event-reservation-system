import LinkButton from "@/components/LinkButton";
import { formatDateTime } from "@/utils/formatDateTime";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    isReserved: boolean;
}

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function getEventDetail(id: string): Promise<EventDetailResponse> {
    const session = await getServerSession(authOptions);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}`;

    const res = await fetch(url, {
        cache: "no-store",
        headers: {
            // 認証がある/ないの両方で閲覧が可能
            Accept: "application/json",
            ...(session?.accessToken && {
                Authorization: `Bearer ${session.accessToken}`,
            }),
        },
    });
    if (!res.ok) {
        throw new Error("イベント詳細が取得できませんでした");
    }

    return res.json();
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;

    const { schedule, isBookable, isPastEvent, isReserved } =
        await getEventDetail(id);

    return (
        <div className="w-full">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-2 lg:gap-16">
                    <div>
                        <img
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${schedule.event.lesson_img1}`}
                            width={400}
                            height={240}
                            alt="イベントイメージ"
                            className="h-[600px] w-full rounded-xl object-contain"
                        />
                    </div>

                    <div className="flex h-[600px] flex-col justify-between">
                        {" "}
                        <div className="mb-6 flex items-center gap-3">
                            {isPastEvent ? (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500">
                                    終了
                                </span>
                            ) : isBookable ? (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                                    受付中
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                                    満席
                                </span>
                            )}
                        </div>
                        <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-700 lg:text-4xl">
                            {schedule.event.title}
                        </h1>
                        <p className="mb-8 text-lg leading-relaxed text-gray-600 lg:text-xl">
                            {schedule.event.catch_copy}
                        </p>
                        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
                            <table className="w-full text-left text-base">
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <th className="w-28 bg-gray-50 px-4 py-4 font-bold text-gray-600">
                                            日時
                                        </th>
                                        <td className="px-4 py-4 text-gray-700">
                                            {isPastEvent ? (
                                                <div className="grid gap-2">
                                                    {schedule.event.schedules.map(
                                                        (eventSchedule) => (
                                                            <p
                                                                key={
                                                                    eventSchedule.id
                                                                }
                                                            >
                                                                {formatDateTime(
                                                                    eventSchedule.start_at,
                                                                )}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                formatDateTime(
                                                    schedule.start_at,
                                                )
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="w-28 bg-gray-50 px-4 py-4 font-bold text-gray-600">
                                            講師
                                        </th>
                                        <td className="px-4 py-4 text-gray-700">
                                            {schedule.event.instructor_name}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="w-28 bg-gray-50 px-4 py-4 font-bold text-gray-600">
                                            定員
                                        </th>
                                        <td className="px-4 py-4 text-gray-700">
                                            {schedule.event.capacity}名
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {isPastEvent ? (
                            <p className="rounded-lg bg-gray-300 px-6 py-3 text-center font-bold text-gray-600">
                                開催終了
                            </p>
                        ) : isReserved ? (
                            <p className="rounded-lg bg-gray-300 px-6 py-3 text-center font-bold text-gray-600">
                                予約済みです
                            </p>
                        ) : !isBookable ? (
                            <p className="rounded-lg bg-gray-300 px-6 py-3 text-center font-bold text-gray-600">
                                満席
                            </p>
                        ) : (
                            <LinkButton
                                href={`/event/${schedule.id}/reservation`}
                                className="block w-full rounded-lg bg-red-500 px-6 py-3 text-center font-bold text-white"
                            >
                                予約する
                            </LinkButton>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <LinkButton
                    href="/event/list"
                    className="rounded bg-gray-300 px-4 py-2"
                >
                    一覧へ戻る
                </LinkButton>
            </div>
        </div>
    );
}
