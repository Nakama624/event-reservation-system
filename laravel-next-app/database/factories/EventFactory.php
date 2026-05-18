<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        $titles = [
            '初心者向け英会話教室',
            '親子で楽しむ英語レッスン',
            'はじめてのヨガ教室',
            'リラックスヨガ',
            'キッズダンス教室',
            '大人のダンスレッスン',
            'ビジネス英会話講座',
            '楽しく学ぶ英語クラス',
        ];

        $instructors = [
            '佐藤 美穂',
            '田中 健太',
            'Rachel Oliver',
            'Kana',
            '山田 花子',
        ];

        return [
            'title' => fake()->randomElement($titles),
            'capacity' => fake()->numberBetween(5, 20),
            'lesson_img1' => fake()->randomElement([
                'english_lesson1.png',
                'english_lesson_kids1.png',
                'dance1.png',
                'yoga.png',
            ]),
            'lesson_img2' => fake()->randomElement([
                'english_lesson2.png',
                'english_lesson_kids2.png',
                'dance2.png',
                null,
            ]),
            'lesson_img3' => fake()->randomElement([
                'dance3.png',
                null,
                '',
            ]),
            'catch_copy' => fake()->randomElement([
                '初心者でも安心して参加できる、楽しく学べるレッスンです。',
                '毎日の生活に役立つスキルを、楽しく身につけましょう。',
                '自分のペースで無理なく続けられる人気の教室です。',
                '基礎から丁寧に学べるので、初めての方にもおすすめです。',
            ]),
            'instructor_name' => fake()->randomElement($instructors),
            'instructor_img' => fake()->randomElement([
                'english_profile.jpg',
                'dance_profile.png',
                null,
            ]),
            'instructor_profile' => fake()->randomElement([
                '初心者にもわかりやすく丁寧に指導します。',
                '一人ひとりのペースに合わせたレッスンを大切にしています。',
                '楽しく学びながら、自然にスキルアップできる指導が特徴です。',
                null,
            ]),
            'price' => fake()->numberBetween(1000, 3000),
        ];
    }
}
