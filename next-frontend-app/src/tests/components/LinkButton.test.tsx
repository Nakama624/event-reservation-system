import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import LinkButton from "@/components/LinkButton";

test("ボタンが表示される", () => {
  render(<LinkButton href="/event/list">イベント一覧</LinkButton>);

  expect(screen.getByText("イベント一覧")).toBeInTheDocument();
});

test("正しく遷移される", () => {
  render(<LinkButton href="/event/list">イベント一覧</LinkButton>);

  expect(screen.getByRole("link")).toHaveAttribute("href", "/event/list");
});
