import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("イベント一覧", () => {
    test.beforeEach(async ({ page }) => {
        // 各テストの前にログインページにアクセスする
        await page.goto("http://localhost:3000/login");

        // ログイン
        await page.getByLabel("メールアドレス").fill("user@example.com");
        await page.getByLabel("パスワード").fill("password");
        await page.getByRole("button", { name: "ログイン" }).click();

        // 予約一覧ページへ遷移
        await expect(page).toHaveURL("http://localhost:3000/reservation/list");
        await expect(
            page.getByText("ようこそ、テストユーザーさん"),
        ).toBeVisible();
    });

    test("自分の予約一覧を確認できること", async ({ page }) => {
        // 予約行を取得
        const reservationRow = page.locator("tr").filter({
            hasText: "2026/06/18 17:00",
        });

        // 行の中身確認
        await expect(reservationRow).toContainText("みんなでダンス！");
        await expect(reservationRow).toContainText("Kana");
        await expect(reservationRow).toContainText("3");
    });

    test("キャンセル済み予約が表示されること", async ({ page }) => {
        // 予約キャンセル行を取得
        const reservationRow = page.locator("tr").filter({
            hasText: "2026/06/10 17:00",
        });

        // 行の中身確認
        await expect(reservationRow).toContainText("英語が好きになる教室");
        await expect(reservationRow).toContainText(
            "Rachel Oliver(レイチェル オリバー)",
        );
        await expect(reservationRow).toContainText("3");
        await expect(reservationRow).toContainText("未払い");
        await expect(reservationRow).toContainText("キャンセル済み");
    });
});
