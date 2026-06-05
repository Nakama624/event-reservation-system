<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\PaymentMethod;
use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\User;
use Database\Seeders\PaymentMethodSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Event $event;
    protected Schedule $schedule;
    protected PaymentMethod $paymentMethod;
    protected function setUp(): void
    {
        // 各テスト前にデータを作成
        parent::setUp();

        $this->seed(PaymentMethodSeeder::class);
        $this->paymentMethod = PaymentMethod::first();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->event = Event::factory()->create([
            'capacity' => 10,
        ]);

        $this->schedule = Schedule::factory()->create([
            'event_id' => $this->event->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);
    }


    /**
     * ログインユーザーが予約できる
     */
    public function test_authenticated_user_can_make_reservation()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/event/{$this->schedule->id}/reservation/complete", [
                'participants' => 2,
                'contact_number' => '09012345678',
                'payment_method_id' => 1,
            ]);

        $response->assertStatus(200);

        // DB上に作成されている
        $this->assertDatabaseHas('reservations', [
            'user_id' => $this->user->id,
            'schedule_id' => $this->schedule->id,
            'participants' => 2,
            'payment_method_id' => 1,
            'is_canceled' => false,
        ]);
    }
    /**
     * 同じユーザーが同じイベントを二重予約できない
     */
    public function test_user_cannot_make_duplicate_reservation()
    {
        Reservation::factory()->create([
            'user_id' => $this->user->id,
            'schedule_id' => $this->schedule->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/event/{$this->schedule->id}/reservation/complete", [
                'schedule_id' => $this->schedule->id,
                'participants' => 1,
            ]);

        $response->assertStatus(422);
    }

    /**
     * 残席数を超えて予約できない
     */
    public function test_user_cannot_reserve_when_capacity_is_full()
    {

        // 定員10人のイベントを予約する
        Reservation::factory()->create([
            'schedule_id' => $this->schedule->id,
            'participants' => 10,  //申込10人
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/event/{$this->schedule->id}/reservation/complete", [
                'schedule_id' => $this->schedule->id,
                'participants' => 1,
            ]);

        $response->assertStatus(422);
    }

    /**
     * 自分の予約をキャンセルできる
     */
    public function test_user_can_cancel_own_reservation()
    {

        $reservation = Reservation::factory()->create([
            'user_id' => $this->user->id,
            'schedule_id' => $this->schedule->id,
            'payment_method_id' => $this->paymentMethod->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->patchJson("/api/reservation/{$reservation->id}/canceled");

        $response->assertStatus(200);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'is_canceled' => true,  //キャンセルされている
        ]);
    }

    /**
     * 自分の予約だけ取得できる
     */
    public function test_user_can_view_own_reservations()
    {
        Reservation::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'schedule_id' => $this->schedule->id,
            'payment_method_id' => $this->paymentMethod->id,
        ]);

        Reservation::factory()->count(3)->create([
            'schedule_id' => $this->schedule->id,
            'payment_method_id' => $this->paymentMethod->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/reservation/list');

        $response->assertStatus(200);

        $reservations = $response->json();

        $this->assertCount(2, $reservations);
    }

    /**
     * 他人の予約をキャンセルできない
     */
    public function test_user_cannot_cancel_other_users_reservation()
    {
        $otherUser = User::factory()->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $otherUser->id,
            'schedule_id' => $this->schedule->id,
            'payment_method_id' => $this->paymentMethod->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->patchJson("/api/reservation/{$reservation->id}/canceled");

        $response->assertStatus(404);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'user_id' => $otherUser->id,
            'is_canceled' => false,
        ]);
    }
}