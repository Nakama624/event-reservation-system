"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FormButton from "@/components/FormButton";

type Props = {
    contactId: number;
};

export default function ContactDeleteButton({ contactId }: Props) {
    const router = useRouter();
    const { data: session } = useSession();

    const handleDelete = async () => {
        const ok = confirm("本当に削除しますか？");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/${contactId}/delete`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
        );

        console.log("status:", res.status);

        if (!ok) return;

        await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/${contactId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
        );

        router.refresh();
    };

    return (
        <FormButton
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white"
        >
            削除
        </FormButton>
    );
}
