import { redirect } from "next/navigation";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const formData = await request.formData();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/complete`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData,
    });

    const body = await res.text();

    console.log("contact complete status:", res.status);
    console.log("contact complete body:", body);

    if (!res.ok) {
        throw new Error("お問合せの保存に失敗しました");
    }

    redirect("/contact/thanks");
}
