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
- Masuk pintu Toko/Serikat: E atau tombol "Masuk" yang muncul di dekat pintu
- Tas: Tab atau I
- Jeda: Esc
- HP landscape: joystick horizontal, Serang, Lompat, Makan, Minum

## Pintu di Kota
- Toko (x=200) dan Serikat (x=700) tidak lagi terbuka otomatis saat dilewati. Di dekat pintu muncul tombol "Masuk" (juga tombol E). Logika: `doorNear` di `edges()` dan `enterDoor()` di `js/core.js`.
- Tidak ada pintu keluar kota. Berjalan ke tepi kanan kota langsung masuk Hutan (tanpa konfirmasi).

## Menambah stage baru
Saat ini Stage 1 dibangun langsung di kode:
- Daftar area dan ukurannya: `LVW` dan `setupLevels()` di `js/core.js`
- Posisi platform: `setupLevels()` (koordinat mengikuti latar scene hutan)
- Perpindahan antar area: `edges()` di `js/core.js`
- Musuh per area: `spawnE()` dan `EN` di `js/core.js`

Untuk Stage 2 dan seterusnya, disarankan memindahkan data level ke file terpisah (misalnya `js/stages/stage2.js`) sebelum menambah area baru. Refactor ini belum dikerjakan.

## Drop, senjata, dan peti
- Koin: pasti didapat setiap musuh mati, jumlahnya acak sesuai `EN.g` (rentang per jenis musuh).
- Makanan: 30% per musuh (`killEn`). Senjata: peluang `DROP` (saat ini 15%).
- Senjata: `WEP` (rentang damage dan peluang miss per tier). Setelah kalah, hanya senjata Legend yang tetap ada di tas. Tas berisi 18 slot dan item yang masuk saat penuh akan hilang.
- Isi peti boss: `CHEST` di `js/core.js`, dengan jumlah item per tier untuk tiap stage.
- HP musuh: `EN` di `js/core.js`. HP boss: `setupLevels()`.

## Membuang item dari Tas
- Seret slot item atau senjata keluar dari panel penyimpanan lalu lepas: item hilang permanen (satu stack penuh untuk makanan/minuman). Panel dan item berubah merah saat berada di zona buang.
- Senjata terakhir tidak bisa dibuang. Kalau senjata aktif dibuang, senjata dengan damage rata-rata tertinggi yang tersisa otomatis dipasang.
- Logika: `buang()` di `js/render-ui.js`, drag pointer (mouse dan sentuh) di `js/main.js`, gaya `.ghost` di `css/style.css`.

## Level, XP, dan spawn
- XP per monster: `xp` di `EN` (js/core.js). Boss memberi 50 XP. Kebutuhan XP per level: `need()` (20 × level sekarang).
- Spawn: 1 monster tiap 6 detik per area, maksimal 10 monster hidup per area (`spawnNear`). Tipe yang paling sedikit didahulukan.
- Laporan petualangan tampil di Serikat dan direset setelah dibaca.

## Catatan
- Aset sprite, ikon, dan scene berasal dari paket acuan UI/UX (digambar dengan kode). Boleh dipakai sebagai placeholder.
- Font Pixelify Sans dan Press Start 2P dimuat dari Google Fonts, jadi perlu koneksi internet.
- Harga item, stat, HP musuh, dan drop rate masih nilai placeholder dan menunggu PM.
- Penyimpanan progres memakai localStorage di browser pemain.
