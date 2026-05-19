import Image from "next/image";
import LinkButton from "@/components/LinkButton";

interface Event {
    id: number;
    title: string;
    capacity: number;
    lesson_img1: string;
    lesson_img2: string;
    lesson_img3: string;
    catch_copy: string;
    instructor_name: string;
    instructor_img: string;
    instructor_profile: string;
    price: number;
    schedule: {
        id: number;
        event_id: number;
        start_at: string;
        finish_at: string;
    };
}

async function getPastEvents(): Promise<Event[]> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/past-event/list`;
    const res = await fetch(url, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("イベント一覧の取得に失敗しました");
    }

    return res.json();
}

export default async function PastEventListPage() {
    const pastEvents = await getPastEvents();

    return (
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 pb-20">
            <div className="flex justify-between items-center my-10">
                <h1 className="text-left text-2xl font-bold text-gray-500">
                    過去のイベント
                </h1>
            </div>
            <div className="overflow-x-auto border border-gray-300">
                <table className="w-full">
                    <thead>
                        <tr className="border border-gray-300 bg-gray-300 h-12 text-lg">
                            <th></th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                イベント名
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                講師
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                金額
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastEvents.map((pastEvent) => (
                            <tr
                                key={pastEvent.id}
                                className="text-center h-16 border border-gray-300"
                            >
                                <td className="w-32 h-24">
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Image
                                            src={`/event-images/${pastEvent.lesson_img1}`}
                                            alt="イベントイメージ"
                                            width={80}
                                            height={48}
                                            className="
                                            object-contain
                                            max-h-20
                                            w-auto
                                            hover:scale-[2]
                                            transition-transform
                                            duration-300
                                        "
                                        />
                                    </div>
                                </td>
                                <td className="px-4">{pastEvent.title}</td>
                                <td className="px-4">
                                    {pastEvent.instructor_name}
                                </td>
                                <td className="px-4">
                                    ¥{pastEvent.price.toLocaleString()}
                                </td>
                                <td className="px-4">
                                    <LinkButton
                                        href={`/event/${pastEvent.id}`}
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
    );
}
