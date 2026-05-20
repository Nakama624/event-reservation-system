import LinkButton from "@/components/LinkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Contact {
  id: number;
  user_name: string;
  title: string;
  status: string;
  created_at: string;
}

async function getContacts(): Promise<Contact[]> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/contact/list`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  console.log("res:", res);

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    throw new Error("お問い合わせ一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function ContactListPage() {
  const contacts = await getContacts();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-2xl font-bold text-gray-500">
          お問い合わせ一覧
        </h1>
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full">
          <thead>
            <tr className="border border-gray-300 bg-gray-300 h-12 text-lg">
              <th className="px-4 py-3 whitespace-nowrap">ユーザー名</th>
              <th className="px-4 py-3 whitespace-nowrap">お問合せ日時</th>
              <th className="px-4 py-3 whitespace-nowrap">件名</th>
              <th className="px-4 py-3 whitespace-nowrap">ステータス</th>
              <th className="px-4 py-3 whitespace-nowrap">詳細</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="text-center h-16 border border-gray-300"
              >
                <td className="px-4">{contact.user_name}</td>
                <td className="px-4">{contact.created_at}</td>
                <td className="px-4">{contact.title}</td>
                <td className="px-4">{contact.status}</td>
                <td className="px-4">
                  <LinkButton
                    href={`/admin/contact/${contact.id}`}
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
