import EventReserveForm from "./components/EventReserveForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PaymentMethod, ReservationErrors, Schedule } from "./types";

export interface EventReserveResponse {
    schedule: Schedule;
    paymentMethods: PaymentMethod[];
    remainingCapacity: number;
    errors?: ReservationErrors;
}

interface Props {
    params: Promise<{ id: string }>;
}

async function getEventReserve(id: string): Promise<EventReserveResponse> {
    const session = await getServerSession(authOptions);

    // ログインされていない場合はログイン画面へ
    if (!session?.accessToken) {
        redirect(`/login?callbackUrl=/event/${id}/reservation`);
    }

    const cookieStore = await cookies();

    const errorCookie = cookieStore.get("reservation_errors")?.value;

    const errors = errorCookie ? JSON.parse(errorCookie) : undefined;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}/reservation`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (res.status === 401) {
        redirect(`/login?callbackUrl=/event/${id}/reservation`);
    }

    if (!res.ok) {
        throw new Error("予約入力欄が取得できませんでした");
    }

    const data = await res.json();

    return {
        ...data,
        errors,
    };
}

export default async function EventReservePage({ params }: Props) {
    const { id } = await params;

    const { schedule, paymentMethods, remainingCapacity, errors } =
        await getEventReserve(id);

    return (
        <EventReserveForm
            schedule={schedule}
            paymentMethods={paymentMethods}
            remainingCapacity={remainingCapacity}
            errors={errors}
        />
    );
}
