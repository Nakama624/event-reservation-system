import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PaymentSuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ reservation_id?: string }>;
}) {
    const { id } = await params;
    const { reservation_id } = await searchParams;

    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    if (!reservation_id) {
        redirect(`/event/${id}/reservation`);
    }

    const formData = new FormData();
    formData.append("reservation_id", reservation_id);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/payment-success`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: formData,
        },
    );

    if (!res.ok) {
        throw new Error("支払い完了処理に失敗しました");
    }

    redirect(`/event/${id}/reservation/complete`);
}
