import { redirect } from "next/navigation";

export async function adminFetch(url: string, options?: RequestInit) {
    const res = await fetch(url, options);

    if (res.status === 401) {
        redirect("/login");
    }

    if (res.status === 403) {
        redirect("/reservation/list");
    }

    return res;
}
