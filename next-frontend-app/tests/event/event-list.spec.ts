import { test, expect } from "@playwright/test";

// ＝＝＝管理者/一般ユーザー共通＝＝＝
test.describe("イベント一覧", () => {
    // 各テストの前にログインページにアクセスする
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/event/list");
    });

    test("イベント一覧が表示されること", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: "イベント一覧" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "開催日時" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "イベント名" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "講師" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "残席" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "金額" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "状態" }),
        ).toBeVisible();
    });

    test("講師名で検索すると部分一致で検索結果のみが表示されること", async ({
        page,
    }) => {
        // 部分文字列を入力
        await page
            .getByRole("textbox", {
                name: "イベント名または講師名を入力してください",
            })
            .fill("佐藤");

        await page.getByRole("button", { name: "検索" }).click();

        // 講師名：佐藤○○ のイベントが表示される
        const instructorCells = page.getByRole("cell", { name: "佐藤 美穂" });
        await expect(instructorCells.first()).toBeVisible();

        // 関係ない講師は表示されない
        await expect(page.getByText("Kana")).toHaveCount(0);
    });

    test("日付で検索すると開催日付が一致する検索結果のみが表示されること", async ({
        page,
    }) => {
        //開催日付付を入力
        await page.locator('input[type="date"]').fill("2026-06-18");

        await page.getByRole("button", { name: "検索" }).click();

        // 開催日付が2026/6/18のイベントが表示される
        const dateCells = page.getByRole("cell", {
            name: /2026-06-18/,
        });

        await expect(dateCells.first()).toBeVisible();

        // 関係ない開催日付は表示されない
        await expect(page.getByText(/2026\/06\/19/)).toHaveCount(0);
    });

    test("ページネーションで次ページへ移動できること", async ({ page }) => {
        // 2ページ目へ移動
        await page.getByRole("link", { name: "2" }).click();
        await expect(page).toHaveURL(/page=2/);

        // 3ページ目へ移動
        await page.getByRole("link", { name: "3" }).click();
        await expect(page).toHaveURL(/page=3/);

        // 1ページ目へ戻る
        await page.getByRole("link", { name: "1" }).click();
        await expect(page).toHaveURL(/page=1/);
    });
});
