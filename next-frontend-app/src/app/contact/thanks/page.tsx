"use client";

import { useEffect } from "react";
import LinkButton from "@/components/LinkButton";

export default function ContactCompletePage() {
    useEffect(() => {
        sessionStorage.removeItem("contact");
    }, []);

    return (
        <div className="w-[700px] mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold">
                お問合せありがとうございました
            </h1>

            <div className="mt-10">
                <LinkButton
                    href="/contact/list"
                    className="rounded bg-gray-300 px-4 py-2"
                >
                    お問合せ一覧へ
                </LinkButton>
            </div>
        </div>
    );
}
