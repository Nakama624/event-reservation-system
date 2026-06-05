import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/utils/formatDateTime";

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
        <div className="w-[700px] mx-auto mt-20">
            <h1 className="mb-8 text-3xl font-bold text-center">予約確認</h1>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">イベント名</p>
                        <p className="col-span-2">{schedule.event.title}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">開催日</p>
                        <p className="col-span-2">
                            {formatDateTime(schedule.start_at)}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">講師名</p>
                        <p className="col-span-2">
                            {schedule.event.instructor_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">金額</p>
                        <p className="col-span-2">
                            ¥{schedule.event.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">参加人数</p>
                        <p className="col-span-2">{reserve.participants}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">ご連絡先</p>
                        <p className="col-span-2">{reserve.contact_number}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">支払方法</p>
                        <p className="col-span-2">
                            {paymentMethod.payment_method}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">合計金額</p>
                        <p className="col-span-2">
                            {schedule.event.price * reserve.participants}円
                        </p>
                    </div>
                    <form
                        action={`/api/event/${id}/reservation/complete`}
                        method="post"
                        className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                    >
                        <button className="w-full rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 sm:w-auto">
                            予約を確定する
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
