# Petualangan Pixel 2D · Stage 1

Game petualangan pixel side-view di browser. Proyek pribadi Owner (di luar produk Gezdev).
Status: implementasi FE dari draf UI/UX v2, menunggu approval Owner.

## Struktur
```
index.html          Markup semua layar (menu, HUD, toko, tas, dialog)
css/style.css       Gaya UI (token warna dan ukuran dari DESIGN_SYSTEM.md)
js/assets.js        Daftar path aset. Tambah aset baru di sini
js/core.js          Data, level, fisika, musuh, boss, transisi
js/render-ui.js     Render dunia (canvas), HUD, tas, toko, menu
js/main.js          Event keyboard dan sentuh, fit layar, loop utama
assets/             Sprite, ikon, dan latar scene (paket acuan UI/UX)
```
Tidak ada build step dan tidak ada backend. Semua berjalan langsung di browser.

## Menjalankan di komputer
Cara termudah, dari folder ini:
```
python3 -m http.server 8000
```
Lalu buka http://localhost:8000

## Publish ke GitHub Pages
```
git init
git add .
git commit -m "Stage 1 FE v2 (side-view)"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
Di GitHub: Settings → Pages → Build and deployment → Deploy from a branch → branch `main`, folder `/ (root)`. Game akan tampil di `https://USERNAME.github.io/NAMA-REPO/`.

## Kontrol
- Gerak: A/D atau panah kiri-kanan
- Lompat: Spasi atau W
- Serang: J
- Makan: 1 · Minum: 2
- Tas: Tab atau I
- Jeda: Esc
- HP landscape: joystick horizontal, Serang, Lompat, Makan, Minum

## Menambah stage baru
Saat ini Stage 1 dibangun langsung di kode:
- Daftar area dan ukurannya: `LVW` dan `setupLevels()` di `js/core.js`
- Posisi platform: `setupLevels()` (koordinat mengikuti latar scene hutan)
- Perpindahan antar area: `edges()` di `js/core.js`
- Musuh per area: `spawnE()` dan `EN` di `js/core.js`

Untuk Stage 2 dan seterusnya, disarankan memindahkan data level ke file terpisah (misalnya `js/stages/stage2.js`) sebelum menambah area baru. Refactor ini belum dikerjakan.

## Catatan
- Aset sprite, ikon, dan scene berasal dari paket acuan UI/UX (digambar dengan kode). Boleh dipakai sebagai placeholder.
- Font Pixelify Sans dan Press Start 2P dimuat dari Google Fonts, jadi perlu koneksi internet.
- Harga item, stat, HP musuh, dan drop rate masih nilai placeholder dan menunggu PM.
- Penyimpanan progres memakai localStorage di browser pemain.
