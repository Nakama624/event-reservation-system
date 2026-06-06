# Reservation-Management-System

## はじめに

### 開発目的

イベント予約・決済・管理機能を備えた予約管理システムを開発しました。
Next.js と Laravel を用いたフロントエンド・バックエンド分離構成を採用し、
REST API連携、認証機能、Stripe決済、MailPit認証など、
実務を意識したWebアプリケーション開発を目的として制作しました。

## 環境構築

### Dockerビルド

- `git clone git@github.com:Nakama624/event-reservation-system.git`
- `cd event-reservation-system/laravel-next-app`
- `docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$(pwd):/var/www/html" \
  -w /var/www/html \
  -e COMPOSER_CACHE_DIR=/tmp/composer_cache \
  laravelsail/php84-composer:latest \
  composer install`

- `./vendor/bin/sail up -d`

### バックエンド(laravel-next-app)

- `./vendor/bin/sail composer install`
- `cp .env.example .env`、環境変数を変更(DB_PASSWORDとSTRIPE_SECRETをセット)
- `./vendor/bin/sail artisan key:generate`
- `./vendor/bin/sail artisan migrate`
- `./vendor/bin/sail artisan db:seed`
- `/vendor/bin/sail artisan storage:link`

### フロントエンド(next-frontend-app)

- `cd ../next-frontend-app/`
- `npm install`
- `cp .env.example .env.local`、環境変数を変更（NEXTAUTH_SECRETにランダムな文字列をセット）
- `npm run dev`

### mailhog

http://localhost:8025/

> `.env` ファイルを以下のように修正。
>
> ```diff
> -　MAIL_FROM_ADDRESS=null
> +　MAIL_FROM_ADDRESS=no-reply@example.com
> ```

### stripe決済

公式テスト詳細

- https://docs.stripe.com/testing

> stripe決済のアカウントを作成し、`.env` ファイルに以下のように追加。
> https://dashboard.stripe.com/login?locale=ja-JP
>
> ```diff
> +　STRIPE_SECRET=（stripe決済各ユーザーアカウントのシークレットキー）
> +　APP_URL=http://localhost
> ```

#### 実行テスト/クレジットカード（VISA/成功）

- メールアドレス：任意のアドレス
- カード番号(VISA)：4242424242424242
- MM/YY：（任意の将来の日付）
- セキュリティコード：（任意の 3 桁の数字）
- 名前：任意の名前

## URL

- ログイン：http://localhost:3000/login
- phpMyAdmin：http://localhost:8080/
- MailPit：http://localhost:8025/

## 単体テスト

### DBを作成

- `cd laravel-next-app`
- `./vendor/bin/sail exec mysql bash`
- `mysql -u root -p`、パスワード入力
- `CREATE DATABASE demo_test;`
- `exit`

### .env.testingを作成

- `./vendor/bin/sail exec mysql bash`
- `cp .env .env.testing`、環境変数を変更
- `./vendor/bin/sail artisan key:generate --env=testing`
- `./vendor/bin/sail artisan migrate --env=testing`

### Laravel/Unitテスト実行

- `cd laravel-next-app`
  `sail artisan test`

- 1.ログイン機能
  | ファイル名 | テスト内容 |
  | ----------------------- | --------------------------------------------------------- |
  | `Feature/LoginTest.php` | ログインできる 　　　 |
  | | ログイン失敗できる |
  | | 会員登録できる 　　　　　　　　　　　　　　　　　　　　　 |
  | | 認証済みユーザー情報を取得できる 　　　　　 |
  | | ログアウトできる 　　　　　　　　　　 |
  | | 未ログインでは /api/user にアクセスできない |

- 2.予約機能
  | ファイル名 | テスト内容 |
  | ----------------------------- | ------------------------------------------------------------------------- |
  | `Feature/ReservationTest.php` | ログインユーザーが予約できる 　　　 |
  | | 同じユーザーが同じイベントを二重予約できない |
  | | 残席数を超えて予約できない 　　　　　　　　　　　　　　　　　　　　　 |
  | | 自分の予約をキャンセルできる 　　　　　 |
  | | 自分の予約だけ取得できる 　　　　　　　　　　 |
  | | 他人の予約をキャンセルできない 　　　　　　　　　　　　　　　　　　　　　 |

- 3.イベント閲覧機能
  | ファイル名 | テスト内容 |
  | ----------------------- | ------------------------------------------------------------------------ |
  | `Feature/EventTest.php` | イベント一覧を取得できる 　　　 |
  | | 過去イベント一覧を取得できる |
  | | イベント詳細を取得できる 　　　　　　　　　　　　　　　　　　　　　 |
  | | キーワード検索でイベントを絞り込める 　　　　　　　　　　 |
  | | 日付検索でイベントを絞り込める　　　　　　　　　　　　　　　　　　　　　 |

- 4.お問合せ機能
  | ファイル名 | テスト内容 |
  | ------------------------- | ----------------------------------------------------------------------------- |
  | `Feature/ContactTest.php` | ログインユーザーがお問い合わせを作成できる 　　　 |
  | | 自分のお問い合わせ一覧を取得できる |
  | | 自分のお問い合わせ詳細を取得できる 　　　　　　　　　　　　　　　　　　　　　 |
  | | 他人のお問い合わせ詳細は見られない 　　　　　　　　　　 |
  | | お問い合わせを論理削除できる |
  | | 未ログインではお問い合わせできない |

- 5.管理者機能
  | ファイル名 | テスト内容 |
  | ----------------------- | ------------------------------------------------------------------------- |
  | `Feature/AdminTest.php` | 管理者は管理者用イベント一覧を取得できる 　　　 |
  | | 管理者はイベント詳細・予約者一覧を取得できる |
  | | 管理者は予約を入金済みにできる 　　　　　　　　　　　　　　　　　　　　　 |
  | | 管理者はお問い合わせ一覧を取得できる 　　　　　　　　　　 |
  | | 管理者はお問い合わせ詳細を取得できる |
  | | 一般ユーザーは管理者APIにアクセスできない |
  | | 未ログインでは管理者APIにアクセスできない |

### playwrightテスト実行

`cd next-frontend-app`
`npx playwright test`

- 認証系テスト

| ファイル名                 | テスト内容                                                         |
| -------------------------- | ------------------------------------------------------------------ |
| `auth/admin-login.spec.ts` | 正しい認証情報でログインできること                                 |
|                            | 間違った認証情報ではログインできないこと                           |
|                            | 未ログインで管理画面にアクセスするとログイン画面へ戻されること     |
| `auth/login.spec.ts`       | 正しい認証情報でログインできること                                 |
|                            | 間違った認証情報ではログインできないこと                           |
|                            | 未ログインで予約一覧画面にアクセスするとログイン画面へ戻されること |

---

- お問い合わせ機能テスト

| ファイル名                      | テスト内容                                               |
| ------------------------------- | -------------------------------------------------------- |
| `contact/admin-contact.spec.ts` | お問合せが一覧表示されていること                         |
|                                 | お問合せ内容（詳細）が表示されていること                 |
| `contact/contact-list.spec.ts`  | お問合せが一覧表示されていること                         |
|                                 | お問合せ一覧に自分が投稿したお問合せが表示されていること |

---

- お問い合わせ機能テスト

| ファイル名                      | テスト内容                                               |
| ------------------------------- | -------------------------------------------------------- |
| `contact/admin-contact.spec.ts` | お問合せが一覧表示されていること                         |
|                                 | お問合せ内容（詳細）が表示されていること                 |
| `contact/contact-list.spec.ts`  | お問合せが一覧表示されていること                         |
|                                 | お問合せ一覧に自分が投稿したお問合せが表示されていること |
| `contact/contact.spec.ts`       | お問合せ一覧から新規作成画面に遷移することができる       |
|                                 | 詳細が未入力の場合エラーメッセージが表示されること       |

---

- イベント閲覧機能テスト

| ファイル名                             | テスト内容                                                     |
| -------------------------------------- | -------------------------------------------------------------- |
| `event/admin-reservation-list.spec.ts` | 全ユーザー予約がイベント毎に一覧表示されている                 |
|                                        | お問合せ内容（詳細）が表示されていること                       |
| `event/event-list.spec.ts`             | イベント一覧が表示されること                                   |
|                                        | 講師名で検索すると部分一致で検索結果のみが表示されること       |
|                                        | 日付で検索すると開催日付が一致する検索結果のみが表示されること |

---

- イベント予約機能テスト

| ファイル名                             | テスト内容                                             |
| -------------------------------------- | ------------------------------------------------------ |
| `reservation/reservation-list.spec.ts` | 自分の予約一覧を確認できること                         |
|                                        | キャンセル済み予約が表示されること                     |
| `reservation/reservation.spec.ts`      | 支払方法が未選択の場合エラーメッセージが表示されること |
|                                        | 参加人数にあわせて合計金額が正しく計算されること       |
|                                        | 同じイベントを二重予約できないこと                     |

## 使用技術

### フロントエンド

- Next.js：next@16.2.6
- React：react@19.2.4
- TypeScript：Version 5.9.3
- Tailwind CSS：tailwindcss@4.3.0

### バックエンド

- PHP：PHP 8.4.13
- Laravel：Laravel Framework 13.9.0
- Laravel Sanctum： \* v4.3.2

### データベース

- MySQL：mysql Ver 8.4.9 for Linux on x86_64

### テスト

- Vitest：vitest/4.1.7
- Playwright：Version 1.60.0

### その他

- Git：git version 2.43.0
- stripe決済
- MailPit
- ES Lint

## 画面遷移図

![alt text](readme_images/screen_transition.png)

## 画面一覧・機能一覧

### 認証について

| 区分       | 説明                         |
| ---------- | ---------------------------- |
| 認証なし   | ログイン不要で利用可能       |
| 認証あり   | ログインユーザーのみ利用可能 |
| 管理者限定 | 管理者ユーザーのみ利用可能   |

---

## 一般ユーザー向け画面

### 1. ログイン画面

| 項目             | 内容                     |
| ---------------- | ------------------------ |
| URL              | `/login`                 |
| 認証             | なし                     |
| 想定利用ユーザー | 一般ユーザー / 管理者    |
| 機能             | ログイン認証             |
|                  | 入力バリデーション       |
|                  | ログイン成功時の画面遷移 |

## ![alt text](readme_images/Login.png)

### 2. 新規会員登録画面

| 項目             | 内容               |
| ---------------- | ------------------ |
| URL              | `/register`        |
| 認証             | なし               |
| 想定利用ユーザー | 一般ユーザー       |
| 機能             | 新規ユーザー登録   |
|                  | 入力バリデーション |
|                  | アカウント作成     |

![alt text](readme_images/Registar.png)

---

### 3. メール認証画面

| 項目             | 内容                        |
| ---------------- | --------------------------- |
| URL              | `/email/verify/{id}/{hash}` |
| 認証             | なし                        |
| 想定利用ユーザー | 一般ユーザー                |
| 機能             | mailpitへ遷移               |
|                  | メール再送槙                |

![alt text](readme_images/Mail.png)

---

### 4. イベント一覧画面

| 項目             | 内容                               |
| ---------------- | ---------------------------------- |
| URL              | `/event/list`                      |
| 認証             | なし                               |
| 想定利用ユーザー | 一般ユーザー / 管理者              |
| 機能             | イベント一覧表示                   |
|                  | ページネーション                   |
|                  | キーワード検索(講師名、イベント名) |
|                  | 開催日付検索                       |

![alt text](readme_images/EventList.png)

---

### 5. 過去のイベント一覧画面

| 項目             | 内容                               |
| ---------------- | ---------------------------------- |
| URL              | `/past-event/list`                 |
| 認証             | なし                               |
| 想定利用ユーザー | 一般ユーザー / 管理者              |
| 機能             | イベント一覧表示                   |
|                  | ページネーション                   |
|                  | キーワード検索(講師名、イベント名) |
|                  | 開催日付検索                       |

![alt text](readme_images/PastEventList.png)

---

### 6. イベント詳細画面

| 項目             | 内容                  |
| ---------------- | --------------------- |
| URL              | `/event/[id]`         |
| 認証             | なし                  |
| 想定利用ユーザー | 一般ユーザー / 管理者 |
| 機能             | イベント詳細表示      |
|                  | 開催日時表示          |
|                  | 定員表示              |
|                  | 予約画面への導線      |

![alt text](readme_images/EventDetail.png)

---

### 7. イベントカレンダー画面

| 項目             | 内容                     |
| ---------------- | ------------------------ |
| URL              | `/calendar`              |
| 認証             | なし                     |
| 想定利用ユーザー | 一般ユーザー / 管理者    |
| 機能             | イベント詳細表示         |
|                  | 開催日時表示             |
|                  | イベント詳細画面への導線 |

![alt text](readme_images/EventCarendar.png)

---

### 8. 予約入力画面

| 項目             | 内容                      |
| ---------------- | ------------------------- |
| URL              | `/event/{id}/reservation` |
| 認証             | あり                      |
| 想定利用ユーザー | 一般ユーザー              |
| 機能             | 人数入力                  |
|                  | 決済方法選択              |

![alt text](readme_images/Reservation.png)

---

### 9. 予約確認画面

| 項目             | 内容                              |
| ---------------- | --------------------------------- |
| URL              | `/event/[id]/reservation/confirm` |
| 認証             | あり                              |
| 想定利用ユーザー | 一般ユーザー                      |
| 機能             | 予約内容確認                      |
|                  | 二重送信防止                      |

![alt text](readme_images/Reservation_Confirm.png)

### 10. Stripe決済画面(外部画面)

| 項目             | 内容                 |
| ---------------- | -------------------- |
| URL              | Stripe Checkout      |
| 認証             | あり                 |
| 想定利用ユーザー | 一般ユーザー         |
| 機能             | クレジットカード決済 |
|                  | 決済実行             |
|                  | 決済完了画面への遷移 |

---

### 11. 予約完了画面

| 項目             | 内容                                      |
| ---------------- | ----------------------------------------- |
| URL              | `/event/[id]/reservation/payment-success` |
| 認証             | あり                                      |
| 想定利用ユーザー | 一般ユーザー                              |
| 機能             | 予約完了メッセージ表示                    |

## ![alt text](readme_images/Reservation_Complete.png)

### 12. 予約一覧画面（各個人）

| 項目             | 内容                               |
| ---------------- | ---------------------------------- |
| URL              | `/reservation/list`                |
| 認証             | あり                               |
| 想定利用ユーザー | 一般ユーザー                       |
| 機能             | 自分の予約一覧表示                 |
|                  | 予約キャンセル                     |
|                  | キーワード検索(講師名、イベント名) |
|                  | 開催日付検索                       |

## ![alt text](readme_images/ReservationList.png)

---

### 13. 予約詳細画面

| 項目             | 内容                |
| ---------------- | ------------------- |
| URL              | `/reservation/{id}` |
| 認証             | あり                |
| 想定利用ユーザー | 一般ユーザー        |
| 機能             | 予約情報確認        |

---

### 14. お問合せ一覧画面

| 項目             | 内容               |
| ---------------- | ------------------ |
| URL              | `/contact/list`    |
| 認証             | あり               |
| 想定利用ユーザー | 一般ユーザー       |
| 機能             | お問合せ一覧表示   |
|                  | お問合せ削除(論理) |

## ![alt text](readme_images/ContactList.png)

---

### 15. お問合せ新規画面

| 項目             | 内容               |
| ---------------- | ------------------ |
| URL              | `/contact`         |
| 認証             | なし               |
| 想定利用ユーザー | 一般ユーザー       |
| 機能             | お問合せ入力       |
|                  | 入力バリデーション |

## ![alt text](readme_images/Contact_Create.png)

---

### 16. お問合せ確認画面

| 項目             | 内容               |
| ---------------- | ------------------ |
| URL              | `/contact/confirm` |
| 認証             | なし               |
| 想定利用ユーザー | 一般ユーザー       |
| 機能             | お問合せ内容確認   |
|                  | お問合せ送信       |

## ![alt text](readme_images/Contact_Confirm.png)

---

### 17. お問合せ完了画面

| 項目             | 内容                       |
| ---------------- | -------------------------- |
| URL              | `/contact/complete`        |
| 認証             | あり                       |
| 想定利用ユーザー | 一般ユーザー               |
| 機能             | お問合せ完了メッセージ表示 |

## ![alt text](readme_images/Contact_Complete.png)

---

### 18. お問合せ詳細画面

| 項目             | 内容             |
| ---------------- | ---------------- |
| URL              | `/contact/[id]`  |
| 認証             | あり             |
| 想定利用ユーザー | 一般ユーザー     |
| 機能             | お問合せ内容表示 |

## ![alt text](readme_images/Contact_Detail.png)

## 管理者向け画面

### 19. 予約一覧管理画面

| 項目             | 内容                |
| ---------------- | ------------------- |
| URL              | `/admin/event/list` |
| 認証             | 管理者限定          |
| 想定利用ユーザー | 管理者              |
| 機能             | 全予約一覧表示      |
|                  | 予約状況確認        |
|                  | 参加人数確認        |

## ![alt text](readme_images/admin_reservationList.png)

---

### 20. 予約詳細管理画面

| 項目             | 内容                |
| ---------------- | ------------------- |
| URL              | `/admin/event/[id]` |
| 認証             | 管理者限定          |
| 想定利用ユーザー | 管理者              |
| 機能             | 全予約一覧表示      |
|                  | 予約状況確認        |
|                  | 参加人数確認        |
|                  | 決済ステータス変更  |

## ![alt text](readme_images/Admin_ReservationDetail.png)

---

### 21. お問合せ一覧画面

| 項目             | 内容                  |
| ---------------- | --------------------- |
| URL              | `/admin/contact/list` |
| 認証             | 管理者限定            |
| 想定利用ユーザー | 管理者                |
| 機能             | お問合せ一覧表示      |

## ![alt text](readme_images/Admin_ContactList.png)

---

### 22. お問合せ詳細画面

| 項目             | 内容                  |
| ---------------- | --------------------- |
| URL              | `/admin/contact/[id]` |
| 認証             | 管理者限定            |
| 想定利用ユーザー | 管理者                |
| 機能             | お問合せ詳細確認      |

## ![alt text](readme_images/Admin_ContactDetail.png)

## ER図

![alt text](readme_images/image.png)

## テーブル仕様

### users テーブル

| カラム名          | 型           | primary key | unique key | not null | foreign key |
| ----------------- | ------------ | ----------- | ---------- | -------- | ----------- |
| id                | bigint       | ◯           |            | ◯        |             |
| name              | varchar(255) |             |            | ◯        |             |
| email             | varchar(255) |             | ◯          | ◯        |             |
| password          | varchar(255) |             |            | ◯        |             |
| is_manager        | tinyint(1)   |             |            |          |             |
| email_verified_at | timestamp    |             |            |          |             |
| remenber_token    | VARCHAR(100) |             |            |          |             |
| created_at        | timestamp    |             |            |          |             |
| updated_at        | timestamp    |             |            |          |             |

---

### events テーブル

| カラム名           | 型           | primary key | unique key | not null | foreign key |
| ------------------ | ------------ | ----------- | ---------- | -------- | ----------- |
| id                 | bigint       | ◯           |            | ◯        |             |
| title              | varchar(255) |             |            | ◯        |             |
| capacity           | bigint       |             |            | ◯        |             |
| lesson_img1        | varchar(255) |             |            | ◯        |             |
| lesson_img2        | varchar(255) |             |            |          |             |
| lesson_img3        | varchar(255) |             |            |          |             |
| catch_copy         | varchar(255) |             |            | ◯        |             |
| instructor_name    | varchar(255) |             |            | ◯        |             |
| instructor_img     | varchar(255) |             |            |          |             |
| instructor_profile | text         |             |            |          |             |
| price              | unsigned int |             |            | ◯        |             |
| created_at         | timestamp    |             |            |          |             |
| updated_at         | timestamp    |             |            |          |             |

---

### schedulesテーブル

| カラム名   | 型        | primary key | unique key | not null | foreign key |
| ---------- | --------- | ----------- | ---------- | -------- | ----------- |
| id         | bigint    | ◯           |            | ◯        |             |
| event_id   | bigint    |             |            | ◯        | event(id)   |
| start_at   | datetime  |             |            | ◯        |             |
| finish_at  | datetime  |             |            | ◯        |             |
| created_at | timestamp |             |            |          |             |
| updated_at | timestamp |             |            |          |             |

---

### reservationsテーブル

| カラム名           | 型           | primary key | unique key | not null | foreign key         |
| ------------------ | ------------ | ----------- | ---------- | -------- | ------------------- |
| id                 | bigint       | ◯           |            | ◯        |                     |
| user_id            | bigint       |             |            | ◯        | user(id)            |
| schedule_id        | bigint       |             |            | ◯        | schedule(id)        |
| contact_number     | varchar(255) |             |            | ◯        |                     |
| participants       | unsigned int |             |            | ◯        |                     |
| amount             | unsigned int |             |            | ◯        |                     |
| payment_status     | varchar(255) |             |            | ◯        |                     |
| payment_methods_id | bigint       |             |            | ◯        | payment_methods(id) |
| payment_updated_by | bigint       |             |            |          | user(id)            |
| paid_at            | datetime     |             |            |          |                     |
| is_canceled        | tinyint(1)   |             |            |          |                     |
| created_at         | timestamp    |             |            |          |                     |
| updated_at         | timestamp    |             |            |          |                     |

---

### contactsテーブル

| カラム名   | 型           | primary key | unique key | not null | foreign key        |
| ---------- | ------------ | ----------- | ---------- | -------- | ------------------ |
| id         | bigint       | ◯           |            | ◯        |                    |
| title      | varchar(255) |             |            | ◯        |                    |
| detail     | text         |             |            | ◯        |                    |
| img        | varchar(255) |             |            |          |                    |
| status_id  | bigint       |             |            | ◯        | contact_status(id) |
| created_at | timestamp    |             |            |          |                    |
| updated_at | timestamp    |             |            |          |                    |

---

### payment_methodsテーブル

| カラム名       | 型           | primary key | unique key | not null | foreign key |
| -------------- | ------------ | ----------- | ---------- | -------- | ----------- |
| id             | bigint       | ◯           |            | ◯        |             |
| payment_method | varchar(255) |             |            | ◯        |             |
| created_at     | timestamp    |             |            |          |             |
| updated_at     | timestamp    |             |            |          |             |

---

### contact_statusesテーブル

| カラム名   | 型           | primary key | unique key | not null | foreign key |
| ---------- | ------------ | ----------- | ---------- | -------- | ----------- |
| id         | bigint       | ◯           |            | ◯        |             |
| status     | varchar(255) |             |            | ◯        |             |
| created_at | timestamp    |             |            |          |             |
| updated_at | timestamp    |             |            |          |             |
