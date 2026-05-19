import Link from "next/link";

export default function ReservationCompletePage() {
    return (
        <div className="w-[700px] mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold">ご予約ありがとうございました</h1>

            <div className="mt-10">
                <Link
                    href="/reservation/list"
                    className="text-blue-500 underline"
                >
                    ご予約一覧へ
                </Link>
            </div>
        </div>
    );
}
