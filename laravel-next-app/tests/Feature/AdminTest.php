<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Event;
use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('contact_statuses')->insert([
            'id' => 1,
            'status' => '未対応',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->admin = User::factory()->create([
            'email_verified_at' => now(),
            'is_manager' => true,
        ]);

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
            'is_manager' => false,
        ]);
    }

    // 管理者は予約が入ってる予約一覧を取得できる
    public function test_admin_can_get_admin_event_list()
    {
        $event = Event::factory()->create([
            'title' => '管理者用イベント',
            'instructor_name' => '管理者用講師',
        ]);

        $schedule = Schedule::factory()->create([
            'event_id' => $event->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);

        Reservation::factory()->create([
            'schedule_id' => $schedule->id,
            'user_id' => $this->user->id,
            'participants' => 1,
            'payment_status' => '未払い',
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/event/list');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'event_title' => '管理者用イベント',
        ]);
    }
    // 管理者はイベント詳細・予約者一覧を取得できる
    public function test_admin_can_get_event_detail_and_reservation_list()
    {
        $event = Event::factory()->create([
            'title' => 'イベント詳細',
        ]);

        $schedule = Schedule::factory()->create([
            'event_id' => $event->id,
        ]);

        Reservation::factory()->create([
            'user_id' => $this->user->id,
            'schedule_id' => $schedule->id,
            'participants' => 2,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/admin/event/{$schedule->id}");

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => 'イベント詳細',
        ]);

        $response->assertJsonFragment([
            'participants' => 2,
        ]);
    }

    // 管理者は予約を入金済みにできる
    public function test_admin_can_update_reservation_payment_status_to_paid()
    {
        $event = Event::factory()->create();
        $schedule = Schedule::factory()->create([
            'event_id' => $event->id,
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $this->user->id,
            'schedule_id' => $schedule->id,
            'payment_status' => '未払い',
        ]);

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/admin/event/{$reservation->id}/paid");

        $response->assertStatus(200);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'payment_status' => '支払済み',
        ]);
    }

    // 管理者はお問い合わせ一覧を取得できる
    public function test_admin_can_get_contact_list()
    {
        Contact::factory()->create([
            'user_id' => $this->user->id,
            'status_id' => 1,
            'title' => '管理者確認用お問い合わせ',
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/contact/list');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => '管理者確認用お問い合わせ',
        ]);
    }

    // 管理者はお問い合わせ詳細を取得できる
    public function test_admin_can_get_contact_detail()
    {
        $contact = Contact::factory()->create([
            'user_id' => $this->user->id,
            'status_id' => 1,
            'title' => 'お問い合わせ詳細',
            'detail' => '詳細内容です。',
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/admin/contact/{$contact->id}");

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => 'お問い合わせ詳細',
            'detail' => '詳細内容です。',
        ]);
    }

    // 一般ユーザーは管理者APIにアクセスできない
    public function test_normal_user_cannot_access_admin_api()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/admin/event/list');

        $response->assertStatus(403);
    }

    // 未ログインでは管理者APIにアクセスできない
    public function test_guest_cannot_access_admin_api()
    {
        $response = $this->getJson('/api/admin/event/list');

        $response->assertStatus(401);
    }
}