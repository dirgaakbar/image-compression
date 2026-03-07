// --- 1. TRACKER LOGIC ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID');
}
setInterval(updateClock, 1000);

document.getElementById('browser-info').innerText = `${navigator.platform} (${navigator.vendor || 'OS Detected'})`;
document.getElementById('screen-info').innerText = `${window.screen.width} x ${window.screen.height} Pixels`;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "Unknown City";
            document.getElementById('location-info').innerText = `${city}, ${data.address.country}`;
        } catch {
            document.getElementById('location-info').innerText = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        }
    }, () => {
        document.getElementById('location-info').innerText = "Akses lokasi ditolak.";
    });
}

// --- 2. IMAGE PROCESSING LOGIC ---
async function compressImage() {
    const fileInput = document.getElementById('upload');
    const processBtn = document.getElementById('processBtn');
    const mode = document.getElementById('processMode').value;

    if (!fileInput.files[0]) return alert("Pilih foto terlebih dahulu!");

    processBtn.innerText = "Processing HD...";
    processBtn.style.opacity = "0.7";
    
    const imageFile = fileInput.files[0];
    const originalSize = (imageFile.size / 1024 / 1024).toFixed(2);

    const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: parseInt(document.getElementById('maxWidth').value),
        useWebWorker: true,
        initialQuality: parseFloat(document.getElementById('quality').value),
        fileType: document.getElementById('format').value
    };

    try {
        let resultBlob = await imageCompression(imageFile, options);

        // Fitur AI Enhance Sederhana (Sharpening via Canvas)
        if (mode === "enhance") {
            resultBlob = await applySharpen(resultBlob);
        }

        const compressedSize = (resultBlob.size / 1024 / 1024).toFixed(2);
        const savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        // Update UI
        document.getElementById('resultArea').classList.remove('hidden');
        document.getElementById('sizeStats').innerText = `${originalSize}MB ➔ ${compressedSize}MB`;
        document.getElementById('reductionStats').innerText = `Kualitas HD - Hemat ${savedPercent}%`;
        
        const url = URL.createObjectURL(resultBlob);
        document.getElementById('preview').src = url;
        document.getElementById('downloadBtn').href = url;
        document.getElementById('downloadBtn').download = `HD_${Date.now()}.${options.fileType.split('/')[1]}`;

    } catch (err) {
        console.error(err);
        alert("Gagal memproses gambar.");
    } finally {
        processBtn.innerText = "PROSES FOTO HD";
        processBtn.style.opacity = "1";
    }
}

async function applySharpen(blob) {
    const img = await imageCompression.drawFileInCanvas(blob);
    const canvas = img[0];
    const ctx = canvas.getContext('2d');
    
    // Filter HD: Menambah kontras dan sedikit ketajaman
    ctx.filter = 'contrast(1.05) saturate(1.05) brightness(1.02)';
    ctx.drawImage(canvas, 0, 0);
    
    return new Promise(res => canvas.toBlob(res, document.getElementById('format').value, 0.95));
}
