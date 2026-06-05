import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/utils/formatDateTime";

interface Reservation {
    id: number;
    schedule_id: number;
    participants: number;
    amount: number;
    payment_status: string;
    payment_method_id: number;
    paid_at: string | null;
    is_canceled: boolean;
    payment_method: {
        id: number;
        payment_method: string;
    };
    schedule: {
        id: number;
        start_at: string;
        event: {
            title: string;
            instructor_name: string;
            capacity: number;
            price: number;
        };
    };
}

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function getReservationDetail(id: string): Promise<Reservation> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/${id}`;
    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (res.status === 401) {
        redirect("/login");
    }

    if (!res.ok) {
        throw new Error("予約詳細の取得に失敗しました");
    }

    return res.json();
}

export default async function ReservationDetailPage({ params }: Props) {
    const { id } = await params;
    const reservation = await getReservationDetail(id);

    return (
        <div className="w-[700px] mx-auto mt-20">
            <h1 className="mb-8 text-3xl font-bold text-center"> ご予約詳細</h1>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="space-y-6">
                    {reservation.is_canceled && (
                        <div className="text-red-500 text-center text-2xl">
                            この予約はキャンセル済みです
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">イベント名</p>
                        <p className="col-span-2">
                            {reservation.schedule.event.title}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">開催日</p>
                        <p className="col-span-2">
                            {formatDateTime(reservation.schedule.start_at)}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">講師名</p>
                        <p className="col-span-2">
                            {reservation.schedule.event.instructor_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">金額</p>
                        <p className="col-span-2">
                            ¥{reservation.schedule.event.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">参加人数</p>
                        <p className="col-span-2">
                            {reservation.participants}人
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">支払ステータス</p>
                        <p className="col-span-2">
                            {reservation.payment_status}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">支払方法</p>
                        <p className="col-span-2">
                            {reservation.payment_method.payment_method}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">合計金額</p>
                        <p className="col-span-2">
                            ¥{reservation.amount.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <LinkButton
                    href="/reservation/list"
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    一覧へ戻る
                </LinkButton>
            </div>
        </div>
    );
}
