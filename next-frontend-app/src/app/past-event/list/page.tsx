import LinkButton from "@/components/LinkButton";
import EventSearchForm from "@/components/EventSearchForm";
import Link from "next/link";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

interface EventItem {
  id: number;
  event_id: number;
  title: string;
  instructor_name: string;
  start_at: string;
  finish_at: string | null;
  lesson_img1: string;
  capacity: number;
  total_participants: number;
  remaining_capacity: number;
  price: number;
  is_bookable: boolean;
  is_past_event: boolean;
}

interface EventListResponse {
  events: EventItem[];
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

async function getEvents(
  keyword = "",
  date = "",
  page = "1",
): Promise<PaginationResponse<EventItem>> {
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (date) params.set("date", date);
  if (page) params.set("page", page);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/past-event/list?${params.toString()}`;
  console.log(url);
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.log("過去イベント一覧APIエラー:", res.status, errorText);
    throw new Error("過去のイベント一覧の取得に失敗しました");
  }

  const data: PaginationResponse<EventItem> = await res.json();

  return data;
}

export default async function EventListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params?.page ?? "1";

  const keyword = params?.keyword ?? "";
  const date = params?.date ?? "";

  const currentEvents = await getEvents(keyword, date, page);

  return (
    <div className="w-full">
      <section className="flex justify-between items-center">
        <EventSearchForm
          keyword={keyword}
          date={date}
          action="/past-event/list"
        />
      </section>

      <div className="pb-20">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="mt-10 mb-4 text-2xl font-bold text-gray-500">
            過去のイベント一覧
          </h1>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from(
              { length: currentEvents.last_page },
              (_, i) => i + 1,
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/past-event/list?page=${pageNumber}`}
                className={`rounded px-3 py-2 ${
                  pageNumber === currentEvents.current_page
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
                <th className="px-4 py-3 whitespace-nowrap"></th>
                <th className="px-4 py-3 whitespace-nowrap">開催日時</th>
                <th className="px-4 py-3 whitespace-nowrap">イベント名</th>
                <th className="px-4 py-3 whitespace-nowrap">講師</th>
                <th className="px-4 py-3 whitespace-nowrap">残席</th>
                <th className="px-4 py-3 whitespace-nowrap">金額</th>
                <th className="px-4 py-3 whitespace-nowrap"></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {currentEvents.data.map((event) => (
                <tr
                  key={event.id}
                  className={`text-center h-16 border border-gray-300 ${
                    event.is_past_event ? "bg-gray-100 text-gray-400" : ""
                  }`}
                >
                  <td className="w-32 h-24">
                    <div className="flex items-center justify-center w-full h-full">
                      <img
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/event-images/${event.lesson_img1}`}
                        alt="イベントイメージ"
                        width={80}
                        height={48}
                        className="object-contain max-h-20 w-auto hover:scale-125 transition-transform duration-300"
                      />
                    </div>
                  </td>

                  <td className="px-4">{event.start_at}</td>
                  <td className="px-4">{event.title}</td>
                  <td className="px-4">{event.instructor_name}</td>
                  <td className="px-4">
                    {event.is_past_event ? "-" : event.remaining_capacity}
                  </td>
                  <td>
                    {event.price ? `¥${event.price.toLocaleString()}` : "-"}
                  </td>

                  <td>
                    {event.is_past_event ? (
                      <span className="text-gray-400">終了</span>
                    ) : (
                      <span className="text-green-600">開催予定</span>
                    )}
                  </td>

                  <td className="px-4">
                    <LinkButton
                      href={`/event/${event.id}`}
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
