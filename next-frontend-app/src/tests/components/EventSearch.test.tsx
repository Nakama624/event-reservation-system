import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import EventSearchForm from "@/components/EventSearchForm";

test("検索フォームが表示される", () => {
    render(<EventSearchForm />);

    expect(
        screen.getByPlaceholderText("イベント名または講師名を入力してください"),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument();

    expect(screen.getByText("クリア")).toBeInTheDocument();
});
