import type { Metadata } from "next";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "予約入力システム",
  description: "reservation app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      // className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col mb-10">
        <Providers>
          <Header />
          <Menu />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
