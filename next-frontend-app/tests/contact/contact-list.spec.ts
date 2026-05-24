import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("お問合せ一覧", () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にログインページにアクセスする
    await page.goto("http://localhost:3000/login");

    // ログイン
    await page.getByLabel("メールアドレス").fill("user@example.com");
    await page.getByLabel("パスワード").fill("password");
    await page.getByRole("button", { name: "ログイン" }).click();

    await expect(page.getByText("ようこそ、テストユーザーさん")).toBeVisible();

    // お問合せ一覧画面へ遷移
    await page.getByRole("link", { name: "お問合せ一覧" }).click();
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

    // 予約行を取得
    const reservationRow = page.locator("tr").filter({
      hasText: "2026/05/20 23:46",
    });

    // 行の中身確認
    // 件名
    await expect(reservationRow).toContainText("5555");
    // ステータス
    await expect(reservationRow).toContainText("未対応");
  });
});
