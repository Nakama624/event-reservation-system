<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * ログインできる
     */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'user',
            'token',
        ]);
    }

    /**
     * ログイン失敗できる
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        // ログインに失敗すると422で返される
        $response->assertStatus(422);
    }

    /**
     * 会員登録できる
     */
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'テストユーザー',
            'email' => 'register@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'email' => 'register@example.com',
        ]);
    }

    /**
     * 認証済みユーザー情報を取得できる
     */
    public function test_authenticated_user_can_get_user_information()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/user');

        $response->assertStatus(200);

        $response->assertJson([
            'id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * ログアウトできる
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . $token
        )->postJson('/api/logout');

        $response->assertStatus(200);
    }

    /**
     * 未ログインでは /api/user にアクセスできない
     */
    public function test_guest_cannot_access_user_information()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}