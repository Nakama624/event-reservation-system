<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'title' => '仕事でも使える、本物の英会話',
            'capacity' => 15,
            'lesson_img1' => 'english_lesson1.png',
            'lesson_img2' => 'english_lesson2.png',
            'lesson_img3' => '',
            'catch_copy' => '英語を勉強してきたのに、いざとなると話せない…そんな悩みを解決。実践的な会話中心のレッスンで、“使える英語力”をしっかり育てます。',
            'instructor_name' => 'Rachel Oliver(レイチェル オリバー)',
            'instructor_img' => 'english_profile.jpg',
            'instructor_profile' => 'アメリカ出身の英会話講師。明るく親しみやすいレッスンで、初心者から上級者まで幅広く指導。日常会話からビジネス英語まで、実践的に「使える英語力」を楽しく身につけられる指導を得意としています。',
            'price' => '1500',
        ]);

        Event::create([
            'title' => '英語が好きになる教室',
            'capacity' => 10,
            'lesson_img1' => 'english_lesson_kids1.png',
            'lesson_img2' => 'english_lesson_kids2.png',
            'lesson_img3' => '',
            'catch_copy' => '“できた！”の積み重ねが自信につながる。楽しく学びながら、英語がどんどん好きになる教室です。',
            'instructor_name' => 'Rachel Oliver(レイチェル オリバー)',
            'instructor_img' => 'english_profile.jpg',
            'instructor_profile' => '子ども向け英会話レッスンを得意とする講師。歌やゲームを取り入れた楽しいレッスンで、英語が初めてのお子さまでも安心して学べます。一人ひとりのペースに寄り添いながら、「英語が好き！」という気持ちを育てる指導を大切にしています。',
            'price' => '1000',
        ]);

        Event::create([
            'title' => 'みんなでダンス！',
            'capacity' => 8,
            'lesson_img1' => 'dance1.png',
            'lesson_img2' => 'dance2.png',
            'lesson_img3' => 'dance3.png',
            'catch_copy' => '未経験からでも大丈夫。音楽に合わせて体を動かす楽しさを、基礎からしっかり学べるレッスンです。',
            'instructor_name' => 'Kana',
            'instructor_img' => 'dance_profile.png',
            'instructor_profile' => 'ストリートダンスを中心に活動するインストラクター。初心者にもわかりやすい丁寧な指導と、明るく楽しいレッスンが魅力。基礎からしっかり学びながら、一人ひとりのペースに合わせて「踊る楽しさ」と「表現する力」を引き出します。',
            'price' => '1200',
        ]);

        Event::create([
            'title' => 'ヨガ教室',
            'capacity' => 5,
            'lesson_img1' => 'yoga.png',
            'lesson_img2' => null,
            'lesson_img3' => null,
            'catch_copy' => '忙しい毎日の中で、少しだけ自分のための時間を。呼吸とともに心と体を整え、内側からリラックスできるヨガレッスンです。',
            'instructor_name' => '佐藤 美穂',
            'instructor_img' => null,
            'instructor_profile' => null,
            'price' => '1400',
        ]);

        Event::factory()->count(100)->create();

    }
}
