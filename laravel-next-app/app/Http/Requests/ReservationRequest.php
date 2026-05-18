<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
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
            'payment_method_id' => 'required',

            'contact_number' => [
                'required',
                'regex:/^0\d{1,4}-?\d{1,4}-?\d{4}$/',
            ],
        ];
    }

    public function messages()
    {
        return [
            'payment_method_id.required' => '支払方法を選択してください',

            'contact_number.required' => '電話番号を入力してください',

            'contact_number.regex' => '電話番号の形式が正しくありません',
        ];
    }
}
