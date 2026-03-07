// 1. UPDATE JAM REAL-TIME
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID');
}
setInterval(updateClock, 1000);

// 2. DETEKSI PERANGKAT
document.getElementById('browser-info').innerText = navigator.userAgent.split(') ')[1] || navigator.platform;
document.getElementById('screen-info').innerText = `${window.screen.width} x ${window.screen.height} px`;

// 3. DETEKSI LOKASI & NAMA KOTA
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            // Menggunakan API OpenStreetMap (Nominatim) untuk nama kota
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "Lokasi Ditemukan";
            document.getElementById('location-info').innerText = `${city}, ${data.address.country}`;
        } catch (err) {
            document.getElementById('location-info').innerText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
    }, () => {
        document.getElementById('location-info').innerText = "Izin lokasi ditolak pengguna.";
    });
}

// 4. LOGIKA KOMPRESI FOTO HD
async function compressImage() {
    const fileInput = document.getElementById('upload');
    const resultArea = document.getElementById('resultArea');
    const processBtn = document.getElementById('processBtn');

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file foto terlebih dahulu!");
        return;
    }

    processBtn.innerText = "Sedang Memproses...";
    processBtn.disabled = true;

    const imageFile = fileInput.files[0];
    const options = {
        maxSizeMB: 2, // Batas ukuran file (tetap dijaga HD)
        maxWidthOrHeight: parseInt(document.getElementById('maxWidth').value),
        useWebWorker: true,
        initialQuality: parseFloat(document.getElementById('quality').value),
        fileType: document.getElementById('format').value
    };

    try {
        const compressedFile = await imageCompression(imageFile, options);
        const downloadUrl = URL.createObjectURL(compressedFile);
        
        // Tampilkan Hasil
        resultArea.classList.remove('hidden');
        document.getElementById('preview').src = downloadUrl;
        
        const dl = document.getElementById('downloadBtn');
        dl.href = downloadUrl;
        dl.download = `HD_Compressed_${Date.now()}.${options.fileType.split('/')[1]}`;
        
        processBtn.innerText = "PROSES FOTO";
        processBtn.disabled = false;
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengompres gambar.");
        processBtn.disabled = false;
    }
}
