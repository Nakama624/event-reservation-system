import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("イベント詳細/予約", () => {
  // イベント一覧を表示/詳細へ遷移
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/event/list");
    await page.getByRole("link", { name: "イベント一覧" }).click();

    // 対象行を取得
    const targetRow = page
      .locator("tr")
      .filter({
        hasText: "2026-12-30 09:00",
      })
      .filter({
        hasText: "ビジネス英会話講座",
      });

    // 対象行内の「詳細」ボタン押下
    await targetRow.getByRole("link", { name: "詳細" }).click();

    // イベント詳細の「予約する」ボタン押下
    await page.getByRole("link", { name: "予約する" }).click();

    // ログインしていない為callbackUrlを維持しながらログイン画面へ遷移される
    await expect(page).toHaveURL(
      "http://localhost:3000/login?callbackUrl=/event/104/reservation",
    );
    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();

    // ログイン
    await page.getByLabel("メールアドレス").fill("user@example.com");
    await page.getByLabel("パスワード").fill("password");
    await page.getByRole("button", { name: "ログイン" }).click();

    //ログイン後イベント一覧へ遷移
    await expect(page).toHaveURL("http://localhost:3000/event/104/reservation");
    await expect(page.getByText("ようこそ、テストユーザーさん")).toBeVisible();
  });

  test("ご連絡先が未入力/支払方法が未選択の場合エラーメッセージが表示されること", async ({
    page,
  }) => {
    // 何も入力しないでそのまま「確認画面へ」ボタン押下
    await page.getByRole("button", { name: "確認画面へ" }).click();

    // バリデーションメッセージを表示
    await expect(page.getByText("電話番号を入力してください")).toBeVisible();
    await expect(page.getByText("支払方法を選択してください")).toBeVisible();

    // 遷移しない
    await expect(page).toHaveURL("http://localhost:3000/event/104/reservation");
  });

  test("参加人数にあわせて合計金額が正しく計算されること", async ({ page }) => {
    // 金額¥1,865 × 参加人数3 = ¥5,595
    await expect(page.getByText("¥1,865").first()).toBeVisible();
    await page.getByRole("spinbutton", { name: "参加人数" }).fill("3");
    await expect(page.getByText("¥5,595")).toBeVisible();
  });

  //   ☆のちに修正
  //   test("同じイベントを二重予約できないこと", async ({ page }) => {});
});
