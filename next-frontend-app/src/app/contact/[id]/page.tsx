import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

type Contact = {
  id: number;
  title: string;
  detail: string;
  img: string | null;
  created_at: string;
  status: 1;
  contact_status: {
    id: number;
    status: string;
  };
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
    <div className="w-[700px] mx-auto mt-20">
      <h1 className="mb-8 text-3xl font-bold text-center">お問合せ確認</h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">件名</p>
            <p className="col-span-2">{contact.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">ステータス</p>
            <p className="col-span-2">{contact.contact_status.status}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold min-h-20">詳細</p>
            <p
              className="
                        col-span-2
                        min-h-40
                        "
            >
              {contact.detail}
            </p>
          </div>

          {contact.img && (
            <div className="grid grid-cols-3 gap-4">
              <p className="font-bold">画像</p>
              <div className="w-4/5">
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${contact.img}`}
                  className="w-40"
                  alt="お問い合わせ画像"
                  width={160}
                  height={120}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <LinkButton
            href="/contact/list"
            className="bg-gray-300 px-4 py-2 rounded"
          >
            一覧へ戻る
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
