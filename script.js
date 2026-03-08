// ... (Bagian atas script.js tetap sama seperti yang kita bahas sebelumnya) ...

// Fungsi untuk sinkronisasi lebar gambar 'before' agar pas dengan kontainer
function syncBeforeImageSize() {
    const containerWidth = document.querySelector('.compare-container').offsetWidth;
    document.getElementById("beforeImg").style.width = containerWidth + "px";
}

window.addEventListener('resize', syncBeforeImageSize);

// Logika Slider yang disempurnakan
const slider = document.getElementById("slider");
const beforeContainer = document.getElementById("beforeImgContainer");

const moveSlider = (e) => {
    const rect = slider.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent));
    
    beforeContainer.style.width = percent + "%";
    slider.style.left = percent + "%";
};

slider.onmousedown = () => {
    syncBeforeImageSize();
    document.onmousemove = moveSlider;
};
slider.ontouchstart = () => {
    syncBeforeImageSize();
    document.onmousemove = moveSlider;
};

document.onmouseup = () => document.onmousemove = null;
document.ontouchend = () => document.onmousemove = null;
