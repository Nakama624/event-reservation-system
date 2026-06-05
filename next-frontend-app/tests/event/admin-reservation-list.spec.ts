import { test, expect } from "@playwright/test";

// 各テストの前にログインページにアクセスする
test("全ユーザー予約がイベント毎に一覧表示されている", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    // 管理者アカウントでログイン
    await page.getByLabel("メールアドレス").fill("admin@example.com");
    await page.getByLabel("パスワード").fill("password");

    await page.getByRole("button", { name: "ログイン" }).click();

    await expect(page).toHaveURL("http://localhost:3000/admin/event/list");

    await expect(page.getByText("ようこそ、管理者さん")).toBeVisible();
    //メニューの表示
    await expect(
        page.getByRole("link", { name: "イベント一覧", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "過去のイベント一覧", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "イベントカレンダー", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "全ての予約", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "全てのお問合せ", exact: true }),
    ).toBeVisible();

    // 一覧(項目名)の表示
    await expect(
        page.getByRole("heading", { name: "全ての予約一覧", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("columnheader", { name: "開催日時", exact: true }),
    ).toBeVisible();
    await page.locator("body").click();
    await expect(
        page.getByRole("columnheader", { name: "イベント名", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("columnheader", { name: "講師", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("columnheader", { name: "申込済人数", exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole("columnheader", { name: "状態", exact: true }),
    ).toBeVisible();
});
