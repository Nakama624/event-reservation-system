import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";

type Contact = {
    id: number;
    title: string;
    detail: string;
    status: string;
    img: string | null;
    created_at: string;
};

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function getContactDetail(id: string): Promise<Contact> {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/${id}`;
    const res = await fetch(url, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (res.status === 401) {
        redirect("/login");
    }

    if (!res.ok) {
        throw new Error("お問い合わせ詳細の取得に失敗しました");
    }

    return res.json();
}

export default async function ContactDetailPage({ params }: Props) {
    const { id } = await params;
    const contact = await getContactDetail(id);

    return (
        <div className="max-w-[700px] mx-auto mt-20">
            <h1 className="text-3xl mb-4 py-auto font-bold text-gray-500 text-center">
                お問合せ確認
            </h1>

            <div className="border p-4">
                <div className="flex items-start mb-4">
                    <p className="w-24 pt-2">件名</p>
                    <div className="w-4/5">
                        <div className="p-1 w-full">{contact.title}</div>
                    </div>
                </div>

                <div className="flex items-start mb-4">
                    <p className="w-24 pt-2">詳細</p>
                    <div className="w-4/5">
                        <div className="p-1 w-full min-h-32 break-words whitespace-pre-wrap">
                            {contact.detail}
                        </div>
                    </div>
                </div>

                {contact.img && (
                    <div className="flex items-start mb-4">
                        <p className="w-24 pt-2">画像</p>
                        <div className="w-4/5">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${contact.img}`}
                                className="w-40"
                                alt="お問い合わせ画像"
                                width={160}
                                height={120}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <LinkButton
                        href="/contact/list"
                        className="bg-blue-500 text-white"
                    >
                        一覧へ戻る
                    </LinkButton>
                </div>
            </div>
        </div>
    );
}
