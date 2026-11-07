# Cabinet Pro (PWA)
فایل‌ها: index.html, style.css, app.js, sw.js, manifest.json, icon.svg

## اجرا
PWA فقط روی https یا localhost نصب می‌شود (با دوبل‌کلیک روی index.html کار می‌کند ولی نصب/آفلاین ندارد).
- تست روی ویندوز: در پوشه، `python -m http.server 8000` و باز کردن http://localhost:8000
- استفاده روی گوشی: پوشه را روی یک میزبان رایگان https (GitHub Pages / Netlify / Cloudflare Pages) آپلود کنید.

## نصب
- اندروید (Chrome): منو ⋮ ← Install app / افزودن به صفحه اصلی
- ویندوز (Chrome/Edge): آیکون نصب در نوار آدرس ← Install
بعد از اولین بارگذاری، برنامه آفلاین کار می‌کند. داده‌ها روی همان دستگاه ذخیره می‌شوند؛ از تب «پشتیبان» نسخه بگیرید.

## تبدیل بعدی به برنامه
ویندوز: Electron/Tauri — اندروید: Capacitor یا TWA. کد app.js مستقل از پلتفرم است.

## میزبانی رایگان با GitHub Pages (اختیاری)
۱. در github.com حساب بسازید ← New repository (مثلاً cabinet-pro) ← Public.
۲. Add file ← Upload files و همه فایل‌های پوشه را آپلود کنید (index.html در ریشه باشد) ← Commit.
۳. Settings ← Pages ← Source: Deploy from a branch ← main و پوشه root ← Save.
۴. بعد از حدود یک دقیقه آدرس https://USERNAME.github.io/cabinet-pro/ ساخته می‌شود؛ آن را در Chrome باز کنید و Install بزنید.
هنگام به‌روزرسانی فایل‌ها، نسخه کش را در sw.js (متغیر V) یک عدد بالا ببرید.
