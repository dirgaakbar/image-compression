// Fungsi untuk mengganti teks label saat file dipilih
function handleFileSelect() {
    const file = document.getElementById('upload').files[0];
    const label = document.getElementById('file-label');
    if (file) {
        label.innerText = "✓ Berkas: " + (file.name.length > 20 ? file.name.substring(0, 18) + "..." : file.name);
        label.style.color = "#2ea043";
    }
}

// Drag & Drop Functionality
const dropZone = document.getElementById('drop-zone');
['dragover', 'dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        if(evt === 'dragover') dropZone.classList.add('dragover');
        else dropZone.classList.remove('dragover');
        if(evt === 'drop') {
            document.getElementById('upload').files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
});

async function compressImage() {
    const fileInput = document.getElementById('upload');
    const processBtn = document.getElementById('processBtn');
    const mode = document.getElementById('processMode').value;
    const format = document.getElementById('format').value;

    if (!fileInput.files[0]) return alert("Silakan pilih foto terlebih dahulu.");

    // Loading UI
    processBtn.innerText = "Memproses secara lokal...";
    processBtn.disabled = true;

    const imageFile = fileInput.files[0];
    const originalSize = (imageFile.size / 1024 / 1024).toFixed(2);

    const options = {
        maxSizeMB: mode === 'enhance' ? 2 : 1, // Berikan ruang lebih untuk mode HD
        maxWidthOrHeight: parseInt(document.getElementById('maxWidth').value),
        useWebWorker: true,
        initialQuality: mode === 'enhance' ? 0.92 : 0.8,
        fileType: format
    };

    try {
        let resultBlob = await imageCompression(imageFile, options);

        // Jika mode Enhance aktif, jalankan penajaman visual
        if (mode === "enhance") {
            resultBlob = await applySharpen(resultBlob, format);
        }

        const compressedSize = (resultBlob.size / 1024 / 1024).toFixed(2);
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        // Tampilkan Hasil & Manajemen Memori
        const resultArea = document.getElementById('resultArea');
        const preview = document.getElementById('preview');
        const downloadBtn = document.getElementById('downloadBtn');

        // Bersihkan memori lama jika ada
        if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src);

        const url = URL.createObjectURL(resultBlob);
        
        document.getElementById('sizeStats').innerText = `${originalSize}MB ➔ ${compressedSize}MB`;
        document.getElementById('reductionStats').innerText = `Hemat ${savedPercent}%`;
        
        preview.src = url;
        downloadBtn.href = url;
        downloadBtn.download = `HD_Optimized_${Date.now()}.${format.split('/')[1]}`;

        resultArea.classList.remove('hidden');
        
        // Scroll halus ke area hasil
        setTimeout(() => {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan teknis. Pastikan berkas adalah gambar valid.");
    } finally {
        processBtn.innerText = "OPTIMALKAN SEKARANG";
        processBtn.disabled = false;
    }
}

async function applySharpen(blob, format) {
    const img = await imageCompression.drawFileInCanvas(blob);
    const canvas = img[0];
    const ctx = canvas.getContext('2d');
    
    // Teknik Penajaman: Kontras halus & sedikit peningkatan kecerahan
    ctx.filter = 'contrast(1.08) saturate(1.02) brightness(1.02)';
    ctx.drawImage(canvas, 0, 0);
    
    return new Promise(res => canvas.toBlob(res, format, 0.95));
}
