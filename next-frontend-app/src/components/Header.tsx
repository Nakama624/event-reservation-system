"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const isManager = session?.user?.isManager === true;

  const handleLogout = async () => {
    try {
      if (session?.accessToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Laravel logout failed:", error);
    } finally {
      await signOut({
        callbackUrl: "/login",
      });
    }
  };
  return (
    <header
      className={`
      w-full
      h-20
      ${isManager ? "bg-red-100" : "bg-gray-100"}
      flex
      items-center
      px-6
    `}
    >
      {isManager ? (
        <Link href="/admin/event/list">
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={192}
            height={60}
            className="w-48 h-auto"
            priority
          />
        </Link>
      ) : (
        <Link href="/reservation/list">
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={192}
            height={60}
            className="w-48 h-auto"
            priority
          />
        </Link>
      )}

      {/* ようこそ */}
      <div className="ml-8">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : session ? (
          <p className="text-lg">
            ようこそ、
            <span className="font-bold">{session.user?.name}</span>
            さん
          </p>
        ) : null}
      </div>

      {/* 右側 */}
      <div className="ml-auto flex items-center gap-8">
        {session ? (
          <button
            onClick={handleLogout}
            className="
              px-4
              py-2
              font-medium
              rounded-md
              hover:bg-gray-300
              transition
              border
              border-gray-600
              "
          >
            ログアウト
          </button>
        ) : (
          <Link
            href="/login"
            className="
              px-4
              py-2
              font-medium
              rounded-md
              hover:bg-gray-300
              transition
              border
              border-gray-600
              "
          >
            ログイン
          </Link>
        )}

        <div className="text-black text-right">
          <p className="text-2xl font-bold">TEL.0120-123-456</p>

          <p className="text-sm">【営業時間】9:00〜21:00</p>
        </div>
      </div>
    </header>
  );
}
