# راهنمای ساده کد Prototype آرتکی

این نسخه عمداً طوری مرتب شده است که بتوانی بفهمی هر فایل چه کاری انجام می‌دهد و اطلاعات نمونه را بدون جست‌وجو بین صدها خط تغییر بدهی.

## اول این نکته را به خاطر بسپار

تقسیم کار فایل‌ها به این شکل است:

| فایل                     | وظیفه              | چه زمانی آن را تغییر بدهم؟                   |
| ------------------------ | ------------------ | -------------------------------------------- |
| `data.js`                | تمام اطلاعات نمونه | تغییر نام، قد، وزن، زمان Event و متن Insight |
| `views.js`               | HTML صفحه‌ها       | تغییر ساختار یا محتوای یک صفحه               |
| `app.js`                 | عملکرد برنامه      | تغییر رفتار دکمه، ویدئو یا Modal             |
| `styles.css`             | ظاهر برنامه        | تغییر رنگ، اندازه، فاصله یا Responsive       |
| `index.html`             | قاب اصلی           | تغییر Sidebar، Topbar یا ترتیب فایل‌ها       |
| `assets/artaki-demo.mp4` | ویدئوی نمونه       | جایگزینی ویدئو                               |

## اجرای پروژه روی Mac

پوشه پروژه را در VS Code باز کن. سپس از منوی `Terminal > New Terminal` این دستور را اجرا کن:

```bash
python3 -m http.server 8000
```

بعد این آدرس را در مرورگر باز کن:

```text
http://localhost:8000
```

برای متوقف‌کردن برنامه در Terminal کلیدهای `Control + C` را بزن.

## مهم‌ترین فایل برای تو: data.js

بیشتر تغییرات محتوایی فقط در `data.js` انجام می‌شوند.

### تغییر نام مبارزان

این قسمت را پیدا کن:

```js
fighterA: {
  name: "Lena Hoffmann";
}
```

نام را تغییر بده، فایل را ذخیره کن و مرورگر را Refresh کن. نام جدید باید در Overview، Upload، Analysis و PDF Report دیده شود.

### تغییر مشخصات بدنی

```js
heightCm: 178,
weightKg: 63.5,
reachCm: 181,
stance: "Orthodox"
```

عددها را بدون `cm` و `kg` وارد کن؛ خود برنامه واحد را کنار آن‌ها نمایش می‌دهد.

### تغییر زمان یک Event

```js
{
  id: "a-jab-1",
  fighter: "A",
  technique: "Jab",
  time: 2.35,
  confidence: 91
}
```

`time: 2.35` یعنی Event در ثانیه ۲٫۳۵ ویدئو رخ می‌دهد. با تغییر همین مقدار، جای Marker روی Timeline و لینک Timestamp باهم تغییر می‌کنند.

### اضافه‌کردن یک Event

داخل آرایه `events` یک Object جدید اضافه کن:

```js
{
  id: "b-jab-2",
  fighter: "B",
  technique: "Jab",
  time: 20.5,
  confidence: 80
}
```

هر `id` باید منحصربه‌فرد باشد.

### تغییر Reaction DNA

قسمت `reactionPattern` را پیدا کن. زنجیره اصلی اینجاست:

```js
initialContext: "Center ring · Long range",
attack: "Lead jab",
response: "Step back",
followUp: "Low kick",
outcome: "1 landed · 2 attempts"
```

متن توضیحی الگو در `insight` نوشته شده است.

### تغییر سؤال Ask the Fight

سؤال‌ها در آرایه `questions` قرار دارند. هر سؤال شامل این موارد است:

```js
{
  id: "jab",
  question: "How does Fighter B respond after a jab?",
  title: "4 matching sequences found",
  statistic: "3 Step Backs · 1 High Guard",
  answer: "...",
  confidence: 78
}
```

برای اضافه‌کردن سؤال، یک Object مشابه به انتهای آرایه اضافه کن و `id` جدیدی برای آن بنویس.

## اگر بخواهم ظاهر را تغییر بدهم چه کنم؟

در ابتدای `styles.css` این متغیرها قرار دارند:

```css
--teal: #18c6a1; /* رنگ اصلی Artaki */
--blue: #3e8df5; /* Fighter A */
--red: #f26363; /* Fighter B */
--charcoal: #071317; /* Sidebar */
--radius: 17px; /* گردی Cardها */
```

برای شروع فقط همین متغیرها را تغییر بده و وارد بخش‌های دیگر CSS نشو.

## نقشه views.js

هر صفحه یک Function مشخص دارد:

| Function             | صفحه یا Component                   |
| -------------------- | ----------------------------------- |
| `overview()`         | صفحه Overview                       |
| `upload()`           | صفحه Upload Video                   |
| `processing()`       | صفحه Processing                     |
| `physicalProfiles()` | مشخصات بدنی                         |
| `reactionDNA()`      | Reaction DNA                        |
| `askFight()`         | Ask the Fight                       |
| `analysis()`         | صفحه Fight Analysis                 |
| `report()`           | گزارش PDF                           |
| `modals()`           | سه پنجره Correction، Replay و Drill |

اگر می‌خواهی فقط یک نوشته ثابت یا ترتیب یک بخش را تغییر بدهی، Function مربوط به همان بخش را باز کن.

## نقشه app.js

در حالت عادی لازم نیست این فایل را تغییر بدهی. قسمت‌های اصلی آن:

- `state`: وضعیت موقت برنامه
- `renderCurrentPage()`: نمایش صفحه انتخاب‌شده
- `selectLocalVideo()`: انتخاب ویدئو
- `seekVideo()`: رفتن به Timestamp
- `bindVideoPlayer()`: Play، Pause و نوار زمان
- `showQuestionAnswer()`: پاسخ Ask the Fight
- `saveCoachCorrection()`: ذخیره اصلاح مربی
- `initializeModals()`: عملکرد Modalها

## ترتیب پیشنهادی یادگیری

۱. فقط `data.js` را یاد بگیر و اطلاعات نمونه را تغییر بده.

۲. متغیرهای رنگ در ابتدای `styles.css` را تمرین کن.

۳. بعد ساختار صفحه‌ها در `views.js` را بررسی کن.

۴. در آخر وارد منطق `app.js` شو.

هر بار فقط یک تغییر انجام بده، ذخیره کن و نتیجه را در مرورگر ببین.

## چه بخش‌هایی واقعی هستند؟

موارد واقعی Prototype:

- Navigation
- انتخاب فایل ویدئو
- Video Player و Timestampها
- باز و بسته‌شدن Modalها
- Coach Correction در همان Session
- Print و Save as PDF

موارد شبیه‌سازی‌شده:

- تشخیص Jab، Cross و Roundhouse Kick
- اندازه‌گیری قد و Reach
- Reaction DNA
- Confidenceها
- Ask the Fight
- پیشنهاد Training Drill

این نسخه Backend، Database یا مدل واقعی AI ندارد.
