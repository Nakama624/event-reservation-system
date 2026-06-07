import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("お問合せ一覧", () => {
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();

        await page.goto("http://localhost:3000/login");

        await page.getByLabel("メールアドレス").fill("user@example.com");
        await page.getByLabel("パスワード").fill("password");
        await page.getByRole("button", { name: "ログイン" }).click();

        await page.waitForTimeout(1000);

        // まずログイン成功を待つ
        await expect(page).not.toHaveURL(/\/login/);

        await expect(
            page.getByText("ようこそ、テストユーザーさん", { exact: true }),
        ).toBeVisible();

        await page
            .getByRole("link", { name: "お問合せ一覧", exact: true })
            .click();

        await expect(page).toHaveURL("http://localhost:3000/contact/list");
    });

    test("お問合せが一覧表示されている", async ({ page }) => {
        // 一覧(項目名)の表示
        await expect(
            page.getByRole("heading", { name: "お問合せ一覧" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "お問合せ日時" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "件名" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "ステータス" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "削除" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "詳細" }),
        ).toBeVisible();
    });

    test("お問合せ一覧に自分が投稿したお問合せが表示されている", async ({
        page,
    }) => {
        // 一覧(項目名)の表示
        await expect(
            page.getByRole("heading", { name: "お問合せ一覧" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "お問合せ日時" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "件名" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "ステータス" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "削除" }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "詳細" }),
        ).toBeVisible();

        await expect(page.getByRole("table")).toBeVisible();

        // 1行目を取得
        const reservationRow = page.locator("tbody tr").first();
        // 行の中身確認
        // 件名
        await expect(reservationRow).toContainText("予約時間について");
        // ステータス
        await expect(reservationRow).toContainText("未対応");
    });
});
