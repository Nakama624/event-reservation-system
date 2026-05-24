"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Menu() {
  const { data: session, status } = useSession();
  const isManager = session?.user?.isManager === true;

  const pathname = usePathname();

  return (
    <div className={`p-4 shadow ${isManager ? "bg-red-100" : "bg-gray-100"}`}>
      <nav className="flex items-center gap-8">
        <Link
          href="/event/list"
          className={`hover:text-blue-500 ${
            pathname === "/event/list" ? " font-bold" : ""
          }`}
        >
          イベント一覧
        </Link>

        <Link
          href="/past-event/list"
          className={`hover:text-blue-500 ${
            pathname === "/past-event/list" ? " font-bold" : ""
          }`}
        >
          過去のイベント一覧
        </Link>

        <Link
          href="/calendar"
          className={`hover:text-blue-500 ${
            pathname === "/calendar" ? " font-bold" : ""
          }`}
        >
          イベントカレンダー
        </Link>

        {status === "loading" ? (
          <p className="flex-1 text-center">Loading...</p>
        ) : session ? (
          isManager ? (
            <>
              <Link
                href="/admin/event/list"
                className={`hover:text-blue-500 ${
                  pathname === "/admin/event/list" ? " font-bold" : ""
                }`}
              >
                全ての予約
              </Link>

              <Link
                href="/admin/contact/list"
                className={`hover:text-blue-500 ${
                  pathname === "/admin/contact/list" ? " font-bold" : ""
                }`}
              >
                全てのお問合せ
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/reservation/list"
                className={`hover:text-blue-500 ${
                  pathname === "/reservation/list" ? " font-bold" : ""
                }`}
              >
                予約一覧
              </Link>

              <Link
                href="/contact/list"
                className={`hover:text-blue-500 ${
                  pathname === "/contact/list" ? " font-bold" : ""
                }`}
              >
                お問合せ一覧
              </Link>
            </>
          )
        ) : null}
      </nav>
    </div>
  );
}
