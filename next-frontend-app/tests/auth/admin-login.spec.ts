import { test, expect } from "@playwright/test";

test.describe("ログイン機能", () => {
  // 各テストの前にログインページにアクセスする
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  // ログイン成功
  test("正しい認証情報でログインできること", async ({ page }) => {
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
  });

  // ログイン失敗
  test("間違った認証情報ではログインできないこと", async ({ page }) => {
    // 1. フォームに間違った情報を入力する
    await page.getByLabel("メールアドレス").fill("wrong@example.com");
    await page.getByLabel("パスワード").fill("wrongpassword");

    // 2. ログインボタンをクリックする
    await page.getByRole("button", { name: "ログイン" }).click();

    // 3. エラーメッセージが表示されることを確認する
    await expect(page.getByText("認証情報が正しくありません。")).toBeVisible();

    // 4. ログインページに留まっていることを確認する
    await expect(page).toHaveURL("http://localhost:3000/login");
  });
});

test.describe("認証ガード", () => {
  test("未ログインで管理画面にアクセスするとログイン画面へ戻されること", async ({
    page,
  }) => {
    await page.context().clearCookies();

    await page.goto("http://localhost:3000/admin/event/list");

    await page.waitForURL("**/login?callbackUrl=/admin/event/list");
    await expect(page).toHaveURL(
      "http://localhost:3000/login?callbackUrl=/admin/event/list",
    );

    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  });
});
