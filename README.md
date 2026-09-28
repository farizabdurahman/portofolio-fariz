# Portofolio — Fariz Abdurahman Fakhri (Ais)

Website portofolio pribadi **full-stack**: backend Node.js + Express + database SQLite,
frontend HTML/CSS/JS murni (tanpa framework berat, jadi ringan & cepat).

Desainnya menggabungkan dua gaya:
- Hero besar dengan tipografi outline + toggle light/dark mode
- Aksen warna gradient hidup + badge skill yang mengambang + timeline pengalaman bergaris

Semua konten (profil, skill, project, pengalaman) diambil dari **database**, jadi kamu tinggal
edit satu file (`server/seed.js`) untuk mengganti/menambah isi — tidak perlu sentuh HTML/CSS sama sekali.

---

## 1. Yang kamu butuhkan sebelum mulai (kalau belum punya)

Website ini butuh **Node.js** (yang sudah termasuk `npm`, package manager-nya). Kalau kamu belum
pernah install:

1. Buka **https://nodejs.org**
2. Download versi **LTS** (yang direkomendasikan, bukan "Current")
3. Install seperti install aplikasi biasa (Next → Next → Finish)
4. Cek berhasil dengan buka **Terminal** (Mac/Linux) atau **Command Prompt/PowerShell** (Windows), lalu ketik:
   ```bash
   node -v
   npm -v
   ```
   Kalau muncul nomor versi (misalnya `v22.x.x`), berarti sudah siap.

Kamu juga butuh **code editor** untuk mengedit konten nanti — rekomendasi: **VS Code**
(https://code.visualstudio.com), gratis.

---

## 2. Cara menjalankan project ini

Buka Terminal/Command Prompt, arahkan ke folder project ini (`cd portfolio-fariz`), lalu jalankan
berurutan:

```bash
# 1) Install semua dependency (sekali saja / setiap kali dependency berubah)
npm install

# 2) Isi database dengan data awal (Fariz, project, pengalaman, dll)
npm run seed

# 3) Jalankan server
npm start
```

Setelah `npm start`, akan muncul pesan:

```
🚀 Portfolio server jalan di: http://localhost:3000
```

Buka link tersebut di browser. Selesai — website kamu sudah jalan secara lokal di komputer kamu.

> Tips: selama development, pakai `npm run dev` sebagai ganti `npm start` — server otomatis
> restart setiap kali kamu menyimpan perubahan kode.

---

## 3. Cara mengedit isi website (tanpa coding HTML)

Semua data ada di **`server/seed.js`**. Buka file itu di code editor, ubah bagian yang kamu mau:

- **Profil & bio** → bagian `profile`
- **Daftar skill** → array `skills`
- **Project** → array `projects` (tinggal copy salah satu blok `{ ... }` untuk menambah project baru)
- **Pengalaman kerja / award** → array `experience`

Setelah selesai edit, simpan file lalu jalankan ulang:

```bash
npm run seed
```

Refresh browser kamu — perubahan langsung tampil. Tidak perlu restart server.

### Menambah project baru (contoh)

Di `server/seed.js`, tambahkan blok baru ke dalam array `projects`:

```js
{
  title: 'Nama Project Kamu',
  slug: 'nama-project-kamu',      // huruf kecil, pakai tanda -, harus unik
  summary: 'Deskripsi singkat 1 kalimat.',
  description: 'Deskripsi lebih lengkap untuk ditampilkan di modal detail.',
  cover_emoji: '🚀',                // emoji apa saja sebagai cover sementara
  cover_gradient: 'linear-gradient(135deg,#0EA5E9,#22D3EE)', // warna cover, bebas
  tags: 'React,Firebase,Tailwind', // pisahkan dengan koma
  role: 'Full-Stack Developer',
  year: '2026',
  status: 'Completed',             // Completed / In Progress / Planned
  live_url: 'https://...',         // kosongkan '' kalau belum ada
  repo_url: 'https://github.com/...',
  featured: 1,
},
```

### Mengganti foto profil

Saat ini avatar masih placeholder inisial "AF" berbentuk blob gradient. Untuk pakai foto asli:
1. Taruh file foto di `public/assets/` (misalnya `foto-profil.jpg`)
2. Buka `public/index.html`, cari elemen `id="avatarPlaceholder"`, ganti isinya dengan
   `<img src="/assets/foto-profil.jpg" alt="Foto Fariz">`
3. Sesuaikan sedikit di `public/css/style.css` bagian `.avatar-placeholder` kalau perlu (misalnya
   tambahkan `object-fit: cover;`).

---

## 4. Struktur folder

```
portfolio-fariz/
├─ server/
│  ├─ index.js        # entry point backend (Express)
│  ├─ db.js            # koneksi & skema database SQLite
│  ├─ seed.js           # ====> EDIT DATA KAMU DI SINI <====
│  ├─ routes/api.js     # semua endpoint REST API
│  └─ data/portfolio.db # file database (dibuat otomatis)
├─ public/
│  ├─ index.html        # struktur halaman
│  ├─ css/style.css     # semua styling
│  ├─ js/main.js        # logika frontend (fetch API, tema, modal, form)
│  └─ assets/           # taruh foto/gambar kamu di sini
├─ package.json
└─ .env.example
```

## 5. Endpoint API (kalau ingin dikembangkan lagi)

| Method | Endpoint          | Keterangan                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/profile`      | Data profil                         |
| GET    | `/api/skills`       | Daftar skill (dikelompokkan)        |
| GET    | `/api/projects`     | Daftar semua project                |
| GET    | `/api/projects/:slug` | Detail satu project               |
| GET    | `/api/experience`   | Daftar pengalaman & award           |
| POST   | `/api/contact`      | Kirim pesan dari form kontak        |

Pesan yang masuk dari form kontak tersimpan di tabel `messages` pada database. Untuk melihatnya,
jalankan:

```bash
node -e "console.log(require('./server/db').prepare('SELECT * FROM messages').all())"
```

---

## 6. Deploy ke internet (opsional)

Kalau sudah puas testing di lokal dan mau online-kan, opsi termudah untuk project Node.js + SQLite:

- **Render.com** (ada free tier, mendukung disk untuk file SQLite)
- **Railway.app**
- **Fly.io**

Semua platform di atas caranya mirip: hubungkan repo GitHub kamu, set start command `npm start`,
lalu deploy. Kalau butuh, saya bisa bantu bikin panduan deploy lebih detail untuk platform pilihan kamu.

---

Kalau ada bagian yang mau diubah lagi (warna, tata letak, tambah section, dsb), tinggal bilang saja.
