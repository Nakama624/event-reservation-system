import LinkButton from "@/components/LinkButton";
import EventSearchForm from "@/components/EventSearchForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/utils/formatDateTime";
import FormButton from "@/components/FormButton";

interface Reservation {
    id: number;
    schedule_id: number;
    participants: number;
    amount: number;
    payment_status: string;
    payment_methods_id: number;
    paid_at: number | null;
    is_canceled: boolean;
    schedule: {
        id: number;
        start_at: string;
        event: {
            title: string;
            instructor_name: string;
            capacity: number;
        };
    };
}

type Props = {
    searchParams: Promise<{
        keyword?: string;
        date?: string;
    }>;
};

async function getReservations(
    keyword = "",
    date = "",
): Promise<Reservation[]> {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (date) params.set("date", date);

    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/list?${params.toString()}`;

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
        const errorText = await res.text();
        console.log("予約一覧APIエラー:", res.status, errorText);
        throw new Error("予約一覧の取得に失敗しました");
    }

    return res.json();
}

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;

    const keyword = params?.keyword ?? "";
    const date = params?.date ?? "";

    const reservations = await getReservations(keyword, date);

    return (
        <div className="w-full">
            <section className="flex justify-start">
                <EventSearchForm
                    keyword={keyword}
                    date={date}
                    action="/reservation/list"
                />
            </section>

            <div className="pb-20">
                <h1 className="mt-10 mb-4 text-2xl font-bold text-gray-500">
                    予約一覧
                </h1>

                <div className="overflow-x-auto border border-gray-300">
                    <table className="w-full">
                        <thead>
                            <tr className="border border-gray-300 bg-gray-300 h-12 text-lg">
                                <th className="px-4 py-3 whitespace-nowrap">
                                    開催日時
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    イベント名
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    講師名
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    予約人数
                                </th>
                                <th className="px-4 py-3 whitespace-nowrap">
                                    支払ステータス
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservations.map((reservation) => {
                                const startAt = new Date(
                                    reservation.schedule.start_at,
                                );
                                const isPast = startAt < new Date();

                                return (
                                    <tr
                                        key={reservation.id}
                                        className={`text-center h-16 border border-gray-300 ${
                                            isPast
                                                ? "bg-gray-100 text-gray-400"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-4">
                                            {formatDateTime(
                                                reservation.schedule.start_at,
                                            )}
                                        </td>
                                        <td className="px-4">
                                            {reservation.schedule.event.title}
                                        </td>
                                        <td className="px-4">
                                            {
                                                reservation.schedule.event
                                                    .instructor_name
                                            }
                                        </td>
                                        <td className="px-4">
                                            {reservation.participants}
                                        </td>
                                        <td className="px-4">
                                            {reservation.payment_status}
                                        </td>
                                        <td className="px-4">
                                            {isPast ? (
                                                <span className="text-gray-400">
                                                    終了
                                                </span>
                                            ) : !reservation.is_canceled &&
                                              reservation.payment_status ===
                                                  "未払い" ? (
                                                <form
                                                    action={`/reservation/${reservation.id}/canceled`}
                                                    method="post"
                                                >
                                                    <FormButton
                                                        type="submit"
                                                        className="bg-red-500 text-white"
                                                    >
                                                        キャンセル
                                                    </FormButton>
                                                </form>
                                            ) : reservation.is_canceled ? (
                                                <span className="text-gray-400">
                                                    キャンセル済み
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    キャンセル不可
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4">
                                            <LinkButton
                                                href={`/reservation/${reservation.id}`}
                                                className="bg-blue-500 text-white"
                                            >
                                                詳細
                                            </LinkButton>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-red-400 text-right">
                    ※お支払後はキャンセルできません
                </p>
            </div>
        </div>
    );
}
