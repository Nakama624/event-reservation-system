import LinkButton from "@/components/LinkButton";

export default function ReservationCompletePage() {
    return (
        <div className="w-[700px] mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold">ご予約ありがとうございました</h1>

            <div className="mt-10">
                <LinkButton
                    href="/reservation/list"
                    className="rounded bg-gray-300 px-4 py-2"
                >
                    ご予約一覧へ
                </LinkButton>
            </div>
        </div>
    );
}
