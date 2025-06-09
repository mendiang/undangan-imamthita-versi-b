// Pesan untuk cek apakah file JS termuat (cukup sekali)
console.log("Script.js loaded and executing...");

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
    // 1. Buat "catatan" apakah AOS sudah berhasil disiapkan.
    //    Awalnya kita anggap belum (false).
    let aosInitialized = false; // 'aosInitialized' itu seperti saklar, awalnya 'mati'
    // 2. Cek apakah "alat ajaib" AOS memang ada di halaman web kita.
    //    'typeof AOS !== 'undefined'' artinya "Apakah AOS itu ada dan bukan sesuatu yang kosong?"
    if (typeof AOS !== 'undefined') { 
        // 3. Jika AOS ADA, kita siapkan pengaturannya!
        AOS.init({ 
            duration: 800, // Berapa lama animasi berlangsung? (0.4 detik)
            easing: 'ease-out-cubic', // Easing yang natural
            once: true, // Apakah animasi hanya muncul SEKALI saja? (Ya, benar)
            offset: 50, // Seberapa jauh elemen harus masuk layar sebelum animasi dimulai? (100 pixel)
            mirror: false // Hindari re-animasi
        });
        // 4. Setelah berhasil disiapkan, ubah "catatan" kita jadi "sudah siap".
        aosInitialized = true; // Nyalakan saklar 'aosInitialized' jadi 'hidup'
        console.log("AOS Initialized");
    // 6. Jika AOS TIDAK ADA (mungkin filenya lupa dimasukkan):
    } else {
        // Beri peringatan di konsol bahwa alat ajaib AOS tidak ditemukan.
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
        // 1. Cek Ukuran Layar: Apakah ini tampilan komputer (desktop) atau HP (mobile)?
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
        console.log("initializeScreenState: isDesktop =", isDesktop, "| guestName dari URL =", guestName);

        // 2. Tampilkan Nama Tamu (jika ada di alamat web)
        updateGuestNameVisibility(); 

        // 3. Jika Tampilan DESKTOP (layar lebar):
        if (isDesktop) {
            console.log("Oke, ini tampilan DESKTOP!");
            // Atur agar body halaman bisa di-scroll (jika sebelumnya tidak bisa)
            document.body.classList.remove('no-scroll-global');
            document.body.classList.add('desktop-layout-active');

            // Atur tampilan layar selamat datang (yang ada di kiri)
            if (welcomeScreen) { // 'welcomeScreen' itu elemen layar kiri
                welcomeScreen.setAttribute('aria-modal', 'false'); // Bukan lagi pop-up penuh
                welcomeScreen.classList.add('primary-pane-desktop'); // Gaya khusus untuk panel kiri desktop
                welcomeScreen.classList.add('content-opened'); // Anggap konten utama sudah "dibuka""
                welcomeScreen.style.opacity = ''; welcomeScreen.style.visibility = ''; welcomeScreen.style.display = '';
            }

            // Atur tampilan panel konten utama (yang ada di kanan dan bisa di-scroll)
            if (secondaryPane) { // 'secondaryPane' itu elemen panel kanan
                const secondaryPaneWasActive = secondaryPane.classList.contains('active'); // Cek apakah panel kanan sudah aktif sebelumnya
                secondaryPane.style.display = ''; // Biarkan CSS media query yang atur display:block
                secondaryPane.classList.remove('visible-mobile'); // Bersihkan kelas mobile jika ada
                // Minta browser untuk siap-siap sebelum kita munculkan panel kanan
                requestAnimationFrame(() => { 
                    secondaryPane.classList.add('active'); // Tambahkan kelas 'active' agar panel kanan muncul dengan animasi
                    console.log("Panel kanan di desktop dimunculkan!");

                    // Jika panel kanan BARU SAJA menjadi aktif dan AOS (animasi saat scroll) sudah siap:
                    if (aosInitialized && !secondaryPaneWasActive) {
                        // Tunggu sebentar (900 milidetik) agar animasi munculnya panel kanan selesai
                        setTimeout(() => {
                            console.log("Sekarang, kita kasih tau AOS (animasi scroll) untuk ngecek ulang posisi elemen di panel kanan.");
                            AOS.refresh(); // Ini penting agar animasi scroll tahu posisi elemen yang benar
                            console.log("AOS sudah di-refresh untuk desktop.");
                        }, 700); // // 
                    }
                });
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
                // Jika dari resize dan sudah visible, AOS seharusnya sudah di-refresh saat pertama kali dibuka
                // atau akan di-refresh oleh event resize jika kita tambahkan logika itu.
                // Untuk sekarang, kita fokus pada refresh saat PERTAMA KALI dibuka.
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
                    // console.log("INIT Mobile: Tombol Buka Undangan ditampilkan.");
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
            // Di mode desktop, initializeScreenState seharusnya sudah menangani tampilan.
            // Tombol ini idealnya tidak terlihat atau tidak melakukan aksi signifikan terkait layout lagi.
            console.log("Tombol Buka Undangan ditekan di mode desktop. Layout sudah diatur oleh initializeScreenState.");
            // Anda bisa memastikan kelas-kelas penting tetap ada jika diperlukan sebagai fallback:
            if (welcomeScreen && !welcomeScreen.classList.contains('content-opened')) {
            welcomeScreen.classList.add('content-opened');
            }
            if (document.body && !document.body.classList.contains('desktop-layout-active')) {
                document.body.classList.add('desktop-layout-active');
            }
        // Tidak perlu mengaktifkan secondaryPane lagi jika sudah aktif dari initializeScreenState
        } else { // Mobile
            if (welcomeScreen) {
                welcomeScreen.style.opacity = '0';
                welcomeScreen.style.visibility = 'hidden';
            }
            if (secondaryPane) {
                secondaryPane.style.display = 'block'; // Pastikan display block sebelum animasi
                requestAnimationFrame(() => {
                    secondaryPane.classList.add('visible-mobile');
                    if (aosInitialized) {
                        // Transisi .secondary-pane-desktop.visible-mobile (dari CSS Anda):
                        // opacity 0.5s 0.1s, transform 0.5s 0.1s
                        // Total waktu = 0.1s (delay) + 0.5s (duration) = 0.6s = 600ms
                        // Beri buffer sedikit
                        setTimeout(() => {
                            console.log("Attempting AOS.refresh() for MOBILE...");
                            AOS.refresh();
                            console.log("AOS REFRESHED for MOBILE.");
                        }, 700); // 600ms + 100ms buffer
                    }
                });
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
    const bgSlideInterval = 4000;
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
    initializeCountdown(targetWeddingDate, "days-hero", "hours-hero", "minutes-hero", "seconds-hero", "countdown-hero", "Acara Telah Dimulai!", true);

    // Resize listener untuk handle perubahan layout
    window.addEventListener('resize', () => {
        initializeScreenState();
    // Pertimbangkan untuk refresh AOS juga saat resize, terutama jika layout berubah signifikan
        // Namun, ini bisa menyebabkan animasi berulang jika `once: false`.
        // Jika `once: true`, refresh saat resize mungkin diperlukan jika breakpoint berubah
        // dan elemen yang tadinya tidak ada/berbeda posisi kini perlu dianimasikan.
        if (aosInitialized) {
            console.log("Attempting AOS.refresh() on RESIZE...");
            // AOS.refresh(); // Hati-hati dengan ini jika tidak ingin animasi berulang pada setiap resize.
                           // Mungkin perlu logika lebih canggih di sini.
                           // Untuk sekarang, kita biarkan refresh utama ada di initializeScreenState (untuk desktop load)
                           // dan handleOpenInvitation (untuk mobile open).
        }
    });

    const messageForm = document.getElementById('message-form');
    const submitButton = document.getElementById('submitMessageBtn');
    const formStatus = document.getElementById('form-status');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const formGuestCountInput = document.getElementById('formGuestCount');


    if (attendanceRadios && guestCountGroup && formGuestCountInput) {
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'Hadir' && this.checked) {
                    guestCountGroup.style.display = 'block';
                    formGuestCountInput.required = true;
                } else {
                    guestCountGroup.style.display = 'none';
                    formGuestCountInput.required = false;
                }
            });
        });
    }

    if (messageForm && submitButton && formStatus) {
        messageForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...';
            formStatus.textContent = '';
            formStatus.className = 'mt-3'; // Reset class

            const formData = new FormData(messageForm);
            const data = {
                guestName: formData.get('guestName'),
                attendance: formData.get('attendance'),
                guestMessage: formData.get('guestMessage'),
                timestamp: new Date().toISOString() 
            };

            // Hanya tambahkan guestCount jika hadir
            if (data.attendance === 'Hadir') {
                data.guestCount = parseInt(formData.get('guestCount')) || 1;
            }


            try {
            // GANTI DENGAN URL ENDPOINT NETLIFY FUNCTION ANDA
            // Biasanya /api/nama-file-fungsi (tanpa .js)
            const response = await fetch('/api/submit-message', { // URL ini akan di-redirect oleh Netlify
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // data adalah objek dari formulir
            });

            if (response.ok) {
                const result = await response.json();
                formStatus.innerHTML = `<div class="alert alert-success" role="alert">${result.message || 'Pesan Anda berhasil terkirim. Terima kasih!'}</div>`;
                messageForm.reset();
                if(guestCountGroup) guestCountGroup.style.display = 'none';
                if(formGuestCountInput) formGuestCountInput.required = false;
                fetchAndDisplayMessages(); // <--- TAMBAHKAN INI UNTUK REFRESH
            } else {
                const errorResult = await response.json();
                formStatus.innerHTML = `<div class="alert alert-danger" role="alert">${errorResult.error || 'Gagal mengirim pesan. Silakan coba lagi.'}</div>`;
                console.error("Server error:", response.status, errorResult);
            }
            } catch (error) {   
                formStatus.innerHTML = '<div class="alert alert-danger" role="alert">Terjadi kesalahan. Periksa koneksi internet Anda dan coba lagi.</div>';
                console.error("Network or other error:", error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Kirim Pesan';
            }
        });
    }
    
    const messagesContainer = document.getElementById('messages-container');

    // Fungsi untuk membersihkan dan menampilkan pesan
    function renderMessages(messagesArray) {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = ''; // Kosongkan kontainer dulu

        if (!messagesArray || messagesArray.length === 0) {
            messagesContainer.innerHTML = '<p class="text-muted text-center">Belum ada ucapan. Jadilah yang pertama!</p>';
            return;
        }

        // Urutkan pesan: terbaru di atas (opsional, jika belum diurutkan dari backend/fungsi)
        messagesArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


        messagesArray.forEach(msgData => {
            // Hanya tampilkan pesan jika ada isinya
            if (msgData.message && msgData.message.trim() !== "") {
                const messageElement = document.createElement('div');
                messageElement.classList.add('mb-3', 'p-3', 'border-bottom'); // Sedikit styling
                
                let attendanceBadge = '';
                if (msgData.attendance === 'Hadir') {
                    attendanceBadge = `<span class="badge bg-success ms-2">Hadir</span>`;
                } else if (msgData.attendance === 'Tidak Hadir') {
                    attendanceBadge = `<span class="badge bg-secondary ms-2">Tidak Hadir</span>`;
                }

                messageElement.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 font-esthetic-readable">${escapeHtml(msgData.name || 'Seorang Tamu')} ${attendanceBadge}</h5>
                        ${msgData.timestamp ? `<small class="text-muted">${new Date(msgData.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</small>` : ''}
                    </div>
                    <p class="mb-0 mt-1">${escapeHtml(msgData.message)}</p>
                `;
                messagesContainer.appendChild(messageElement);
            }
        });
    }

    // Fungsi untuk mengambil semua pesan saat halaman dimuat
    async function fetchAndDisplayMessages() {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '<p class="text-muted text-center">Memuat ucapan...</p>'; // Pesan loading

        try {
            const response = await fetch('/api/get-messages'); // Panggil Netlify Function Anda
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.success && result.messages) {
                renderMessages(result.messages);
            } else {
                console.error("Gagal mengambil pesan:", result.error);
                messagesContainer.innerHTML = '<p class="text-danger text-center">Gagal memuat ucapan.</p>';
            }
        } catch (error) {
            console.error("Error fetching messages: ", error);
            if (messagesContainer) {
                messagesContainer.innerHTML = '<p class="text-danger text-center">Terjadi kesalahan saat memuat ucapan.</p>';
            }
        }
    }
    
    // Panggil fungsi untuk memuat pesan saat halaman dimuat
    fetchAndDisplayMessages();

    // Modifikasi form submission untuk memicu refresh pesan setelah submit sukses
    if (messageForm) {
        messageForm.addEventListener('submit', async function(event) {
            // ... (kode submit Anda yang sudah ada) ...

            // Di dalam blok try, setelah fetch POST berhasil:
            // if (response.ok) {
            //     const result = await response.json();
            //     formStatus.innerHTML = `<div class="alert alert-success" role="alert">${result.message || 'Pesan Anda berhasil terkirim. Terima kasih!'}</div>`;
            //     messageForm.reset();
            //     if(guestCountGroup) guestCountGroup.style.display = 'none';
            //     if(formGuestCountInput) formGuestCountInput.required = false;
                   
            //     fetchAndDisplayMessages(); // PANGGIL LAGI UNTUK REFRESH DAFTAR PESAN
            // } else { ... }
            // ...
        });
    }

}); // --- Akhir dari DOMContentLoaded ---

// Fungsi escapeHtml (pastikan ada di scope global atau di dalam DOMContentLoaded)
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, "\"")
         .replace(/'/g, "'");
}

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