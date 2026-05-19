import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

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
        <div className="max-w-[700px] mx-auto mt-20">
            <h1 className="text-3xl mb-4 py-auto font-bold text-gray-500 text-center">
                ご予約詳細
            </h1>

            {reservation.is_canceled && (
                <div className="text-red-500 text-center mb-4">
                    この予約はキャンセル済みです
                </div>
            )}

            <table className="w-full my-12 border border-gray-300 border-collapse">
                <tbody>
                    <tr className="text-xl h-16">
                        <th>イベント名</th>
                        <td>{reservation.schedule.event.title}</td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>開催日</th>
                        <td>
                            {new Date(
                                reservation.schedule.start_at,
                            ).toLocaleString("ja-JP")}
                        </td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>講師名</th>
                        <td>{reservation.schedule.event.instructor_name}</td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>金額</th>
                        <td>
                            ¥{reservation.schedule.event.price.toLocaleString()}
                        </td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>参加人数</th>
                        <td>{reservation.participants}人</td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>支払ステータス</th>
                        <td>{reservation.payment_status}</td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>支払方法</th>
                        <td>{reservation.payment_method.payment_method}</td>
                    </tr>

                    <tr className="text-xl h-16">
                        <th>合計金額</th>
                        <td>¥{reservation.amount.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-center">
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
