import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReservationList from "./components/ReservationList";
import { formatDateTime } from "@/utils/formatDateTime";
import { adminFetch } from "@/utils/adminFetch";

interface Schedule {
    id: number;
    event_id: number;
    title: string;
    detail: string;
    instructor_name: string;
    lesson_img1: string;
    start_at: string;
    finish_at: string | null;
    capacity: number;
    total_participants: number;
    remaining_capacity: number;
    is_bookable: boolean;
    is_past_event: boolean;
}

interface Reservation {
    id: number;
    user_id: number;
    user_name: string | null;
    user_email: string | null;
    participants: number;
    payment_status: string;
    payment_method: string | null;
    is_canceled: boolean;
    created_at: string;
}

interface EventDetailResponse {
    schedule: Schedule;
    reservations: Reservation[];
}

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function getEventDetail(id: string): Promise<EventDetailResponse> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/event/${id}`;

    const res = await adminFetch(url, {
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
        throw new Error("イベント詳細が取得できませんでした");
    }

    return res.json();
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;

    const { schedule, reservations } = await getEventDetail(id);

    return (
        <div className="m-20">
            <h1 className="block text-left text-3xl mb-8 font-bold text-gray-500">
                {schedule.title}
            </h1>

            <div className="mb-20 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <img
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${schedule.lesson_img1}`}
                            width={400}
                            height={240}
                            alt="イベントイメージ"
                            className="w-full h-auto rounded"
                        />
                    </div>

                    <div>
                        <table className="w-full text-xl">
                            <tbody>
                                <tr className="h-16 border-b">
                                    <th className="w-40 text-left text-gray-500">
                                        日時
                                    </th>
                                    <td>{formatDateTime(schedule.start_at)}</td>
                                </tr>

                                <tr className="h-16 border-b">
                                    <th className="w-40 text-left text-gray-500">
                                        講師
                                    </th>
                                    <td>{schedule.instructor_name}</td>
                                </tr>

                                <tr className="h-16 border-b">
                                    <th className="w-40 text-left text-gray-500">
                                        定員
                                    </th>
                                    <td>{schedule.capacity}人</td>
                                </tr>

                                <tr className="h-16 border-b">
                                    <th className="w-40 text-left text-gray-500">
                                        申込済人数
                                    </th>
                                    <td>{schedule.total_participants}人</td>
                                </tr>

                                <tr className="h-16 border-b">
                                    <th className="w-40 text-left text-gray-500">
                                        残席
                                    </th>
                                    <td>{schedule.remaining_capacity}席</td>
                                </tr>

                                <tr className="h-16">
                                    <th className="w-40 text-left text-gray-500">
                                        状態
                                    </th>
                                    <td>
                                        {schedule.is_past_event ? (
                                            <span className="text-gray-400">
                                                終了
                                            </span>
                                        ) : (
                                            <span className="text-green-600">
                                                開催予定
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-500 mb-4">
                    予約者一覧
                </h2>

                <ReservationList reservations={reservations} />
            </section>

            <div className="mt-8 flex justify-center">
                <LinkButton
                    href="/admin/event/list"
                    className="rounded bg-gray-300 px-4 py-2"
                >
                    一覧へ戻る
                </LinkButton>
            </div>
        </div>
    );
}
