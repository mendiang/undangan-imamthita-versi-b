function showImage(src) {
    // Temukan elemen img di dalam modal
    const modalImage = document.getElementById('modalImage');
    // Setel atribut src dari elemen img modal dengan src gambar yang diklik
    modalImage.src = src;
}

// Anda bisa menambahkan kode JS lain di sini nanti
console.log("Script.js loaded!"); // Pesan untuk cek apakah file JS termuat

// --- Logika Musik ---
const audio = document.getElementById('background-music');
const musicButton = document.getElementById('button-music');
const musicIcon = musicButton.querySelector('i'); // Dapatkan elemen icon di dalam tombol

let isPlaying = false; // Status awal musik tidak berputar

// Fungsi untuk memainkan atau menghentikan musik
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        musicIcon.classList.remove('fa-pause'); // Hapus icon pause
        musicIcon.classList.add('fa-play');    // Tambah icon play
        musicButton.setAttribute('aria-label', 'Play Music');
    } else {
        // Coba mainkan musik (browser modern mungkin perlu interaksi user dulu)
        audio.play().then(() => {
            // Berhasil play
            musicIcon.classList.remove('fa-play'); // Hapus icon play
            musicIcon.classList.add('fa-pause');   // Tambah icon pause
            musicButton.setAttribute('aria-label', 'Pause Music');
        }).catch(error => {
            // Gagal play (misal karena belum ada interaksi)
            console.error("Autoplay musik gagal:", error);
            // Biarkan icon tetap play, user harus klik tombolnya
            isPlaying = false; // Pastikan status tetap false jika gagal
            return; // Keluar dari fungsi jika gagal play
        });
    }
    // Toggle status HANYA jika play berhasil atau jika memang sedang pause
    isPlaying = !isPlaying;
}

// Tambahkan event listener ke tombol musik
musicButton.addEventListener('click', toggleMusic);

// --- PEMBARUAN PENTING: Autoplay Policy ---
// Browser modern MEMBATASI autoplay audio. Audio hanya bisa dimulai
// SETELAH user berinteraksi dengan halaman (klik, scroll, dll).
// Cara umum: Mulai musik saat user klik tombol "Buka Undangan".
// Jika Anda belum punya tombol itu, kita akan buat di langkah Welcome Screen.
// Untuk sementara, musik HANYA akan play jika user klik tombol musiknya.

console.log("Script.js loaded!");

// --- Logika Welcome Screen ---
const welcomeScreen = document.getElementById('welcome-screen');
const openButton = document.getElementById('open-invitation');
const guestNameDisplay = document.getElementById('guest-name-display');
const guestNameContainer = document.getElementById('guest-name-container'); // Opsional: sembunyikan jika tak ada nama
const mainContent = document.querySelector('body > *:not(#welcome-screen):not(script):not(audio):not(div[style*="position: fixed"])'); // Pilih konten utama (perlu disesuaikan jika struktur body berubah)
// Atau cara lebih mudah: beri ID pada elemen main content Anda, misal <main id="main-invitation">...</main>
// const mainContent = document.getElementById('main-invitation');

// --- TAMBAHKAN INI: Kunci scroll saat halaman load ---
document.body.classList.add('no-scroll');
// ----------------------------------------------------

// 1. Ambil nama tamu dari URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to'); // Ambil nilai dari ?to=...

// 2. Tampilkan nama tamu jika ada
if (guestName) {
    // Ganti teks placeholder dengan nama tamu yang sudah di-decode dan dibersihkan sedikit
    guestNameDisplay.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
    guestNameContainer.style.display = 'block'; // Tampilkan kontainer nama
} else {
    // Jika tidak ada parameter 'to', sembunyikan seluruh bagian nama tamu
    guestNameContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slideshow-container .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Ganti gambar setiap 5 detik

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
        slides[0].classList.add('active'); // Tampilkan slide pertama
        setInterval(nextSlide, slideInterval);
    } else if (slides.length === 1) {
        slides[0].classList.add('active'); // Jika hanya 1 gambar, tampilkan saja
    }

    // ... (kode untuk tombol open-invitation dan musik tetap ada) ...
});

// 3. Fungsi untuk membuka undangan
function openInvitation() {
    // Sembunyikan welcome screen dengan efek fade out
    welcomeScreen.style.opacity = '0';
    // Tunggu animasi selesai baru benar-benar hilangkan
    setTimeout(() => {
        welcomeScreen.classList.add('d-none'); // Atau style.display = 'none'
    }, 800); // Sesuaikan durasi dengan transisi CSS

    // --- TAMBAHKAN INI: Hapus class no-scroll agar bisa scroll lagi ---
    document.body.classList.remove('no-scroll');
    // ----------------------------------------------------------------

    // Coba mainkan musik SEKARANG (setelah interaksi user)
    if (!isPlaying) {
         audio.play().then(() => {
             isPlaying = true;
             musicIcon.classList.remove('fa-play');
             musicIcon.classList.add('fa-pause');
             musicButton.setAttribute('aria-label', 'Pause Music');
         }).catch(error => {
             console.error("Musik gagal play setelah buka undangan:", error);
             isPlaying = false; // Tetap false jika gagal
         });
     }

    // Optional: Scroll ke bagian atas konten utama
    // mainContent.scrollIntoView({ behavior: 'smooth' });
     window.scrollTo(0, 0); // Scroll ke paling atas
}

// 4. Tambahkan event listener ke tombol buka undangan
if(openButton) { // Check jika tombol ada sebelum menambah listener
    openButton.addEventListener('click', openInvitation);
}

// --- Logika Countdown Timer ---

// 1. Tentukan Tanggal Tujuan (Ganti dengan tanggal & waktu acara Anda!)
// Format: Bulan NamaHari, Tahun Jam:Menit:Detik
// Contoh: January 1, 2025 09:00:00
// Atau bisa juga YYYY-MM-DDTHH:MM:SS
const countDownDate = new Date("July 12, 2025 08:00:00").getTime(); 

// 2. Dapatkan elemen untuk menampilkan waktu
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownElement = document.getElementById("countdown"); // Untuk menyembunyikan jika sudah lewat

// 3. Update countdown setiap 1 detik
const countdownInterval = setInterval(function() {

    // Dapatkan tanggal dan waktu saat ini
    const now = new Date().getTime();

    // Hitung selisih waktu
    const distance = countDownDate - now;

    // Kalkulasi hari, jam, menit, detik
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Tampilkan hasilnya di elemen
    // Tambahkan '0' di depan jika angka < 10 (opsional)
    daysElement.textContent = days < 0 ? 0 : days; // Jangan tampilkan negatif
    hoursElement.textContent = hours < 0 ? '00' : String(hours).padStart(2, '0');
    minutesElement.textContent = minutes < 0 ? '00' : String(minutes).padStart(2, '0');
    secondsElement.textContent = seconds < 0 ? '00' : String(seconds).padStart(2, '0');

    // Jika waktu countdown habis
    if (distance < 0) {
        clearInterval(countdownInterval); // Hentikan interval
        countdownElement.innerHTML = "<p class='m-0 fw-bold'>Acara Telah Dimulai!</p>"; // Tampilkan pesan
        // Atau sembunyikan saja: countdownElement.style.display = 'none';
    }

}, 1000); // Update setiap 1000ms = 1 detik

// --- Fungsi untuk Menyalin Teks ke Clipboard ---
function copyToClipboard(textToCopy, buttonElement) {
    // Coba gunakan API Clipboard modern jika didukung (lebih aman)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Sukses menyalin
            const originalText = buttonElement.innerHTML; // Simpan teks asli tombol
            buttonElement.innerHTML = '<i class="fas fa-check me-1"></i> Tersalin!'; // Ganti teks tombol
            buttonElement.disabled = true; // Nonaktifkan tombol sementara

            // Kembalikan teks tombol setelah beberapa detik
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.disabled = false;
            }, 2000); // 2 detik

        }).catch(err => {
            // Gagal menyalin dengan API modern
            console.error('Gagal menyalin dengan Clipboard API: ', err);
            tryDeprecatedCopy(textToCopy, buttonElement); // Coba cara lama
        });
    } else {
        // Jika API Clipboard tidak didukung, coba cara lama
        console.warn('Clipboard API tidak didukung, mencoba cara lama.');
        tryDeprecatedCopy(textToCopy, buttonElement);
    }
}

// Fungsi cara lama (fallback), mungkin tidak selalu berfungsi di browser modern
function tryDeprecatedCopy(textToCopy, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Hindari scroll ke bawah saat elemen ditambahkan
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = '<i class="fas fa-check me-1"></i> Tersalin!';
            buttonElement.disabled = true;
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.disabled = false;
            }, 2000);
        } else {
             alert('Gagal menyalin. Coba salin manual.');
             console.error('Gagal menyalin dengan execCommand.');
        }
    } catch (err) {
         alert('Gagal menyalin. Coba salin manual.');
         console.error('Gagal menyalin dengan execCommand: ', err);
    }

    document.body.removeChild(textArea);
}

// --- Sisa Kode JS (musik, modal, dll) ---
console.log("Script.js loaded!");

// --- Inisialisasi AOS ---
// Pastikan ini dijalankan setelah DOM siap,
// event listener 'DOMContentLoaded' adalah cara yang aman
document.addEventListener('DOMContentLoaded', (event) => {
    AOS.init({
        duration: 800, // Durasi animasi dalam ms
        once: true, // Animasi hanya terjadi sekali
        offset: 50, // Jarak trigger animasi sebelum elemen terlihat (px)
    });
    console.log("AOS Initialized");
});

console.log("Script.js loaded!");