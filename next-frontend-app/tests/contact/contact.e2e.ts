import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("お問合せ一覧", () => {
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        // 各テストの前にログインページにアクセスする
        await page.goto("http://localhost:3000/login");

        // ログイン
        await page.getByLabel("メールアドレス").fill("user@example.com");
        await page.getByLabel("パスワード").fill("password");
        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(page).toHaveURL("http://localhost:3000/reservation/list");

        await expect(
            page.getByText("ようこそ、テストユーザーさん", { exact: true }),
        ).toBeVisible();

        // お問合せ一覧画面へ遷移
        await page.getByRole("link", { name: "お問合せ一覧" }).click();

        await expect(page).toHaveURL("http://localhost:3000/contact/list");
    });

    test("お問合せ一覧から新規作成画面に遷移することができる", async ({
        page,
    }) => {
        await expect(page).toHaveURL("http://localhost:3000/contact/list");

        await page.getByRole("link", { name: "新規作成", exact: true }).click();

        await expect(page).toHaveURL("http://localhost:3000/contact");

        await expect(
            page.getByRole("heading", { name: "お問合せ", exact: true }),
        ).toBeVisible();

        await expect(
            page
                .locator("div")
                .filter({ hasText: "件名詳細画像確認画面へ" })
                .nth(1),
        ).toBeVisible();
    });

    test("件名/詳細が未入力の場合エラーメッセージが表示されること", async ({
        page,
    }) => {
        await page.getByRole("link", { name: "新規作成" }).click();

        // 何も入力しないでそのまま「確認画面へ」ボタン押下
        await page.getByRole("button", { name: "確認画面へ" }).click();

        // バリデーションメッセージを表示
        await expect(page.getByText("件名を入力してください")).toBeVisible();
        await expect(page.getByText("詳細を入力してください")).toBeVisible();

        // 遷移しない
        await expect(page).toHaveURL("http://localhost:3000/contact");
    });
});
