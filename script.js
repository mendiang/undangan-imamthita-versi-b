function showImage(src) {
    // Temukan elemen img di dalam modal
    const modalImage = document.getElementById('modalImage');
    // Setel atribut src dari elemen img modal dengan src gambar yang diklik
    modalImage.src = src;
}

// Anda bisa menambahkan kode JS lain di sini nanti
console.log("Script.js loaded!"); // Pesan untuk cek apakah file JS termuat

// --- Bagian Kode Sebelumnya (showImage, dll) ---

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

// 3. Fungsi untuk membuka undangan
function openInvitation() {
    // Sembunyikan welcome screen dengan efek fade out
    welcomeScreen.style.opacity = '0';
    // Tunggu animasi selesai baru benar-benar hilangkan
    setTimeout(() => {
        welcomeScreen.classList.add('d-none'); // Atau style.display = 'none'
    }, 800); // Sesuaikan durasi dengan transisi CSS

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
openButton.addEventListener('click', openInvitation);


// --- Sisa Kode JS (musik, modal, dll) ---
console.log("Script.js loaded!");