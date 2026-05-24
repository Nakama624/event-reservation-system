<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // ログインユーザー取得
        $user = $request->user();

        // 管理者でなければ403
        if (!$user || !$user->is_manager) {
            return response()->json([
                'message' => '管理者のみアクセス可能です'
            ], 403);
        }

        return $next($request);
    }
}