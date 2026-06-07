"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import FormButton from "@/components/FormButton";

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

        // ログインしていない場合はログイン画面へ
        if (res.status === 401) {
            redirect("/login");
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
            <h1 className="mb-8 text-3xl font-bold text-center">お問合せ</h1>

            <form onSubmit={handleSubmit}>
                {/* 件名 */}

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <label className="font-bold">件名</label>
                            <div className="col-span-2">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border p-1 w-full rounded border-gray-500"
                                />

                                {errors.title && (
                                    <div className="text-sm text-red-500">
                                        {errors.title}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 詳細 */}
                        <div className="grid grid-cols-3 gap-4">
                            <label className="font-bold">詳細</label>

                            <div className="col-span-2">
                                <textarea
                                    id="detail"
                                    name="detail"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    className="border p-1 w-full h-40 rounded border-gray-500"
                                />

                                {errors.detail && (
                                    <div className="text-sm text-red-500">
                                        {errors.detail}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 画像 */}
                        <div className="grid grid-cols-3 gap-4">
                            <label className="font-bold">画像</label>

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
                                    //   className="border p-1 w-full"
                                />

                                {errors.img && (
                                    <div className="text-sm text-red-500">
                                        {errors.img}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ボタン */}
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <FormButton
                                type="submit"
                                className="w-full bg-blue-600 text-white sm:w-auto"
                            >
                                確認画面へ
                            </FormButton>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
