"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Contact {
    title: string;
    detail: string;
    img?: string;
}

export default function ContactConfirm() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [contact] = useState<Contact | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const savedContact = sessionStorage.getItem("contact");

        if (!savedContact) {
            return null;
        }

        return JSON.parse(savedContact) as Contact;
    });
    const handleComplete = async () => {
        if (status === "loading") {
            return;
        }

        if (!session?.accessToken || !contact) {
            router.push("/login");
            return;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/complete`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(contact),
            },
        );

        if (res.status === 401) {
            redirect("/login");
        }

        if (!res.ok) {
            console.error("complete error:", res.status, await res.text());
            alert("送信に失敗しました");
            return;
        }

        sessionStorage.removeItem("contact");

        router.push("/contact/thanks");
    };

    if (!contact) {
        return <div>お問合せ内容がありません</div>;
    }

    return (
        <div className="w-[700px] mx-auto mt-20">
            <h1 className="mb-8 text-3xl font-bold text-center">
                お問合せ確認
            </h1>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">件名</p>
                        <p className="col-span-2">{contact.title}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">詳細</p>
                        <p className="col-span-2">{contact.detail}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-bold">画像</p>

                        <div className="w-4/5">
                            {contact.img ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${contact.img}`}
                                    className="w-40"
                                    alt="お問合せ画像"
                                />
                            ) : (
                                <p>画像なし</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleComplete}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            送信する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
