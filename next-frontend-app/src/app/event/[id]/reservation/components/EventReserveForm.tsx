"use client";

import { useState } from "react";
import LinkButton from "@/components/LinkButton";
import { PaymentMethod, ReservationErrors, Schedule } from "../types";

interface Errors {
    payment_method_id?: string[];
    participants?: string[];
    contact_number?: string[];
}

interface Props {
    schedule: Schedule;
    paymentMethods: PaymentMethod[];
    remainingCapacity: number;
    errors?: Errors;
}

export default function EventReserveForm({
    schedule,
    paymentMethods,
    remainingCapacity,
    errors,
}: Props) {
    const [participants, setParticipants] = useState(1);
    const [contactNumber, setContactNumber] = useState("");
    const totalPrice = schedule.event.price * participants;

    return (
        <div className="w-[700px] mx-auto mt-20">
            <h1 className="text-3xl font-bold text-center">ご予約</h1>

            <form
                action={`/api/event/${schedule.id}/reservation/confirm`}
                method="post"
            >
                <table className="w-full my-12 border border-gray-300 border-collapse">
                    <tbody>
                        <tr className="text-xl h-16">
                            <th>イベント名</th>
                            <td>{schedule.event.title}</td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>開催日</th>
                            <td>
                                {new Date(schedule.start_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>講師名</th>
                            <td>{schedule.event.instructor_name}</td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>金額</th>
                            <td>¥{schedule.event.price.toLocaleString()}</td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>参加人数</th>
                            <td>
                                <input
                                    type="number"
                                    name="participants"
                                    min="1"
                                    max={remainingCapacity}
                                    value={participants}
                                    onChange={(e) =>
                                        setParticipants(Number(e.target.value))
                                    }
                                    className="border p-2 h-8 text-sm w-60"
                                />

                                <div className="text-sm text-red-500">
                                    {errors?.participants?.[0]}
                                </div>

                                <div className="text-sm text-red-500">
                                    残り{remainingCapacity}人
                                </div>
                            </td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>ご連絡先</th>
                            <td>
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={contactNumber}
                                    onChange={(e) =>
                                        setContactNumber(e.target.value)
                                    }
                                    className="border p-2 h-8 text-sm w-60"
                                />

                                <div className="text-sm text-red-500">
                                    {errors?.contact_number?.[0]}
                                </div>
                            </td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>支払方法</th>
                            <td>
                                <select
                                    name="payment_method_id"
                                    className="border p-2 h-10 text-sm w-60"
                                >
                                    <option value="">選択してください</option>

                                    {paymentMethods.map((paymentMethod) => (
                                        <option
                                            key={paymentMethod.id}
                                            value={paymentMethod.id}
                                        >
                                            {paymentMethod.payment_method}
                                        </option>
                                    ))}
                                </select>

                                <div className="text-sm text-red-500">
                                    {errors?.payment_method_id?.[0]}
                                </div>
                            </td>
                        </tr>

                        <tr className="text-xl h-16">
                            <th>合計金額</th>
                            <td>¥{totalPrice.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        確認画面へ
                    </button>
                </div>
                <div className="flex justify-center">
                    <LinkButton
                        href="/event/list"
                        className="bg-gray-300 px-4 py-2 rounded"
                    >
                        キャンセル
                    </LinkButton>
                </div>
            </form>
        </div>
    );
}
