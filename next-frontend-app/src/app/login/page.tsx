"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 422) {
        setErrors(data.errors);
        return;
      }

      if (!res.ok) {
        setErrors({
          email: [data.message || "ログインに失敗しました"],
        });

        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({
          email: ["ログイン処理に失敗しました"],
        });
        return;
      }

      const updatedSession = await getSession();

      if (!updatedSession?.user?.emailVerifiedAt) {
        router.push("/email/verify-notice");
      } else if (updatedSession.user.isManager) {
        router.push("/admin/event/list");
      } else {
        router.push("/reservation/list");
      }
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrors({
        email: ["通信エラーが発生しました"],
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-start justify-center pt-20">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              メールアドレス
            </label>
            <input
              id="email"
              // Laravel側Requestでチェックするためフロント側を通過させる
              // type="email"
              // required
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Laravel側Requestでチェックするためフロント側を通過させる
              // required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          管理者: admin@example.com / password
        </p>

        <p className="mt-4 text-sm text-gray-600">
          一般: user@example.com / password
        </p>
        <div className="text-center mt-4">
          <a href="/register" className="font-bold">
            新規登録はこちら
          </a>
        </div>
      </div>
    </div>
  );
}
