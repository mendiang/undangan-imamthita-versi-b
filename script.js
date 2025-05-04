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