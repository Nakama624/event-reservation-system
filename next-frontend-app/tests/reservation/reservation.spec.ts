import { test, expect } from "@playwright/test";

// ＝＝＝一般ユーザーのみ＝＝＝
test.describe("イベント詳細/予約", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/event/list");

        await expect(page.locator("tbody tr").first()).toBeVisible();

        const targetRow = page
            .locator("tbody tr")
            .filter({ hasText: "楽しく学ぶ英語クラス" })
            .first();

        await expect(targetRow).toBeVisible();

        await targetRow.getByRole("link", { name: "詳細" }).click();

        await expect(page).toHaveURL(/\/event\/\d+$/);

        await page.getByRole("link", { name: "予約する" }).click();

        await expect(page).toHaveURL(
            /\/login\?callbackUrl=\/event\/\d+\/reservation/,
        );

        await expect(
            page.getByRole("heading", { name: "ログイン" }),
        ).toBeVisible();

        await page.getByLabel("メールアドレス").fill("user@example.com");
        await page.getByLabel("パスワード").fill("password");
        await page.getByRole("button", { name: "ログイン" }).click();

        await expect(page).toHaveURL(/\/event\/\d+\/reservation/);
        await expect(
            page.getByText("ようこそ、テストユーザーさん"),
        ).toBeVisible();
    });

    test("ご連絡先が未入力/支払方法が未選択の場合エラーメッセージが表示されること", async ({
        page,
    }) => {
        await expect(
            page.getByRole("button", { name: "確認画面へ" }),
        ).toBeVisible();
        // 何も入力しないでそのまま「確認画面へ」ボタン押下
        await page.getByRole("button", { name: "確認画面へ" }).click();

        // バリデーションメッセージを表示
        await expect(
            page.getByText("電話番号を入力してください"),
        ).toBeVisible();
        await expect(
            page.getByText("支払方法を選択してください"),
        ).toBeVisible();

        // 遷移しない
        await expect(page).toHaveURL(/\/event\/\d+\/reservation/);
    });

    test("参加人数にあわせて合計金額が正しく計算されること", async ({
        page,
    }) => {
        const totalPrice = page.locator("text=/¥[0-9,]+/").first();

        await expect(totalPrice).toBeVisible();

        const initialPriceText = await totalPrice.innerText();

        const initialPrice = Number(
            initialPriceText.replace("¥", "").replaceAll(",", ""),
        );

        await page.getByRole("spinbutton", { name: "参加人数" }).fill("3");

        const expectedPrice = initialPrice * 3;

        await expect(
            page.getByText(`¥${expectedPrice.toLocaleString()}`),
        ).toBeVisible();
    });
});
