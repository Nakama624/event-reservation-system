import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReservationList from "./components/ReservationList";

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
        throw new Error("イベント詳細が取得できませんでした");
    }

    return res.json();
}

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;

    const { schedule, reservations } = await getEventDetail(id);

    return (
        <div className="m-20">
            <h1 className="block text-left text-3xl mb-4 font-bold text-gray-500">
                {schedule.title}
            </h1>

            <div className="w-98 mb-20">
                <img
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${schedule.lesson_img1}`}
                    width={400}
                    height={240}
                    alt="イベントイメージ"
                    className="w-full h-auto"
                />
            </div>

            <div className="mb-20 justify-center">
                <table className="mx-auto mb-10 text-xl">
                    <tbody>
                        <tr className="h-16">
                            <th>日時</th>
                            <td>{schedule.start_at}</td>
                        </tr>

                        <tr className="h-16">
                            <th>講師</th>
                            <td>{schedule.instructor_name}</td>
                        </tr>

                        <tr className="h-16">
                            <th>定員</th>
                            <td>{schedule.capacity}</td>
                        </tr>

                        <tr className="h-16">
                            <th>申込済人数</th>
                            <td>{schedule.total_participants}</td>
                        </tr>

                        <tr className="h-16">
                            <th>残席</th>
                            <td>{schedule.remaining_capacity}</td>
                        </tr>

                        <tr className="h-16">
                            <th>状態</th>
                            <td>
                                {schedule.is_past_event ? (
                                    <span className="text-gray-400">終了</span>
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

            <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-500 mb-4">
                    予約者一覧
                </h2>

                <ReservationList reservations={reservations} />
            </section>

            <div className="mt-10">
                <LinkButton
                    href="/admin/event/list"
                    className="bg-gray-500 text-white"
                >
                    一覧へ戻る
                </LinkButton>
            </div>
        </div>
    );
}
