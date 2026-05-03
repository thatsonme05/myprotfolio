# 🎨 Portfolio — Moh Maulidin Mahdi

Website portfolio profesional corporate, hitam-putih, Angular 17.

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
cd portfolio-app
npm install
```

### 2. Development server
```bash
ng serve
```
Buka: **http://localhost:4200**

---

## 🔐 Admin Panel

URL: **http://localhost:4200/admin/login**
- **Username:** `admin`
- **Password:** `admin123`

### Fitur Admin:
- ➕ Tambah project baru
- 🖼️ Upload screenshot (drag & drop atau klik)
- ✏️ Edit project yang ada
- 🗑️ Hapus project
- 📊 Statistik project

---

## 👤 Tampilan User (Public)

- Hero section dengan foto profil
- Galeri project + filter kategori
- Work Experience & Education timeline
- Skills bar
- Contact section lengkap
- **TIDAK bisa tambah/edit/hapus** — read-only

---

## 🏗️ Build Production

```bash
ng build --configuration=production
```
Output: `dist/portfolio-app/` — upload ke Netlify, Vercel, atau server.

---

## 📁 Struktur

```
src/app/
├── pages/user/home/       ← Homepage public
├── pages/admin/login/     ← Login admin
├── pages/admin/dashboard/ ← Manajemen project
├── services/
│   ├── project.service.ts ← CRUD project (localStorage)
│   └── auth.service.ts    ← Autentikasi
├── guards/auth.guard.ts   ← Proteksi route admin
└── profile-data.ts        ← Data profil & foto
```

---

**Ganti foto profil:** Edit file `src/app/profile-data.ts`, ganti nilai `PROFILE_PHOTO` dengan base64 foto Anda.

