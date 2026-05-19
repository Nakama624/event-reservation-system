"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Contact {
    title: string;
    detail: string;
    img?: string;
}

export default function ContactConfirm() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [contact, setContact] = useState<Contact | null>(() => {
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
            router.push("/login");
            return;
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
        return <div>お問い合わせ内容がありません</div>;
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <h1 className="text-3xl mb-4 font-bold text-gray-500 text-center">
                お問合せ確認
            </h1>

            <div className="border p-4">
                <div className="flex items-start mb-4">
                    <p className="w-24 pt-2">件名</p>

                    <div className="w-4/5">
                        <div className="p-1 w-full">{contact.title}</div>
                    </div>
                </div>

                <div className="flex items-start mb-4">
                    <p className="w-24 pt-2">詳細</p>

                    <div className="w-4/5">
                        <div className="p-1 w-full h-32">{contact.detail}</div>
                    </div>
                </div>

                <div className="flex items-start mb-4">
                    <p className="w-24 pt-2">画像</p>

                    <div className="w-4/5">
                        {contact.img ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${contact.img}`}
                                className="w-40"
                                alt="お問い合わせ画像"
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
    );
}
