// Pesan untuk cek apakah file JS termuat (cukup sekali)
console.log("Script.js loaded and executing...");

// --- Fungsi untuk Menampilkan Gambar di Modal Galeri ---
function showImage(src) {
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = src;
    } else {
        console.error("Elemen #modalImage tidak ditemukan!");
    }
}

// --- Event Listener untuk DOMContentLoaded (Semua kode utama masuk sini) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");

    // --- Variabel Elemen DOM Utama ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const secondaryPane = document.querySelector('.secondary-pane-desktop');
    const openInvitationButton = document.getElementById('open-invitation');
    const guestNameDisplay = document.getElementById('guest-name-display');
    const guestNameContainer = document.getElementById('guest-name-container');
    const audio = document.getElementById('background-music');
    const musicButton = document.getElementById('button-music');
    let musicIcon = musicButton ? musicButton.querySelector('i') : null;

    // Cek Awal Elemen Krusial
    if (!welcomeScreen) console.error("KRUSIAL: #welcome-screen TIDAK DITEMUKAN!");
    if (!secondaryPane) console.error("KRUSIAL: .secondary-pane-desktop TIDAK DITEMUKAN!");
    if (!openInvitationButton) console.error("KRUSIAL: #open-invitation TIDAK DITEMUKAN!");
    if (!audio) console.warn("Elemen audio #background-music tidak ditemukan.");
    if (!musicButton) console.warn("Elemen #button-music tidak ditemukan.");
    if (musicButton && !musicIcon) console.warn("Icon di dalam #button-music tidak ditemukan.");
    if (!guestNameDisplay) console.warn("#guest-name-display tidak ditemukan.");
    if (!guestNameContainer) console.warn("#guest-name-container tidak ditemukan.");

    // --- Variabel State ---
    let isPlayingMusic = false;
    const DESKTOP_BREAKPOINT = 992; // Definisikan breakpoint desktop
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to'); // Ambil nama tamu dari URL

    // --- Inisialisasi AOS ---
    if (typeof AOS !== 'undefined') { // Periksa apakah AOS sudah dimuat
        AOS.init({ duration: 800, once: true, offset: 50 });
        console.log("AOS Initialized");
    } else {
        console.warn("AOS library not found.");
    }

    // --- Logika Musik ---
    function toggleMusic() {
        if (!audio || !musicIcon) return;
        if (audio.paused) {
            audio.play().then(() => {
                musicIcon.classList.remove('fa-play'); musicIcon.classList.add('fa-pause');
                musicButton.setAttribute('aria-label', 'Pause Music'); isPlayingMusic = true;
            }).catch(error => { console.error("Gagal memainkan musik:", error); isPlayingMusic = false; });
        } else {
            audio.pause();
            musicIcon.classList.remove('fa-pause'); musicIcon.classList.add('fa-play');
            musicButton.setAttribute('aria-label', 'Play Music'); isPlayingMusic = false;
        }
    }
    if (musicButton) musicButton.addEventListener('click', toggleMusic);


    // --- Fungsi Update Visibilitas Nama Tamu ---
    function updateGuestNameVisibility() {
        if (guestName && guestNameDisplay && guestNameContainer) {
            guestNameDisplay.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
            guestNameContainer.style.display = 'block';
            console.log("updateGuestNameVisibility: Nama tamu ditampilkan -", guestNameDisplay.textContent);
        } else if (guestNameContainer) {
            guestNameContainer.style.display = 'none';
            console.log("updateGuestNameVisibility: Tidak ada nama tamu atau elemen nama tidak lengkap.");
        }
    }

    // --- Fungsi Inisialisasi State Layar (Welcome & Pane) ---
    function initializeScreenState() {
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
        console.log("initializeScreenState: isDesktop =", isDesktop, "| guestName dari URL =", guestName);

        updateGuestNameVisibility(); // Panggil di awal untuk kedua mode

        if (isDesktop) {
            console.log("INIT: Mode Desktop");
            document.body.classList.remove('no-scroll-global');
            document.body.classList.add('desktop-layout-active');

            if (welcomeScreen) {
                welcomeScreen.setAttribute('aria-modal', 'false');
                welcomeScreen.classList.add('primary-pane-desktop');
                welcomeScreen.classList.add('content-opened'); // Langsung anggap konten "terbuka"
                welcomeScreen.style.opacity = ''; welcomeScreen.style.visibility = ''; welcomeScreen.style.display = '';
            }
            if (secondaryPane) {
                secondaryPane.style.display = ''; // Biarkan CSS media query yang atur display:block
                requestAnimationFrame(() => secondaryPane.classList.add('active')); // Langsung aktifkan animasi masuk
                console.log("INIT Desktop: Secondary Pane diaktifkan (kelas .active ditambahkan)");
            }
            // Tombol #open-invitation di primary pane akan disembunyikan oleh CSS
            // karena #welcome-screen memiliki kelas .content-opened

        } else { // Mobile
            console.log("INIT: Mode Mobile");
            document.body.classList.remove('desktop-layout-active');
            if (welcomeScreen) {
                welcomeScreen.classList.remove('primary-pane-desktop');
                welcomeScreen.classList.remove('content-opened');
            }

            const secondaryPaneIsActiveMobile = secondaryPane && secondaryPane.classList.contains('visible-mobile');

            if (secondaryPaneIsActiveMobile) { // Jika secondary pane sudah pernah dibuka di mobile
                if (welcomeScreen) {
                    welcomeScreen.style.opacity = '0'; welcomeScreen.style.visibility = 'hidden';
                }
                if (secondaryPane) secondaryPane.style.display = 'block';
                document.body.classList.remove('no-scroll-global');
                if (openInvitationButton) openInvitationButton.style.display = 'none';
            } else { // Welcome screen masih aktif / load awal mobile
                if (welcomeScreen) {
                    welcomeScreen.style.opacity = '1'; welcomeScreen.style.visibility = 'visible';
                    welcomeScreen.style.display = 'flex'; welcomeScreen.setAttribute('aria-modal', 'true');
                }
                if (secondaryPane) {
                    secondaryPane.style.display = 'none'; // Pastikan secondary pane tersembunyi
                    secondaryPane.classList.remove('active'); // Hapus kelas desktop jika ada
                }
                if (openInvitationButton) {
                    openInvitationButton.style.display = ''; // Pastikan tombol Buka Undangan terlihat
                    console.log("INIT Mobile: Tombol Buka Undangan ditampilkan.");
                }
                document.body.classList.add('no-scroll-global');
            }
        }
    }
    initializeScreenState(); // Panggil saat load pertama

    // --- Fungsi Handle Klik Tombol Buka Undangan ---
    function handleOpenInvitation() {
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
        console.log("Tombol Buka Undangan Ditekan - isDesktop:", isDesktop);

        // Autoplay musik (dipindah ke atas agar langsung play saat interaksi pertama)
        if (audio && audio.paused && musicButton && musicIcon) {
            audio.play().then(() => {
                musicIcon.classList.remove('fa-play'); musicIcon.classList.add('fa-pause');
                musicButton.setAttribute('aria-label', 'Pause Music'); isPlayingMusic = true;
            }).catch(error => { console.log("Autoplay musik gagal saat membuka undangan:", error); });
        }

        if (isDesktop) {
            // Di desktop, tombol ini seharusnya sudah disembunyikan oleh CSS via .content-opened.
            // Logika ini sebagai fallback jika tombol masih bisa diklik.
            if (secondaryPane && !secondaryPane.classList.contains('active')) {
                requestAnimationFrame(() => secondaryPane.classList.add('active'));
            }
            if (welcomeScreen) welcomeScreen.classList.add('content-opened'); // Pastikan kelas ada
            document.body.classList.add('desktop-layout-active'); // Pastikan body state benar
        } else { // Mobile
            if (welcomeScreen) {
                welcomeScreen.style.opacity = '0';
                welcomeScreen.style.visibility = 'hidden';
            }
            if (secondaryPane) {
                secondaryPane.style.display = 'block'; // Pastikan display block sebelum animasi
                requestAnimationFrame(() => secondaryPane.classList.add('visible-mobile'));
            }
            document.body.classList.remove('no-scroll-global');
        }
    }
    if (openInvitationButton) {
        openInvitationButton.addEventListener('click', handleOpenInvitation);
    }

    // --- Script untuk Slideshow Background Welcome Screen ---
    const bgSlides = document.querySelectorAll('.slideshow-background-container .slide-bg');
    let currentBgSlide = 0;
    const bgSlideInterval = 5000;
    function nextBgSlide() {
        if (bgSlides.length === 0) return;
        bgSlides[currentBgSlide].classList.remove('active');
        currentBgSlide = (currentBgSlide + 1) % bgSlides.length;
        bgSlides[currentBgSlide].classList.add('active');
    }
    if (bgSlides.length > 0) {
        bgSlides[0].classList.add('active');
        if (bgSlides.length > 1) setInterval(nextBgSlide, bgSlideInterval);
    }

    // --- Script untuk animasi .welcome-content-area ---
    if (welcomeScreen) {
        // Animasi ini berlaku untuk .welcome-content-area baik di mobile maupun di primary pane desktop
        setTimeout(() => welcomeScreen.classList.add('loaded'), 100);
    }

    // --- Logika Countdown Timer (Refactored) ---
    function initializeCountdown(targetDate, daysId, hoursId, minutesId, secondsId, containerId, endMessage, isHeroCountdown = false) {
        const daysElement = document.getElementById(daysId);
        const hoursElement = document.getElementById(hoursId);
        const minutesElement = document.getElementById(minutesId);
        const secondsElement = document.getElementById(secondsId);
        const countdownContainer = document.getElementById(containerId);

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement || !countdownContainer) {
            // console.warn(`Elemen countdown untuk container #${containerId} tidak lengkap.`);
            return;
        }

        const interval = setInterval(function() {
            // Untuk countdown original (bukan hero), hanya update jika di mobile atau jika elemennya visible
            // Di desktop, countdown original (di section#tanggal-lokasi) disembunyikan oleh CSS.
            if (!isHeroCountdown && (window.innerWidth >= DESKTOP_BREAKPOINT && getComputedStyle(countdownContainer).display === 'none')) {
                // Tidak perlu update jika tidak terlihat di desktop
                return;
            }

            const now = new Date().getTime();
            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.textContent = days < 0 ? 0 : days;
            hoursElement.textContent = hours < 0 ? '00' : String(hours).padStart(2, '0');
            minutesElement.textContent = minutes < 0 ? '00' : String(minutes).padStart(2, '0');
            secondsElement.textContent = seconds < 0 ? '00' : String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(interval);
                countdownContainer.innerHTML = `<p class='m-0 fw-bold ${isHeroCountdown ? "hero-countdown-ended" : ""}'>${endMessage}</p>`;
            }
        }, 1000);
    }

    const targetWeddingDate = new Date("July 12, 2025 08:00:00").getTime(); // Ganti dengan tanggal Anda
    // Inisialisasi countdown untuk hero (akan aktif jika elemennya ada, terutama di desktop)
    initializeCountdown(targetWeddingDate, "days-hero", "hours-hero", "minutes-hero", "seconds-hero", "countdown-hero", "The day is here!", true);
    // Inisialisasi countdown original (akan aktif jika elemennya ada, terutama di mobile)
    initializeCountdown(targetWeddingDate, "days", "hours", "minutes", "seconds", "countdown", "Acara Telah Dimulai!");

    // Resize listener untuk handle perubahan layout
    window.addEventListener('resize', initializeScreenState);

}); // --- Akhir dari DOMContentLoaded ---

// --- Fungsi untuk Menyalin Teks ke Clipboard ---
function copyToClipboard(textToCopy, buttonElement) {
    if (!buttonElement) {
        console.error("Button element untuk copyToClipboard tidak tersedia.");
        return;
    }
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = '<i class="fas fa-check me-1"></i> Tersalin!';
            buttonElement.disabled = true;
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin dengan Clipboard API: ', err);
            tryDeprecatedCopy(textToCopy, buttonElement);
        });
    } else {
        console.warn('Clipboard API tidak didukung, mencoba cara lama.');
        tryDeprecatedCopy(textToCopy, buttonElement);
    }
}

function tryDeprecatedCopy(textToCopy, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = 'fixed'; textArea.style.top = '-9999px'; textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
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
             alert('Gagal menyalin. Silakan salin secara manual.');
             console.error('Gagal menyalin dengan execCommand.');
        }
    } catch (err) {
         alert('Gagal menyalin. Silakan salin secara manual.');
         console.error('Gagal menyalin dengan execCommand: ', err);
    }
    document.body.removeChild(textArea);
}