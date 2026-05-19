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

    const formData = await request.formData();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}/reservation/confirm`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: formData,
        },
    );

    const data = await res.json();

    if (res.status === 422) {
        const cookieStore = await cookies();

        cookieStore.set("reservation_errors", JSON.stringify(data.errors), {
            httpOnly: true,
            path: "/",
            maxAge: 60,
        });

        return redirect(`/event/${id}/reservation`);
    }

    if (!res.ok) {
        throw new Error("予約確認データの作成に失敗しました");
    }

    const cookieStore = await cookies();

    cookieStore.set("reservation_confirm", JSON.stringify(data), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 10,
    });

    return redirect(`/event/${id}/reservation/confirm`);
}
