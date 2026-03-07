// Mengganti teks saat file dipilih
function handleFileSelect() {
    const file = document.getElementById('upload').files[0];
    if (file) {
        document.getElementById('file-label').innerText = "Terpilih: " + file.name;
    }
}

async function compressImage() {
    const fileInput = document.getElementById('upload');
    const processBtn = document.getElementById('processBtn');
    const mode = document.getElementById('processMode').value;

    if (!fileInput.files[0]) return alert("Silakan pilih foto dulu!");

    processBtn.innerText = "Sabar, Sedang Memproses...";
    processBtn.disabled = true;

    const imageFile = fileInput.files[0];
    const originalSize = (imageFile.size / 1024 / 1024).toFixed(2);

    const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: parseInt(document.getElementById('maxWidth').value),
        useWebWorker: true,
        initialQuality: 0.85, // Default HD quality
        fileType: document.getElementById('format').value
    };

    try {
        let resultBlob = await imageCompression(imageFile, options);

        // Jika mode Enhance, tambahkan ketajaman visual
        if (mode === "enhance") {
            resultBlob = await applySharpen(resultBlob);
        }

        const compressedSize = (resultBlob.size / 1024 / 1024).toFixed(2);
        const savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        // Tampilkan Hasil
        document.getElementById('resultArea').classList.remove('hidden');
        document.getElementById('sizeStats').innerText = `${originalSize}MB ➔ ${compressedSize}MB`;
        document.getElementById('reductionStats').innerText = `Hemat Sekitar ${savedPercent}%`;
        
        const url = URL.createObjectURL(resultBlob);
        document.getElementById('preview').src = url;
        document.getElementById('downloadBtn').href = url;
        document.getElementById('downloadBtn').download = `HD_Foto_${Date.now()}.jpg`;

    } catch (err) {
        alert("Terjadi kesalahan saat memproses.");
    } finally {
        processBtn.innerText = "MULAI PROSES SEKARANG";
        processBtn.disabled = false;
        // Scroll otomatis ke hasil
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
}

async function applySharpen(blob) {
    const img = await imageCompression.drawFileInCanvas(blob);
    const canvas = img[0];
    const ctx = canvas.getContext('2d');
    // Penajaman HD: menaikkan kontras agar detail muncul
    ctx.filter = 'contrast(1.1) saturate(1.05)';
    ctx.drawImage(canvas, 0, 0);
    return new Promise(res => canvas.toBlob(res, document.getElementById('format').value, 0.95));
}
