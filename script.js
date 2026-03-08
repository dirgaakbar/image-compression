// Elemen DOM
const uploadInput = document.getElementById('upload');
const dropZone = document.getElementById('drop-zone');
const fileLabel = document.getElementById('file-label');
const processBtn = document.getElementById('processBtn');
const resultDiv = document.getElementById('result');
const beforeImg = document.getElementById('beforeImg');
const afterImg = document.getElementById('afterImg');
const sizeStats = document.getElementById('sizeStats');
const savedStats = document.getElementById('savedStats');
const downloadBtn = document.getElementById('downloadBtn');

// Variable global
let originalFile;

// ========================
// Upload & Drag & Drop
// ========================
dropZone.addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', () => loadFile(uploadInput.files[0]));

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if(e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

// ========================
// Fungsi load file
// ========================
function loadFile(file){
    if(!file) return;
    originalFile = file;

    const reader = new FileReader();
    reader.onload = function(e){
        // Set preview gambar
        beforeImg.src = e.target.result;
        afterImg.src = e.target.result;

        // Sembunyikan hasil sebelumnya
        resultDiv.classList.add('hidden');

        // Reset input supaya bisa upload file sama lagi
        uploadInput.value = "";

        // Update label supaya terlihat sudah ada file
        fileLabel.innerHTML = `<strong>${file.name}</strong> dipilih`;
    };
    reader.readAsDataURL(file);
}

// ========================
// Optimasi Gambar
// ========================
processBtn.addEventListener('click', async () => {
    if(!originalFile) return alert("Pilih foto terlebih dahulu!");

    const maxWidth = parseInt(document.getElementById('maxWidth').value);
    const format = document.getElementById('format').value;
    const quality = parseFloat(document.getElementById('quality').value);

    const options = {
        maxWidthOrHeight: maxWidth,
        initialQuality: quality,
        useWebWorker: true
    };

    try {
        const compressedBlob = await imageCompression(originalFile, options);
        const newUrl = URL.createObjectURL(compressedBlob);

        afterImg.src = newUrl;

        // Statistik ukuran
        sizeStats.textContent = `${(compressedBlob.size / 1024).toFixed(2)} KB`;
        const saved = ((1 - compressedBlob.size / originalFile.size) * 100).toFixed(2);
        savedStats.textContent = saved + " %";

        // Download link
        downloadBtn.href = newUrl;
        downloadBtn.download = "optimized_image." + format.split('/')[1];

        resultDiv.classList.remove('hidden');

    } catch(err){
        alert("Terjadi kesalahan saat optimasi: " + err.message);
    }
});

// ========================
// Slider Perbandingan
// ========================
const slider = document.getElementById("slider");
const beforeContainer = document.getElementById("beforeImgContainer");

function moveSlider(e){
    const rect = slider.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));

    beforeContainer.style.width = percent + "%";
    slider.style.left = percent + "%";
}

// Mouse events
slider.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', moveSlider);
});
document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', moveSlider);
});

// Touch events
slider.addEventListener('touchstart', (e) => {
    e.preventDefault(); // mencegah scroll saat drag
    document.addEventListener('touchmove', moveSlider);
});
document.addEventListener('touchend', () => {
    document.removeEventListener('touchmove', moveSlider);
});
