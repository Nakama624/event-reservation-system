import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return redirect("/login");
    }

    const cookieStore = await cookies();

    const saved = cookieStore.get("reservation_confirm")?.value;

    if (!saved) {
        return redirect(`/event/${id}/reservation`);
    }

    const data = JSON.parse(saved);

    const formData = new FormData();

    formData.append("participants", data.reserve.participants);
    formData.append("contact_number", data.reserve.contact_number);
    formData.append("payment_method_id", data.reserve.payment_method_id);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}/reservation/complete`,
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

    console.log("reservation complete status:", res.status);
    console.log("reservation complete body:", body);

    if (!res.ok) {
        throw new Error("予約登録に失敗しました");
    }

    const result = JSON.parse(body);

    if (!result.reservation) {
        throw new Error("reservation が返ってきていません");
    }

    const reservationId = result.reservation.id;
    const paymentMethodId = String(result.reservation.payment_method_id);

    if (paymentMethodId === "1" || paymentMethodId === "2") {
        return redirect(
            `/api/event/${id}/reservation/stripe?reservation_id=${reservationId}`,
        );
    }

    return redirect(`/event/${id}/reservation/complete`);
}
