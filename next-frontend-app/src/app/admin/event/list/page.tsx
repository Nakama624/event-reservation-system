import LinkButton from "@/components/LinkButton";
import EventSearchForm from "@/components/EventSearchForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/utils/formatDateTime";
import Link from "next/link";
import { adminFetch } from "@/utils/adminFetch";

interface ReservationItem {
  id: number;
  schedule_id: number;
  event_id: number;
  user_name: string;
  participants: number;
  payment_status: string;
  event_title: string;
  instructor_name: string;
  start_at: string;
}

interface PaginationResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

type Props = {
  searchParams: Promise<{
    keyword?: string;
    date?: string;
    page?: string;
  }>;
};

async function getReservations(
  keyword = "",
  date = "",
  page = "1",
): Promise<PaginationResponse<ReservationItem>> {
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (date) params.set("date", date);
  if (page) params.set("page", page);

  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect(`/login?callbackUrl=/admin/event/list`);
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/event/list?${params.toString()}`;

  const res = await adminFetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (res.status === 401) {
    redirect(`/login?callbackUrl=/admin/event/list`);
  }

  if (res.status === 403) {
    redirect("/event/list");
  }

  if (!res.ok) {
    throw new Error("予約一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function EventListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params?.page ?? "1";

  const keyword = params?.keyword ?? "";
  const date = params?.date ?? "";

  const reservations = await getReservations(keyword, date, page);

  console.log(reservations.data);

  return (
    <div className="w-full">
      <section className="flex justify-start">
        <EventSearchForm
          keyword={keyword}
          date={date}
          action="/admin/event/list"
        />
      </section>

      <div className="pb-20">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="mt-10 mb-4 text-2xl font-bold text-gray-500">
            全ての予約一覧
          </h1>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from(
              { length: reservations.last_page },
              (_, i) => i + 1,
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/admin/event/list?page=${pageNumber}`}
                className={`rounded px-3 py-2 ${
                  pageNumber === reservations.current_page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="border border-gray-300 bg-gray-300 h-12 text-lg">
                <th className="px-4 py-3 whitespace-nowrap">開催日時</th>
                <th className="px-4 py-3 whitespace-nowrap">イベント名</th>
                <th className="px-4 py-3 whitespace-nowrap">講師</th>
                <th className="px-4 py-3 whitespace-nowrap">予約者</th>
                <th className="px-4 py-3 whitespace-nowrap">参加人数</th>
                <th className="px-4 py-3 whitespace-nowrap">支払い状況</th>
                <th className="px-4 py-3 whitespace-nowrap"></th>
              </tr>
            </thead>

            <tbody>
              {reservations.data.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="text-center h-16 border border-gray-300"
                >
                  <td className="px-4">
                    {formatDateTime(reservation.start_at)}
                  </td>
                  <td className="px-4">{reservation.event_title}</td>
                  <td className="px-4">{reservation.instructor_name}</td>
                  <td className="px-4">{reservation.user_name}</td>
                  <td className="px-4">{reservation.participants}</td>
                  <td className="px-4">{reservation.payment_status}</td>
                  <td className="px-4">
                    <LinkButton
                      href={`/admin/event/${reservation.schedule_id}`}
                      className="bg-blue-500 text-white"
                    >
                      詳細
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
