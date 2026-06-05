import { test, expect } from "@playwright/test";

// ＝＝＝管理者のみ＝＝＝
test.describe("お問合せ機能", () => {
    // 各テストの前にログインページにアクセスする
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/login");

        // 管理者アカウントでログイン
        await page.getByLabel("メールアドレス").fill("admin@example.com");
        await page.getByLabel("パスワード").fill("password");
        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(
            page.getByText("ようこそ、管理者さん", { exact: true }),
        ).toBeVisible();

        // お問合せ一覧へ遷移
        await page.getByRole("link", { name: "全てのお問合せ" }).click();

        await expect(page).toHaveURL(
            "http://localhost:3000/admin/contact/list",
        );
    });

    test("お問合せが一覧表示されている", async ({ page }) => {
        // 一覧(項目名)の表示
        await expect(
            page.getByRole("heading", { name: "お問合せ一覧", exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "ユーザー名", exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", {
                name: "お問合せ日時",
                exact: true,
            }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "件名", exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole("columnheader", { name: "ステータス", exact: true }),
        ).toBeVisible();
    });

    test("お問合せ内容（詳細）が表示されている", async ({ page }) => {
        // テーブルをみて一つ目のrowのリンクをとる
        await expect(page.getByRole("table")).toBeVisible();

        await page.getByRole("link", { name: "詳細" }).first().click();

        await expect(page).toHaveURL("http://localhost:3000/admin/contact/1");

        // お問合せ内容（詳細）が一覧と一致している
        await expect(
            page.getByRole("heading", { name: "お問合せ確認" }),
        ).toBeVisible();
        // ステータス
        await expect(page.getByText("未対応", { exact: true })).toBeVisible();
        // ユーザー名
        await expect(
            page.getByText("テストユーザー", { exact: true }),
        ).toBeVisible();
        // 件名
        await expect(
            page.getByText("予約時間について", { exact: true }),
        ).toBeVisible();

        // お問合せ一覧へ戻る
        await page.getByRole("link", { name: "一覧へ戻る" }).click();
        await expect(page).toHaveURL(
            "http://localhost:3000/admin/contact/list",
        );
    });
});
