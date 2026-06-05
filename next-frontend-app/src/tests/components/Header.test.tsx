import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import Header from "@/components/Header";
import { useSession, signOut } from "next-auth/react";

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        return <img {...props} />;
    },
}));

describe("Header", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("ログイン中のユーザー名が表示される", () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    name: "山田太郎",
                    isManager: false,
                },
                accessToken: "test-token",
            },
            status: "authenticated",
        } as any);

        render(<Header />);

        expect(screen.getByText("山田太郎")).toBeInTheDocument();
        expect(screen.getByText("ログアウト")).toBeInTheDocument();
        expect(screen.getByText("TEL.0120-123-456")).toBeInTheDocument();
    });

    test("一般ユーザーの場合、ロゴリンクは /reservation/list になる", () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    name: "一般ユーザー",
                    isManager: false,
                },
                accessToken: "test-token",
            },
            status: "authenticated",
        } as any);

        render(<Header />);

        const logo = screen.getByAltText("Logo");
        const link = logo.closest("a");

        expect(link).toHaveAttribute("href", "/reservation/list");
    });

    test("管理者の場合、ロゴリンクは /admin/event/list になる", () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    name: "管理者",
                    isManager: true,
                },
                accessToken: "test-token",
            },
            status: "authenticated",
        } as any);

        render(<Header />);

        const logo = screen.getByAltText("Logo");
        const link = logo.closest("a");

        expect(link).toHaveAttribute("href", "/admin/event/list");
    });

    test("ログアウトボタンを押すとLaravel logout後にsignOutされる", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
        }) as any;

        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    name: "山田太郎",
                    isManager: false,
                },
                accessToken: "test-token",
            },
            status: "authenticated",
        } as any);

        render(<Header />);

        fireEvent.click(screen.getByText("ログアウト"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer test-token",
                    },
                },
            );

            expect(signOut).toHaveBeenCalledWith({
                callbackUrl: "/login",
            });
        });
    });

    test("読み込み中はLoadingが表示される", () => {
        vi.mocked(useSession).mockReturnValue({
            data: null,
            status: "loading",
        } as any);

        render(<Header />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
