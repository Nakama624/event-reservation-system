import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return redirect("/login");
    }

    const { searchParams } = new URL(request.url);

    const reservationId = searchParams.get("reservation_id");

    if (!reservationId) {
        return redirect(`/event/${id}/reservation`);
    }

    const formData = new FormData();

    formData.append("reservation_id", reservationId);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}/reservation/stripe`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: formData,
        },
    );

    const body = await res.text();

    console.log("stripe checkout status:", res.status);
    console.log("stripe checkout body:", body);

    if (!res.ok) {
        throw new Error("Stripe決済の作成に失敗しました");
    }

    const result = JSON.parse(body);

    if (!result.url) {
        throw new Error("StripeのURLが返ってきていません");
    }

    return redirect(result.url);
}
