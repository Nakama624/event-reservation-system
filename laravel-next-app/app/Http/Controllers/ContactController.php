<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function contact(): JsonResponse
    {

        return response()->json();
    }

    public function contactList(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $contacts = Contact::where('user_id', $user->id)
            ->with('contactStatus')
            ->latest()
            ->get()
            ->map(function ($contact) use ($user) {
                return [
                    'id' => $contact->id,
                    'user_id' => $user->id,
                    'title' => $contact->title,
                    'status' => $contact->contactStatus->status,
                    'created_at' => $contact->created_at->format('Y-m-d H:i'),
                ];
            });

        return response()->json($contacts);
    }

    public function contactDetail($id)
    {
        $contact = Contact::with('contactStatus')
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json($contact);
    }

    public function confirm(ContactRequest $request)
    {
        $contact = $request->only([
            'title',
            'detail',
        ]);
        // 画像を先に保存
        if ($request->hasFile('img')) {
            $contact['img'] = $request->file('img')->store('contacts', 'public');
        }

        return response()->json($contact);
    }

    public function complete(Request $request)
    {
        $user = auth()->user();

        Contact::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'detail' => $request->detail,
            'img' => $request->img,
            'status_id' => 1,
        ]);

        return response()->json([
            'message' => 'お問合せを保存しました',
        ]);
    }
    public function delete($contact_id){

        $contact = Contact::findOrFail($contact_id);
        $contact->delete();

        return response()->json([
            'message' => '削除しました'
        ]);

    }
}
