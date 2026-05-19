import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(request: Request, { params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const { id } = await params;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/${id}/canceled`;

    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    const body = await res.text();

    console.log("cancel status:", res.status);
    console.log("cancel body:", body);

    if (res.status === 401) {
        redirect("/login");
    }

    if (!res.ok) {
        throw new Error("キャンセルに失敗しました");
    }

    redirect("/reservation/list");
}
