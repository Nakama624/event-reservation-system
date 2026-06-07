"use client";

import { useState } from "react";
import LinkButton from "@/components/LinkButton";
import { PaymentMethod, Schedule } from "../types";
import { formatDateTime } from "@/utils/formatDateTime";
import FormButton from "@/components/FormButton";

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
            <h1 className="mb-8 text-3xl font-bold text-center">ご予約</h1>

            <form
                action={`/api/event/${schedule.id}/reservation/confirm`}
                method="post"
            >
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
                            <label htmlFor="participants" className="font-bold">
                                参加人数
                            </label>
                            <div className="col-span-2">
                                <input
                                    id="participants"
                                    type="number"
                                    name="participants"
                                    min="1"
                                    max={remainingCapacity}
                                    value={participants}
                                    onChange={(e) =>
                                        setParticipants(Number(e.target.value))
                                    }
                                    className="border p-2 h-8 text-sm w-60 rounded border-gray-500"
                                />

                                <div className="text-sm text-red-500">
                                    {errors?.participants?.[0]}
                                </div>

                                <div className="text-sm text-blue-500">
                                    残り{remainingCapacity}人
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <label className="font-bold">ご連絡先</label>
                            <div className="col-span-2">
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={contactNumber}
                                    placeholder="(例)012-3456-7890"
                                    onChange={(e) =>
                                        setContactNumber(e.target.value)
                                    }
                                    className="border p-2 h-8 text-sm w-60 rounded border-gray-500"
                                />

                                <div className="text-sm text-red-500">
                                    {errors?.contact_number?.[0]}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <label className="font-bold">支払方法</label>
                            <div className="col-span-2">
                                <select
                                    name="payment_method_id"
                                    className="border p-1 h-8 text-sm w-60 rounded border-gray-500"
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
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <p className="font-bold">合計金額</p>
                            <p className="col-span-2">
                                ¥{totalPrice.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <FormButton
                        type="submit"
                        className="w-full bg-blue-600 text-white sm:w-auto"
                    >
                        確認画面へ
                    </FormButton>

                    <LinkButton
                        href="/event/list"
                        className="w-full bg-gray-200 rounded px-4 py-2 text-sm text-gray-700  sm:w-auto"
                    >
                        キャンセル
                    </LinkButton>
                </div>
            </form>
        </div>
    );
}
