"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { createPortal } from "react-dom";

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

export default function ReservationList({
    reservations,
}: {
    reservations: Reservation[];
}) {
    const router = useRouter();

    const [targetReservationId, setTargetReservationId] = useState<
        number | null
    >(null);

    const handlePaid = async () => {
        if (targetReservationId === null) return;

        try {
            const session = await getSession();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/event/${targetReservationId}/paid`,
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
            );

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            if (res.status === 403) {
                alert("権限がありません");
                return;
            }

            if (!res.ok) {
                throw new Error("支払更新に失敗しました");
            }

            setTargetReservationId(null);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("通信エラーが発生しました");
        }
    };
    return (
        <>
            <table className="w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="border border-gray-300 h-12 text-lg">
                        <th>予約者名</th>
                        <th>メールアドレス</th>
                        <th>人数</th>
                        <th>支払方法</th>
                        <th>支払ステータス</th>
                        <th>キャンセル</th>
                        <th>予約日時</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <tr
                                key={reservation.id}
                                className="text-center h-12"
                            >
                                <td>{reservation.user_name ?? "-"}</td>
                                <td>{reservation.user_email ?? "-"}</td>
                                <td>{reservation.participants}</td>
                                <td>{reservation.payment_method}</td>
                                <td>{reservation.payment_status}</td>
                                <td>
                                    {reservation.is_canceled
                                        ? "キャンセル済み"
                                        : "-"}
                                </td>
                                <td>{reservation.created_at}</td>
                                <td>
                                    {reservation.payment_status === "未払い" &&
                                    reservation.is_canceled === false ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setTargetReservationId(
                                                    reservation.id,
                                                )
                                            }
                                            className="rounded bg-blue-500 px-4 py-2 text-white"
                                        >
                                            支払済みにする
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={8}
                                className="text-center py-6 text-gray-500"
                            >
                                予約者はいません
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {targetReservationId !== null &&
                createPortal(
                    <div
                        className="fixed top-0 left-0 z-[9999] flex h-dvh w-dvw items-center justify-center bg-black/40"
                        onClick={() => setTargetReservationId(null)}
                    >
                        <div
                            className="w-full max-w-md rounded bg-white p-6 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold mb-4">
                                支払済みに変更しますか？
                            </h2>

                            <p className="mb-6 text-gray-600">
                                この操作を実行すると、支払ステータスが「支払済み」になります。
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTargetReservationId(null)}
                                    className="rounded border px-4 py-2"
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePaid}
                                    className="rounded bg-blue-500 px-4 py-2 text-white"
                                >
                                    変更する
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
