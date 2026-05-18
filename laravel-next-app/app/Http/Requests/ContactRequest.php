<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'detail' => ['required', 'string', 'max:255'],
            'img' => [
                'image',
                'mimes:jpeg,png',
            ],
        ];
    }

    public function messages()
    {
        return [
            'title.required' => '件名を入力してください',
            'title.string' => '件名を文字列で入力してください',
            'title.max' => '件名を100文字以下で入力してください',
            'detail.required' => '詳細を入力してください',
            'detail.string' => '詳細を文字列で入力してください',
            'detail.max' => '詳細を255文字以下で入力してください',
            'img.image' => '拡張子はjpegまたはpngを選択してください',
            'img.mimes' => '拡張子はjpegまたはpngを選択してください',
        ];
    }
}
