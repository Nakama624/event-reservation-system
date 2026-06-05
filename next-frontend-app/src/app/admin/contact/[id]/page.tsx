import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { adminFetch } from "@/utils/adminFetch";

type Contact = {
  id: number;
  user_name: string;
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

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/contact/${id}`;
  const res = await adminFetch(url, {
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
    throw new Error("お問合せ詳細の取得に失敗しました");
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
            <p className="font-bold">ステータス</p>
            <p className="col-span-2">{contact.status}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">ユーザー名</p>
            <p className="col-span-2">{contact.user_name}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">件名</p>
            <p className="col-span-2">{contact.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">詳細</p>
            <p className="col-span-2">{contact.detail}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <p className="font-bold">画像</p>

            <div className="w-4/5">
              {contact.img ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${contact.img}`}
                  className="w-40"
                  alt="お問合せ画像"
                />
              ) : (
                <p>画像なし</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <LinkButton
              href="/admin/contact/list"
              className="rounded bg-gray-300 px-4 py-2"
            >
              一覧へ戻る
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
