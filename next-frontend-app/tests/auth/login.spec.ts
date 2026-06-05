import { test, expect } from "@playwright/test";

test.describe("ログイン機能", () => {
    // 各テストの前にログインページにアクセスする
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/login");
    });

    // ログイン成功
    test("正しい認証情報でログインできること", async ({ page }) => {
        // 一般ユーザーアカウントでログイン
        await page.getByLabel("メールアドレス").fill("user@example.com");
        await page.getByLabel("パスワード").fill("password");

        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(page).toHaveURL("http://localhost:3000/reservation/list");

        await expect(
            page.getByText("ようこそ、テストユーザーさん"),
        ).toBeVisible();

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
            page.getByRole("link", { name: "予約一覧", exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole("link", { name: "お問合せ一覧", exact: true }),
        ).toBeVisible();

        // 一覧(項目名)の表示
        await expect(
            page.getByRole("heading", { name: "予約一覧" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "開催日時" }),
        ).toBeVisible();
        await page.locator("body").click();
        await expect(
            page.getByRole("columnheader", { name: "イベント名" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "講師名" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "予約人数" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "支払ステータス" }),
        ).toBeVisible();
    });

    // ログイン失敗のテストケース
    test("間違った認証情報ではログインできないこと", async ({ page }) => {
        // 1. フォームに間違った情報を入力する
        await page.getByLabel("メールアドレス").fill("wrong@example.com");
        await page.getByLabel("パスワード").fill("wrongpassword");

        // 2. ログインボタンをクリックする
        await page.getByRole("button", { name: "ログイン" }).click();

        // 3. エラーメッセージが表示されることを確認する
        await expect(
            page.getByText("認証情報が正しくありません。"),
        ).toBeVisible();

        // 4. ログインページに留まっていることを確認する
        await expect(page).toHaveURL("http://localhost:3000/login");
    });
});

test.describe("認証ガード", () => {
    test("未ログインで予約一覧画面にアクセスするとログイン画面へ戻されること", async ({
        page,
    }) => {
        await page.context().clearCookies();

        await page.goto("http://localhost:3000/reservation/list");

        await page.waitForURL("**/login");
        await expect(page).toHaveURL("http://localhost:3000/login");

        await expect(
            page.getByRole("heading", { name: "ログイン" }),
        ).toBeVisible();
    });
});
