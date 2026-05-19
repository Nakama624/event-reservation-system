import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EventReserveConfirmPage({ params }: Props) {
    const { id } = await params;

    const cookieStore = await cookies();

    const saved = cookieStore.get("reservation_confirm")?.value;

    if (!saved) {
        redirect(`/event/${id}/reservation`);
    }

    const data = JSON.parse(saved);

    const { schedule, reserve, paymentMethod } = data;

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <h1 className="text-3xl mb-4 font-bold text-gray-500 text-center">
                予約確認
            </h1>

            <div className="border p-4">
                <p>イベント名：{schedule.event.title}</p>
                <p>参加人数：{reserve.participants}</p>
                <p>電話番号：{reserve.contact_number}</p>
                <p>支払方法：{paymentMethod.payment_method}</p>
                <p>
                    合計金額：
                    {schedule.event.price * reserve.participants}円
                </p>
                <form
                    action={`/api/event/${id}/reservation/complete`}
                    method="post"
                    className="flex justify-center mt-6"
                >
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        予約を確定する
                    </button>
                </form>
            </div>
        </div>
    );
}
