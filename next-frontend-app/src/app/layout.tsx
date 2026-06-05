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
                    <main className="w-full max-w-screen-2xl mx-auto px-8 sm:px-10 flex-1 mt-10">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
