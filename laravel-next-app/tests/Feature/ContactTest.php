<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\ContactStatus;
use App\Models\User;
use Database\Seeders\ContactStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ContactStatusSeeder::class);

        $this->assertDatabaseHas('contact_statuses', [
            'id' => 1,
        ]);

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
    }

    // ログインユーザーがお問い合わせを作成できる
    public function test_login_user_can_create_contact()
    {
        $response = $this->actingAs($this->user)->postJson('/api/contact/complete', [
            'title' => '予約について',
            'detail' => '予約内容を変更したいです。',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('contacts', [
            'user_id' => $this->user->id,
            'title' => '予約について',
            'detail' => '予約内容を変更したいです。',
        ]);
    }

    // 自分のお問い合わせ一覧を取得できる
    public function test_login_user_can_get_own_contact_list()
    {
        $otherUser = User::factory()->create();

        Contact::factory()->create([
            'user_id' => $this->user->id,
            'title' => '自分のお問い合わせ',
        ]);

        Contact::factory()->create([
            'user_id' => $otherUser->id,
            'title' => '他人のお問い合わせ',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/contact/list');

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => '自分のお問い合わせ',
        ]);

        $response->assertJsonMissing([
            'title' => '他人のお問い合わせ',
        ]);
    }

    // 自分のお問い合わせ詳細を取得できる
    public function test_login_user_can_get_own_contact_detail()
    {
        $contact = Contact::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'お問い合わせ詳細',
            'detail' => '詳細内容です。',
        ]);

        $response = $this->actingAs($this->user)->getJson("/api/contact/{$contact->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'title' => 'お問い合わせ詳細',
            'detail' => '詳細内容です。',
        ]);
    }

    // 他人のお問い合わせ詳細は見られない
    public function test_user_cannot_get_other_user_contact_detail()
    {
        $otherUser = User::factory()->create();

        $contact = Contact::factory()->create([
            'user_id' => $otherUser->id,
            'title' => '他人のお問い合わせ',
        ]);

        $response = $this->actingAs($this->user)->getJson("/api/contact/{$contact->id}");

        $response->assertStatus(404);
    }

    // お問い合わせを論理削除できる
    public function test_login_user_can_soft_delete_own_contact()
    {
        $contact = Contact::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/contact/{$contact->id}/delete");

        $response->assertStatus(200);

        $this->assertSoftDeleted('contacts', [
            'id' => $contact->id,
        ]);
    }

    // 未ログインではお問い合わせできない
    public function test_guest_cannot_create_contact()
    {
        $response = $this->postJson('/api/contact/complete', [
            'title' => '未ログインのお問い合わせ',
            'detail' => 'ログインしていません。',
        ]);

        $response->assertStatus(401);
    }
}