"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ContactPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [img, setImg] = useState<File | null>(null);

    const [errors, setErrors] = useState<{
        title?: string;
        detail?: string;
        img?: string;
    }>({});

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!session?.accessToken) {
            router.push("/login");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("detail", detail);

        if (img) {
            formData.append("img", img);
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/confirm`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: formData,
            },
        );

        if (res.status === 401) {
            router.push("/login");
            return;
        }

        if (res.status === 422) {
            const data = await res.json();
            setErrors(data.errors);
            return;
        }

        if (!res.ok) {
            const errorText = await res.text();
            console.error("confirm error:", res.status, errorText);
            alert(`確認処理に失敗しました: ${res.status}`);
            return;
        }

        const data = await res.json();

        sessionStorage.setItem("contact", JSON.stringify(data));

        router.push("/contact/confirm");
    };

    return (
        <div className="w-[700px] mx-auto mt-20">
            <h1 className="text-3xl mb-4 py-auto font-bold text-gray-500 text-center">
                お問い合わせ
            </h1>

            <form onSubmit={handleSubmit}>
                {/* 件名 */}
                <div className="flex items-start mb-4">
                    <label htmlFor="title" className="w-24 pt-2">
                        件名
                    </label>

                    <div className="w-4/5">
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-1 w-full"
                        />

                        {errors.title && (
                            <div className="text-sm text-red-500">
                                {errors.title}
                            </div>
                        )}
                    </div>
                </div>

                {/* 詳細 */}
                <div className="flex items-start mb-4">
                    <label htmlFor="detail" className="w-24 pt-2">
                        詳細
                    </label>

                    <div className="w-4/5">
                        <textarea
                            id="detail"
                            name="detail"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            className="border p-1 w-full h-40"
                        />

                        {errors.detail && (
                            <div className="text-sm text-red-500">
                                {errors.detail}
                            </div>
                        )}
                    </div>
                </div>

                {/* 画像 */}
                <div className="flex items-start mb-4">
                    <label htmlFor="img" className="w-24 pt-2">
                        画像
                    </label>

                    <div className="w-4/5">
                        <input
                            id="img"
                            name="img"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImg(e.target.files[0]);
                                }
                            }}
                            className="border p-1 w-full"
                        />

                        {errors.img && (
                            <div className="text-sm text-red-500">
                                {errors.img}
                            </div>
                        )}
                    </div>
                </div>

                {/* ボタン */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        確認する
                    </button>
                </div>
            </form>
        </div>
    );
}
