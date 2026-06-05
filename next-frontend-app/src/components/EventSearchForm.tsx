import LinkButton from "@/components/LinkButton";

interface Props {
    keyword?: string;
    date?: string;
    action?: string;
}

export default function EventSearchForm({
    keyword = "",
    date = "",
    action = "/event/list",
}: Props) {
    return (
        <form action={action} method="get" className="flex gap-2">
            <input
                type="text"
                name="keyword"
                defaultValue={keyword}
                placeholder="イベント名または講師名を入力してください"
                className="border w-96 h-10 rounded p-1"
            />

            <input
                type="date"
                name="date"
                defaultValue={date}
                className="border h-10 rounded p-1"
            />

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                検索
            </button>
            <LinkButton href={action} className="bg-gray-300 px-4 py-2 rounded">
                クリア
            </LinkButton>
        </form>
    );
}
