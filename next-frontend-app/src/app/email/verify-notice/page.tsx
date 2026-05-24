"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function VerifyNoticePage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const hasSent = useRef(false);

  const sendVerificationEmail = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/verification-notification`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    const data = await res.json();

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      setMessage(data.message || "認証メールの送信に失敗しました");
      return;
    }

    setMessage(data.message);
  }, [session]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (hasSent.current) {
      return;
    }

    hasSent.current = true;
    sendVerificationEmail();
  }, [status, sendVerificationEmail]);

  const resendEmail = async () => {
    await sendVerificationEmail();
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">メール認証をしてください</h1>

      <p className="mb-6">
        登録したメールアドレスに認証メールを送信しました。
        Mailpitを開いて、メール内の認証リンクをクリックしてください。
      </p>

      <div className="flex gap-4">
        <a
          href="http://localhost:8025"
          target="_blank"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Mailpitを開く
        </a>

        <button
          onClick={resendEmail}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          認証メールを再送する
        </button>
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
