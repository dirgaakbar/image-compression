# 📸 HD Image Compressor & Device Tracker

Website statis modern untuk melakukan kompresi gambar kualitas tinggi (HD) secara manual, konversi format, serta fitur deteksi data perangkat dan lokasi pengguna secara real-time.

## 🚀 Fitur Utama

* **HD Compression:** Mengurangi ukuran file gambar tanpa kehilangan ketajaman (Anti-Blur).
* **Manual Control:** Atur sendiri resolusi (lebar maksimal) dan tingkat kualitas (0.1 - 1.0).
* **Multi-Format:** Konversi instan ke format **JPEG, WebP,** atau **PNG**.
* **Device Tracker:** Mendeteksi sistem operasi, browser, dan resolusi layar pengguna.
* **Live Location:** Menampilkan lokasi pengguna beserta nama kota secara dinamis (via Geolocation API).
* **Dark Mode:** Tampilan futuristik dengan desain *Glassmorphism*.
* **Privacy Focused:** Semua proses kompresi dilakukan di sisi klien (browser), tidak ada foto yang diunggah ke server.

## 🛠️ Teknologi yang Digunakan

* **HTML5 & CSS3** (Custom Glassmorphism Design)
* **JavaScript (Vanilla)**
* **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression):** Library utama untuk kompresi HD.
* **Nominatim API:** Untuk pencarian nama kota berdasarkan koordinat.

## 📂 Struktur Folder

```text
├── index.html   # Struktur utama website
├── style.css    # Desain Dark Mode & Layout
├── script.js    # Logika kompresi & tracker
└── README.md    # Dokumentasi proyek
