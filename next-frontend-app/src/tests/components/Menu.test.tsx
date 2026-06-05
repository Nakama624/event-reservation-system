import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

test("イベント一覧が表示される", () => {
    vi.mocked(useSession).mockReturnValue({
        data: null,
        status: "unauthenticated",
    } as any);

    render(<Menu />);

    expect(screen.getByText("イベント一覧")).toBeInTheDocument();
});

test("一般ユーザーは予約一覧が表示される", () => {
    vi.mocked(useSession).mockReturnValue({
        data: {
            user: {
                isManager: false,
            },
        },
        status: "authenticated",
    } as any);

    render(<Menu />);

    expect(screen.getByText("予約一覧")).toBeInTheDocument();
});

test("管理者は全ての予約が表示される", () => {
    vi.mocked(useSession).mockReturnValue({
        data: {
            user: {
                isManager: true,
            },
        },
        status: "authenticated",
    } as any);

    render(<Menu />);

    expect(screen.getByText("全ての予約")).toBeInTheDocument();
});
