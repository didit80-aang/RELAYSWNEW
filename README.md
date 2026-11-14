# Relay Control (PWA)

Dashboard kontrol relay ESP32 via MQTT. Berjalan sebagai PWA (bisa di-install ke layar utama).

## Deploy ke GitHub Pages
1. Buat repo baru di GitHub, lalu upload semua isi folder ini (termasuk `.github` dan `.nojekyll`).
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push ke branch `main`; workflow akan jalan otomatis. Alamat: `https://<username>.github.io/<nama-repo>/`
4. Buka di HP → menu browser → **Install app / Tambahkan ke Layar Utama**.

## Update
Setelah mengubah `index.html`, naikkan `VERSION` di `sw.js` (mis. `v2`) agar cache perangkat diperbarui.
