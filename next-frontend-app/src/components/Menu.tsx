"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Menu() {
    const { data: session, status } = useSession();
    const isManager = session?.user?.isManager === true;

    return (
        <div className="bg-gray-100 p-4 shadow">
            <nav className="flex items-center gap-8 font-bold">
                <Link href="/event/list" className="hover:text-blue-500">
                    イベント一覧
                </Link>

                <Link href="/calendar" className="hover:text-blue-500">
                    イベントカレンダー
                </Link>

                {status === "loading" ? (
                    <p className="flex-1 text-center">Loading...</p>
                ) : session ? (
                    isManager ? (
                        <>
                            <Link
                                href="/admin/event/list"
                                className="hover:text-blue-500"
                            >
                                全ての予約
                            </Link>

                            <Link
                                href="/admin/contact/list"
                                className="hover:text-blue-500"
                            >
                                お問合せ一覧
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/reservation/list"
                                className="hover:text-blue-500"
                            >
                                予約一覧
                            </Link>

                            <Link
                                href="/contact/list"
                                className="hover:text-blue-500"
                            >
                                お問合せ
                            </Link>
                        </>
                    )
                ) : null}
            </nav>{" "}
        </div>
    );
}
