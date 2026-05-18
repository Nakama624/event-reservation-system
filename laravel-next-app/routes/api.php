<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\StripeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 認証不要のルート
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// カレンダー一覧
Route::get('/calendar', [CalendarController::class, 'calendar']);
// イベント一覧
Route::get('/event/list', [EventController::class, 'eventList']);
// 過去のイベント一覧
Route::get('/past-event/list', [EventController::class, 'pastEventIndex']);
// イベント詳細
Route::get('/event/{schedule_id}', [EventController::class, 'eventDetail']);

// メール認証画面へ
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail'])
    ->middleware(['auth:sanctum', 'throttle:6,1']);

// 認証済みユーザーのみアクセス可能なルート
Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    // 管理者
    // イベント一覧（すべて表示）
    Route::get('/admin/event/list', [AdminController::class, 'adminEventList']);
    Route::get('/admin/event/{schedule_id}', [AdminController::class, 'adminEventDetail']);
    // 支払ステータスを支払済みへ
    Route::post('/admin/event/{reservation_id}/paid', [AdminController::class, 'adminReservationPaid']);
    // お問合せ
    Route::get('/admin/contact/list', [AdminController::class, 'adminContactList']);
    Route::get('/admin/contact/{contact_id}', [AdminController::class, 'adminContactDetail']);

    // 予約一覧へ
    Route::get('/reservation/list', [ReservationController::class, 'reservationList']);
    // 予約入力へ
    Route::get('/event/{schedule_id}/reservation', [ReservationController::class, 'reserveIndex']);
    // 予約確認(入力値は検索と同じようにパラメータで保持するためGet)
    Route::post('/event/{schedule_id}/reservation/confirm', [ReservationController::class, 'confirm']);
    // Stripe決済
    Route::post('/event/{schedule_id}/reservation/stripe', [StripeController::class, 'checkout']);
    Route::post('/reservation/payment-success', [StripeController::class, 'paymentSuccess']);
    // 予約完了
    Route::post('/event/{schedule_id}/reservation/complete', [ReservationController::class, 'complete']);
    // 予約キャンセル
    Route::patch('/reservation/{reservation_id}/canceled', [ReservationController::class, 'canceled']);
    // 予約詳細
    Route::get('/reservation/{reservation_id}', [ReservationController::class, 'detail']);

    // お問合せ　新規作成・一覧・詳細
    Route::get('/contact', [ContactController::class, 'contact']);
    Route::get('/contact/list', [ContactController::class, 'contactList']);
    Route::get('/contact/{contact_id}', [ContactController::class, 'contactDetail']);
    // 確認
    Route::post('/contact/confirm', [ContactController::class, 'confirm']);
    // お問い合わせ完了
    Route::post('/contact/complete', [ContactController::class, 'complete']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});
