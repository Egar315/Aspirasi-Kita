/**
 * Aspirasi-Kita - Portal Pengaduan Sosial & Fasilitas Publik
 * Main Application Logic (Core System)
 * Phase 4: Javascript Accessibility & Modular Refactoring
 */

// 1. DATA SIMULASI UTAMA (MOCK DATA GLOBAL)
const aspirasiData = [
    {
        id: 'laporan-001',
        judul: 'Lubang Besar di Tengah Jalan Lingkar Barat',
        deskripsi: 'Ada lubang jalan berukuran diameter hampir 1 meter dengan kedalaman 15 cm di Jalan Lingkar Barat KM 2. Hal ini sangat membahayakan pengendara motor, terutama ketika malam hari karena minim penerangan jalan.',
        kategori: 'infrastruktur',
        lokasi: 'Jakarta Barat',
        status: 'Proses',
        upvotes: 142,
        tanggal: '26 Mei 2026'
    },
    {
        id: 'laporan-002',
        judul: 'Halte Bus TransKota Koridor 3 Rusak Parah',
        deskripsi: 'Atap halte bus dekat Taman Kota bocor parah dan kursi tunggu kayunya sudah patah-patah. Mengakibatkan calon penumpang harus berdiri dan kehujanan saat menunggu kedatangan armada bus.',
        kategori: 'fasilitas-publik',
        lokasi: 'Bandung Tengah',
        status: 'Selesai',
        upvotes: 98,
        tanggal: '25 Mei 2026'
    },
    {
        id: 'laporan-003',
        judul: 'Pencurian Lampu Taman Terbuka Hijau',
        deskripsi: 'Tiga buah lampu hias sorot di area Taman Hijau Utama dicuri semalam. Kejadian ini membuat area pojok taman menjadi gelap gulita saat malam hari dan rawan disalahgunakan.',
        kategori: 'sosial',
        lokasi: 'Surabaya Timur',
        status: 'Menunggu',
        upvotes: 210,
        tanggal: '24 Mei 2026'
    },
    {
        id: 'laporan-004',
        judul: 'Sampah Menumpuk di Bantaran Kali Ciliwung',
        deskripsi: 'Tumpukan sampah plastik dan limbah rumah tangga menyumbat aliran air di bantaran sungai dekat RT 05. Mengeluarkan bau menyengat dan mengundang sarang nyamuk DBD.',
        kategori: 'lingkungan',
        lokasi: 'Jakarta Timur',
        status: 'Proses',
        upvotes: 75,
        tanggal: '23 Mei 2026'
    },
    {
        id: 'laporan-005',
        judul: 'Kerusakan Trotoar Ramah Difabel di Blok M',
        deskripsi: 'Ubin pemandu (tactile paving) untuk tuna netra di trotoar depan stasiun Blok M banyak yang lepas dan retak. Menyulitkan kawan-kawan difabel untuk berjalan dengan aman.',
        kategori: 'infrastruktur',
        lokasi: 'Jakarta Selatan',
        status: 'Menunggu',
        upvotes: 189,
        tanggal: '22 Mei 2026'
    }
];

// Inisialisasi awal saat dokumen siap
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Aspirasi-Kita Core System - Loading components...');

        // 1. Muat seluruh komponen HTML eksternal secara paralel
        await Promise.all([
            loadComponent('#header-component', 'assets/components/header.html'),
            loadComponent('#hero-component', 'assets/components/hero.html'),
            loadComponent('#filter-component', 'assets/components/filter.html'),
            loadComponent('#accessibility-panel-component', 'assets/components/accessibility-panel.html'),
            loadComponent('#footer-component', 'assets/components/footer.html')
        ]);

        console.log('Semua komponen berhasil dimuat.');

        // 2. Pasang Event Listener Header & Modal (karena elemen DOM sekarang sudah pasti ada)
        setupHeaderEvents();
        setupReportModalEvents();

        // 3. Inisialisasi Sistem Inti
        initCategoryFilters();
        initUpvoteSystem();
        initReportForm();
        renderAspirasiList();

        // 4. Inisialisasi Modal Detail Laporan
        initReportDetailModal();

        // 4. Inisialisasi Sistem Aksesibilitas Cerdas (accessibility.js)
        if (typeof window.initAccessibilitySystem === 'function') {
            window.initAccessibilitySystem();
        }
    } catch (error) {
        console.error('Error saat inisialisasi aplikasi:', error);
    }
});

/**
 * Fungsi Asinkronus untuk Mengambil (Fetch) berkas HTML eksternal 
 * dan memasukkannya ke dalam container jangkar.
 */
async function loadComponent(selector, filepath) {
    const container = document.querySelector(selector);
    if (!container) return;

    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`Gagal mengambil komponen: ${filepath} (${response.status})`);
        }
        const htmlContent = await response.text();
        container.innerHTML = htmlContent;
    } catch (err) {
        console.error(`Eror Modularisasi:`, err);
        container.innerHTML = `
            <div class="p-5 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-bold">
                Gagal memuat komponen visual '${selector}'. Hubungi administrator.
            </div>
        `;
    }
}

// Helper: Memformat tanggal hari ini ke format Bahasa Indonesia (misal: 26 Mei 2026)
function getTodayFormattedDate() {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date();
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ==========================================================================
// 2. RENDER FEED KARTU DINAMIS VIA DOM MANIPULATION
// ==========================================================================
function renderFeed(data) {
    const feedContainer = document.getElementById('feed-aspirasi');
    if (!feedContainer) return;

    // Kosongkan feed
    feedContainer.innerHTML = '';

    // Jika tidak ada data yang cocok dengan filter
    if (data.length === 0) {
        feedContainer.innerHTML = `
            <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-premium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-bold text-slate-700">Tidak Ada Laporan Ditemukan</h3>
                <p class="text-sm text-slate-400 mt-1">Laporan untuk kategori ini sedang kosong atau belum ditulis warga.</p>
            </div>
        `;
        return;
    }

    // Render masing-masing objek laporan
    data.forEach(item => {
        const card = document.createElement('article');
        card.id = item.id;
        card.setAttribute('data-category', item.kategori);
        card.className = "bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-premium hover:shadow-hover-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between";
        card.setAttribute('aria-labelledby', `title-${item.id}`);

        // Status Badge Style Generator
        let statusBgClass = '';
        let statusTextClass = '';
        let statusDotHtml = '';
        let statusLabel = '';

        switch (item.status) {
            case 'Selesai':
                statusBgClass = 'bg-emerald-50 border-emerald-100';
                statusTextClass = 'text-emerald-700';
                statusDotHtml = '<span class="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>';
                statusLabel = 'Selesai Perbaikan';
                break;
            case 'Proses':
                statusBgClass = 'bg-amber-50 border-amber-100';
                statusTextClass = 'text-amber-700';
                statusDotHtml = '<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true"></span>';
                statusLabel = 'Sedang Diproses';
                break;
            default: // Menunggu
                statusBgClass = 'bg-red-50 border-red-100';
                statusTextClass = 'text-red-700';
                statusDotHtml = '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping" aria-hidden="true"></span>';
                statusLabel = 'Menunggu Tindakan';
                break;
        }

        // Category Label Generator
        let categoryLabel = '';
        let categoryClass = '';

        switch (item.kategori) {
            case 'infrastruktur':
                categoryLabel = 'Infrastruktur';
                categoryClass = 'bg-orange-50 text-orange-600 border border-orange-100';
                break;
            case 'lingkungan':
                categoryLabel = 'Lingkungan';
                categoryClass = 'bg-teal-50 text-teal-600 border border-teal-100';
                break;
            case 'fasilitas-publik':
                categoryLabel = 'Fasilitas Publik';
                categoryClass = 'bg-purple-50 text-purple-600 border border-purple-100';
                break;
            case 'sosial':
                categoryLabel = 'Layanan Sosial';
                categoryClass = 'bg-rose-50 text-rose-600 border border-rose-100';
                break;
            default:
                categoryLabel = 'Umum';
                categoryClass = 'bg-slate-50 text-slate-600 border border-slate-100';
                break;
        }

        // Cek apakah item ini sudah di-upvote sebelumnya
        const isAlreadyUpvoted = hasUpvotedReport(item.id);
        const upvoteBtnClass = isAlreadyUpvoted
            ? 'text-brand-600 bg-brand-50 border-brand-200'
            : 'text-slate-500 bg-slate-50 border-transparent';

        card.innerHTML = `
            <div>
                <!-- Header Kartu: Kategori & Status Badge -->
                <div class="flex items-center justify-between mb-5">
                    <span class="px-3 py-1.5 text-xs font-extrabold rounded-xl uppercase tracking-wider ${categoryClass}" aria-label="Kategori: ${categoryLabel}">
                        ${categoryLabel}
                    </span>
                    <!-- Status Pengerjaan -->
                    <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBgClass} ${statusTextClass}">
                        ${statusDotHtml}
                        ${statusLabel}
                    </span>
                </div>
 
                <!-- Judul Laporan -->
                <h3 id="title-${item.id}" class="text-lg font-bold text-slate-800 mb-3 hover:text-brand-600 transition-colors flex items-center justify-between">
                    <a href="#detail-${item.id}" class="focus:outline-none focus:underline focus:text-brand-600 flex-grow">${escapeHTML(item.judul)}</a>
                    <button class="btn-listen p-1.5 text-slate-400 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600 rounded-lg ml-2 shrink-0" aria-label="Dengarkan laporan ini">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.5 9H4.5v6h3L12 18.75z" />
                        </svg>
                    </button>
                </h3>
 
                <!-- Deskripsi Laporan -->
                <p class="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    ${escapeHTML(item.deskripsi)}
                </p>
            </div>
 
            <!-- Footer Kartu: Informasi Lokasi & Tombol Dukungan -->
            <div class="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                <!-- Lokasi Laporan -->
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ${escapeHTML(item.lokasi)}
                </span>
 
                <!-- Tombol Upvote -->
                <div class="flex items-center">
                    <button class="btn-upvote inline-flex items-center gap-2 px-4 py-2.5 sm:px-3.5 sm:py-2 ${upvoteBtnClass} border hover:bg-brand-50 hover:text-brand-600 font-bold text-xs rounded-xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600"
                            aria-pressed="${isAlreadyUpvoted}"
                            aria-label="Dukung laporan ${escapeHTML(item.judul)}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        <span class="upvote-count">${item.upvotes}</span> Dukungan
                    </button>
                </div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}

// Helper: Escape HTML strings to prevent XSS vulnerability
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================================================
// 3. FITUR PENYARING KATEGORI (FILTER SYSTEM)
// ==========================================================================
let currentFilter = 'semua';
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.getAttribute('data-category');
            console.log(`Mengaktifkan filter kategori: ${currentFilter}`);

            // Perbarui visualisasi tombol aktif
            filterButtons.forEach(btn => {
                btn.className = "btn-filter px-4 py-2 text-sm font-medium rounded-lg transition-all bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-600";
                btn.setAttribute('aria-pressed', 'false');
            });

            button.className = "btn-filter px-4 py-2 text-sm font-medium rounded-lg transition-all bg-brand-600 text-white shadow-md shadow-brand-100 hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-600";
            button.setAttribute('aria-pressed', 'true');

            // Terapkan filter array dan render
            applyCurrentFilter();
        });
    });
}

function applyCurrentFilter() {
    if (currentFilter === 'semua') {
        renderFeed(aspirasiData);
    } else {
        const filtered = aspirasiData.filter(item => item.kategori === currentFilter);
        renderFeed(filtered);
    }
}

// ==========================================================================
// 4. LOGIKA INTERAKSI TOMBOL UPVOTE (SINGLE UPVOTE SYSTEM)
// ==========================================================================
function getUpvotedReports() {
    const data = localStorage.getItem('upvoted_reports');
    return data ? JSON.parse(data) : [];
}

function setUpvotedReports(array) {
    localStorage.setItem('upvoted_reports', JSON.stringify(array));
}

function hasUpvotedReport(id) {
    return getUpvotedReports().includes(id);
}

// Inisialisasi Event Delegation untuk Tombol Dukungan (Upvote)
function initUpvoteSystem() {
    const feedContainer = document.getElementById('feed-aspirasi');
    if (!feedContainer) return;

    feedContainer.addEventListener('click', (e) => {
        const upvoteBtn = e.target.closest('.btn-upvote');
        if (!upvoteBtn) return;

        const card = upvoteBtn.closest('article');
        if (!card) return;
        const reportId = card.id;

        const report = aspirasiData.find(item => item.id === reportId);
        if (!report) return;

        let upvotedList = getUpvotedReports();
        const isUpvoted = upvotedList.includes(reportId);
        const countSpan = upvoteBtn.querySelector('.upvote-count');

        if (isUpvoted) {
            // Batalkan Upvote
            report.upvotes--;
            upvotedList = upvotedList.filter(id => id !== reportId);
            upvoteBtn.setAttribute('aria-pressed', 'false');
            upvoteBtn.className = "btn-upvote inline-flex items-center gap-2 px-4 py-2.5 sm:px-3.5 sm:py-2 text-slate-500 bg-slate-50 border-transparent border hover:bg-brand-50 hover:text-brand-600 font-bold text-xs rounded-xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
        } else {
            // Lakukan Upvote
            report.upvotes++;
            upvotedList.push(reportId);
            upvoteBtn.setAttribute('aria-pressed', 'true');
            upvoteBtn.className = "btn-upvote inline-flex items-center gap-2 px-4 py-2.5 sm:px-3.5 sm:py-2 text-brand-600 bg-brand-50 border-brand-200 border hover:bg-brand-50 hover:text-brand-600 font-bold text-xs rounded-xl active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
        }

        // Simpan ke Local Storage & perbarui tampilan
        setUpvotedReports(upvotedList);
        if (countSpan) countSpan.textContent = report.upvotes;
        console.log(`Report ${reportId} upvotes updated to ${report.upvotes}.`);
    });
}

// ==========================================================================
// 5. VALIDASI & SUBMIT FORM PELAPORAN BARU
// ==========================================================================
function initReportForm() {
    const form = document.getElementById('form-pengaduan');
    if (!form) return;

    // Jalankan validasi pada event submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('input-judul');
        const categorySelect = document.getElementById('input-kategori');
        const locationInput = document.getElementById('input-lokasi');
        const descTextArea = document.getElementById('input-deskripsi');

        const titleVal = titleInput?.value.trim() || '';
        const categoryVal = categorySelect?.value || '';
        const locationVal = locationInput?.value.trim() || '';
        const descVal = descTextArea?.value.trim() || '';

        let isValid = true;

        // 1. Validasi Judul
        if (titleVal === '') {
            showError('input-judul', 'Judul laporan wajib diisi.');
            isValid = false;
        } else {
            clearError('input-judul');
        }

        // 2. Validasi Kategori
        if (categoryVal === '') {
            showError('input-kategori', 'Silakan pilih salah satu kategori.');
            isValid = false;
        } else {
            clearError('input-kategori');
        }

        // 3. Validasi Lokasi
        if (locationVal === '') {
            showError('input-lokasi', 'Lokasi kejadian wajib diisi.');
            isValid = false;
        } else {
            clearError('input-lokasi');
        }

        // 4. Validasi Deskripsi (Min 20 Karakter)
        if (descVal === '') {
            showError('input-deskripsi', 'Deskripsi laporan wajib diisi.');
            isValid = false;
        } else if (descVal.length < 20) {
            showError('input-deskripsi', `Deskripsi laporan terlalu singkat (minimal 20 karakter). Anda baru menulis ${descVal.length} karakter.`);
            isValid = false;
        } else {
            clearError('input-deskripsi');
        }

        // Jika form tidak valid, batalkan proses
        if (!isValid) return;

        // Membuat objek aduan warga baru
        const newAspirasiId = `laporan-${Date.now()}`;
        const newAspirasi = {
            id: newAspirasiId,
            judul: titleVal,
            deskripsi: descVal,
            kategori: categoryVal,
            lokasi: locationVal,
            status: 'Menunggu',
            upvotes: 0,
            tanggal: getTodayFormattedDate()
        };

        // Masukkan data baru di urutan teratas array
        aspirasiData.unshift(newAspirasi);

        // Reset tombol filter utama kembali ke 'semua' agar laporan baru terlihat
        currentFilter = 'semua';
        const allFilterBtn = document.querySelector('.btn-filter[data-category="semua"]');
        if (allFilterBtn) {
            allFilterBtn.click();
        } else {
            applyCurrentFilter();
        }

        // Bersihkan dan tutup form modal
        form.reset();
        toggleReportModal(false);

        // Tampilkan pesan sukses terintegrasi
        alert('Aspirasi Anda berhasil dikirim ke sistem! Terima kasih atas partisipasi aktif Anda.');
    });
}

// Utility: Menampilkan pesan eror validasi interaktif di bawah kolom input
function showError(elementId, message) {
    const inputElement = document.getElementById(elementId);
    if (!inputElement) return;

    let errorParagraph = inputElement.parentNode.querySelector('.error-message');
    if (!errorParagraph) {
        errorParagraph = document.createElement('p');
        errorParagraph.className = 'error-message text-red-500 text-xs mt-1.5 font-bold';
        inputElement.parentNode.appendChild(errorParagraph);
    }

    errorParagraph.textContent = message;
    inputElement.classList.add('border-red-400', 'focus:ring-red-100');
    inputElement.classList.remove('border-slate-200', 'focus:border-brand-500', 'focus:ring-brand-100', 'focus:border-violet-500', 'focus:ring-violet-100');
}

// Utility: Membersihkan pesan eror jika input valid
function clearError(elementId) {
    const inputElement = document.getElementById(elementId);
    if (!inputElement) return;

    const errorParagraph = inputElement.parentNode.querySelector('.error-message');
    if (errorParagraph) {
        errorParagraph.remove();
    }

    inputElement.classList.remove('border-red-400', 'focus:ring-red-100');
    inputElement.classList.add('border-slate-200', 'focus:border-violet-500', 'focus:ring-violet-100');
}

// Toggle Submission Modal Visibility
function toggleReportModal(show) {
    const modal = document.getElementById('modal-pelaporan');
    if (!modal) return;

    if (show) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('input-judul')?.focus();
    } else {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        const fields = ['input-judul', 'input-kategori', 'input-lokasi', 'input-deskripsi'];
        fields.forEach(id => clearError(id));
    }
}

// Event listener untuk tombol di header secara dinamis
function setupHeaderEvents() {
    // Tombol Aksesibilitas di header sudah ditangani oleh accessibility.js,
    // Kita tambahkan event listener untuk tombol "Tulis Laporan" di header secara terprogram:
    const btnTulisLaporanHeader = document.querySelector('button[aria-label="Tulis Laporan Aspirasi Baru"]');
    if (btnTulisLaporanHeader) {
        // Hapus inline attribute agar tidak berbenturan
        btnTulisLaporanHeader.removeAttribute('onclick');
        btnTulisLaporanHeader.addEventListener('click', () => {
            toggleReportModal(true);
        });
    }
}

// Event listener untuk tombol penutup di dalam modal pelaporan
function setupReportModalEvents() {
    // Tombol Tutup Modal (x)
    const btnCloseModal = document.querySelector('button[aria-label="Tutup Formulir Laporan"]');
    if (btnCloseModal) {
        btnCloseModal.removeAttribute('onclick');
        btnCloseModal.addEventListener('click', () => {
            toggleReportModal(false);
        });
    }

    // Tombol Batal di dalam modal
    const btnCancelModal = document.querySelector('button[aria-label="Batalkan Pengisian Laporan"]');
    if (btnCancelModal) {
        btnCancelModal.removeAttribute('onclick');
        btnCancelModal.addEventListener('click', () => {
            toggleReportModal(false);
        });
    }

    // Klik di overlay luar modal untuk menutup secara aman
    const modalOverlay = document.querySelector('#modal-pelaporan > div:first-child');
    if (modalOverlay) {
        modalOverlay.removeAttribute('onclick');
        modalOverlay.addEventListener('click', (e) => {
            // Pastikan klik terjadi pada overlay luar, bukan box modal
            if (e.target === modalOverlay) {
                toggleReportModal(false);
            }
        });
    }
}

// Wrapper untuk renderFeed (Sesuai penamaan pada rancangan inisialisasi)
function renderAspirasiList() {
    renderFeed(aspirasiData);
}

// ==========================================================================
// 6. MODAL DETAIL LAPORAN (REPORT DETAIL MODAL)
// ==========================================================================

let currentModalReportId = null;
let modalTTSActive = false;

/** Build and inject the modal scaffold into the DOM (called once) */
function buildModalScaffold() {
    if (document.getElementById('modal-detail-laporan')) return;
    const el = document.createElement('div');
    el.id = 'modal-detail-laporan';
    el.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 opacity-0 pointer-events-none invisible';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'modal-detail-title');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl transform translate-y-4 transition-all duration-300 flex flex-col" id="modal-detail-box">
        </div>
    `;
    document.body.appendChild(el);
}

/** Determine timeline stages based on status */
function getTimelineStages(status) {
    let progressWidth = 0;
    let step1Class = 'bg-slate-200 text-slate-500';
    let step2Class = 'bg-slate-200 text-slate-500';
    let step3Class = 'bg-slate-200 text-slate-500';

    if (status === 'Menunggu') {
        progressWidth = 0;
        step1Class = 'bg-brand-600 text-white ring-4 ring-brand-100';
    } else if (status === 'Proses') {
        progressWidth = 50;
        step1Class = 'bg-brand-600 text-white';
        step2Class = 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse';
    } else if (status === 'Selesai') {
        progressWidth = 100;
        step1Class = 'bg-brand-600 text-white';
        step2Class = 'bg-brand-600 text-white';
        step3Class = 'bg-brand-600 text-white ring-4 ring-brand-100';
    }

    return { progressWidth, step1Class, step2Class, step3Class };
}

/** Build modal inner HTML from a report object */
function buildModalHTML(report) {
    const isUpvoted = hasUpvotedReport(report.id);

    // Category Label & Styling
    let categoryLabel = '';
    let categoryClass = '';
    switch (report.kategori) {
        case 'infrastruktur':
            categoryLabel = 'Infrastruktur';
            categoryClass = 'bg-orange-50 text-orange-600 border border-orange-100';
            break;
        case 'lingkungan':
            categoryLabel = 'Lingkungan';
            categoryClass = 'bg-teal-50 text-teal-600 border border-teal-100';
            break;
        case 'fasilitas-publik':
            categoryLabel = 'Fasilitas Publik';
            categoryClass = 'bg-purple-50 text-purple-600 border border-purple-100';
            break;
        case 'sosial':
            categoryLabel = 'Layanan Sosial';
            categoryClass = 'bg-rose-50 text-rose-600 border border-rose-100';
            break;
        default:
            categoryLabel = 'Umum';
            categoryClass = 'bg-slate-50 text-slate-600 border border-slate-100';
            break;
    }

    // Status Badge Styling
    let statusBgClass = '';
    let statusTextClass = '';
    let statusDotHtml = '';
    let statusLabel = '';
    switch (report.status) {
        case 'Selesai':
            statusBgClass = 'bg-emerald-50 border-emerald-100';
            statusTextClass = 'text-emerald-700';
            statusDotHtml = '<span class="w-2 h-2 rounded-full bg-emerald-500"></span>';
            statusLabel = 'Selesai Perbaikan';
            break;
        case 'Proses':
            statusBgClass = 'bg-amber-50 border-amber-100';
            statusTextClass = 'text-amber-700';
            statusDotHtml = '<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>';
            statusLabel = 'Sedang Diproses';
            break;
        default: // Menunggu
            statusBgClass = 'bg-red-50 border-red-100';
            statusTextClass = 'text-red-700';
            statusDotHtml = '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>';
            statusLabel = 'Menunggu Tindakan';
            break;
    }

    // Timeline calculation
    const timeline = getTimelineStages(report.status);

    // Format Report ID (ASP-2026-XXX)
    const numPart = report.id.replace('laporan-', '').padStart(3, '0');
    const reportCode = isNaN(parseInt(numPart)) ? report.id.toUpperCase() : `ASP-2026-${numPart}`;

    return `
        <!-- Gradient Header matching Hero Section Color -->
        <div class="bg-gradient-to-br from-[#6C3CE1] to-[#4B2FBF] p-6 text-white relative">
            <!-- Close Button (X) -->
            <button class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#6C3CE1]" id="btn-close-detail-modal" aria-label="Tutup Detail Laporan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${categoryClass}">${categoryLabel}</span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusBgClass} ${statusTextClass}">
                    ${statusDotHtml}
                    ${statusLabel}
                </span>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
            <!-- Title, Metadata, Location -->
            <div>
                <!-- Title -->
                <h2 id="modal-detail-title" class="text-[22px] font-bold text-slate-800 leading-snug">
                    ${escapeHTML(report.judul)}
                </h2>

                <!-- Metadata Row (date + ID + location) -->
                <div class="flex flex-wrap gap-x-5 gap-y-2 text-slate-400 text-xs font-bold mt-3">
                    <div class="flex items-center gap-1.5">
                        <svg class="text-slate-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${report.tanggal}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <svg class="text-slate-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span class="font-mono text-slate-500">${reportCode}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <svg class="text-slate-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>${escapeHTML(report.lokasi)}</span>
                    </div>
                </div>
            </div>

            <hr class="border-slate-100">

            <!-- Full description -->
            <div class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                ${escapeHTML(report.deskripsi)}
            </div>

            <hr class="border-slate-100">

            <!-- Progress Timeline (Stepper) -->
            <div>
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Progres Penanganan</h3>
                
                <div class="flex items-center justify-between w-full relative py-6">
                    <!-- Background Connector Line -->
                    <div class="absolute top-[38px] left-[15%] right-[15%] h-1 bg-slate-200 -z-10">
                        <div class="h-full bg-brand-600 transition-all duration-500" style="width: ${timeline.progressWidth}%"></div>
                    </div>

                    <!-- Step 1 -->
                    <div class="flex flex-col items-center flex-1">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${timeline.step1Class}">
                            ${timeline.progressWidth > 0 ? '✓' : '1'}
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold mt-2 text-center text-slate-500 whitespace-pre-line leading-tight">Laporan<br>Diterima</span>
                    </div>

                    <!-- Step 2 -->
                    <div class="flex flex-col items-center flex-1">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${timeline.step2Class}">
                            ${timeline.progressWidth > 50 ? '✓' : '2'}
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold mt-2 text-center text-slate-500 whitespace-pre-line leading-tight">Sedang<br>Ditinjau</span>
                    </div>

                    <!-- Step 3 -->
                    <div class="flex flex-col items-center flex-1">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${timeline.step3Class}">
                            3
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold mt-2 text-center text-slate-500 whitespace-pre-line leading-tight">Tindakan<br>Diambil</span>
                    </div>
                </div>
            </div>

            <hr class="border-slate-100">

            <!-- Footer Action Row -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Upvote Button -->
                <button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-600 font-bold transition-all text-sm ${isUpvoted ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' : 'bg-transparent text-brand-600 hover:bg-brand-50'}" id="modal-btn-upvote" aria-pressed="${isUpvoted}" aria-label="Dukung laporan ini. Saat ini ${report.upvotes} dukungan.">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isUpvoted ? 'white' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span><span id="modal-upvote-count">${report.upvotes}</span> Dukungan</span>
                </button>

                <!-- TTS and Social Share -->
                <div class="flex items-center gap-3">
                    <!-- Speech Synthesis Button -->
                    <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs cursor-pointer ${modalTTSActive ? 'border-brand-600 bg-brand-50 text-brand-600' : ''}" id="modal-btn-tts" aria-label="Bacakan laporan ini dengan suara">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                        <span id="modal-tts-label">${modalTTSActive ? 'Berhenti' : 'Bacakan'}</span>
                    </button>

                    <!-- Share Dropdown/Tooltip -->
                    <div class="share-wrapper relative">
                        <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs cursor-pointer" id="modal-btn-share" aria-label="Bagikan laporan ini" aria-expanded="false">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            <span>Bagikan</span>
                        </button>

                        <!-- Share Tooltip content -->
                        <div class="absolute bottom-[calc(100%+8px)] right-0 bg-slate-900 text-white rounded-xl p-1.5 flex gap-1 shadow-xl transition-all duration-200 pointer-events-none opacity-0 translate-y-1 z-50" id="modal-share-tooltip" role="menu">
                            <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer" id="modal-share-wa" role="menuitem" aria-label="Bagikan via WhatsApp">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.858L0 24l6.335-1.658A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-4.988-1.366l-.357-.212-3.758.984 1.003-3.647-.233-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"></path>
                                </svg>
                                <span>WhatsApp</span>
                            </button>
                            <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-all cursor-pointer" id="modal-share-copy" role="menuitem" aria-label="Salin tautan laporan">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                </svg>
                                <span id="modal-copy-label">Salin Tautan</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/** Open the detail modal for a given report ID */
function openReportDetailModal(reportId) {
    const report = aspirasiData.find(r => r.id === reportId);
    if (!report) return;

    currentModalReportId = reportId;
    modalTTSActive = false;

    const overlay = document.getElementById('modal-detail-laporan');
    const box     = document.getElementById('modal-detail-box');
    if (!overlay || !box) return;

    box.innerHTML = buildModalHTML(report);
    overlay.setAttribute('aria-hidden', 'false');

    // Show modal with animation
    overlay.classList.remove('invisible', 'pointer-events-none', 'opacity-0');
    overlay.classList.add('visible', 'pointer-events-auto', 'opacity-100');

    // Animating box sliding up slightly
    box.classList.remove('translate-y-4');
    box.classList.add('translate-y-0');

    // Trap focus to close button
    document.getElementById('btn-close-detail-modal')?.focus();

    // Wire up events inside the modal
    document.getElementById('btn-close-detail-modal')
        ?.addEventListener('click', closeReportDetailModal);

    document.getElementById('modal-btn-upvote')
        ?.addEventListener('click', () => handleModalUpvote(report));

    document.getElementById('modal-btn-tts')
        ?.addEventListener('click', () => handleModalTTS(report));

    // Share toggle
    const shareBtn     = document.getElementById('modal-btn-share');
    const shareTooltip = document.getElementById('modal-share-tooltip');
    shareBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = shareTooltip.classList.contains('opacity-100');
        if (isVisible) {
            shareTooltip.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            shareTooltip.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
            shareBtn.setAttribute('aria-expanded', 'false');
        } else {
            shareTooltip.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-1');
            shareTooltip.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            shareBtn.setAttribute('aria-expanded', 'true');
        }
    });

    document.getElementById('modal-share-wa')?.addEventListener('click', () => {
        const text = `*${report.judul}*\n📍 ${report.lokasi}\n\n${report.deskripsi}\n\n🔗 Aspirasi-Kita Portal`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        shareTooltip.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        shareTooltip.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
    });

    document.getElementById('modal-share-copy')?.addEventListener('click', () => {
        const copyText = `${report.judul} — ${report.lokasi} | Aspirasi-Kita`;
        navigator.clipboard?.writeText(copyText).then(() => {
            const label = document.getElementById('modal-copy-label');
            if (label) { 
                label.textContent = '✓ Tersalin!'; 
                setTimeout(() => { label.textContent = 'Salin Tautan'; }, 2000); 
            }
        });
        setTimeout(() => {
            shareTooltip.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            shareTooltip.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
        }, 800);
    });

    // Close share tooltip on outside click
    document.addEventListener('click', closeShareOnOutside);

    // Lock body scroll
    document.body.style.overflow = 'hidden';
}

/** Close the detail modal */
function closeReportDetailModal() {
    const overlay = document.getElementById('modal-detail-laporan');
    const box     = document.getElementById('modal-detail-box');
    if (!overlay || !box) return;

    // Hide with animation
    box.classList.remove('translate-y-0');
    box.classList.add('translate-y-4');

    overlay.classList.remove('visible', 'pointer-events-auto', 'opacity-100');
    overlay.classList.add('invisible', 'pointer-events-none', 'opacity-0');
    overlay.setAttribute('aria-hidden', 'true');

    // Stop TTS if playing
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    modalTTSActive = false;
    currentModalReportId = null;

    document.removeEventListener('click', closeShareOnOutside);
    document.body.style.overflow = '';
}

function closeShareOnOutside(e) {
    const tooltip = document.getElementById('modal-share-tooltip');
    const shareBtn = document.getElementById('modal-btn-share');
    if (tooltip && !tooltip.contains(e.target) && e.target !== shareBtn && !shareBtn.contains(e.target)) {
        tooltip.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        tooltip.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
        shareBtn?.setAttribute('aria-expanded', 'false');
    }
}

/** Handle upvote action from inside the modal */
function handleModalUpvote(report) {
    let upvotedList = getUpvotedReports();
    const isUpvoted = upvotedList.includes(report.id);
    const btn       = document.getElementById('modal-btn-upvote');
    const countEl   = document.getElementById('modal-upvote-count');

    if (isUpvoted) {
        report.upvotes--;
        upvotedList = upvotedList.filter(id => id !== report.id);
        if (btn) {
            btn.className = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-600 font-bold transition-all text-sm bg-transparent text-brand-600 hover:bg-brand-50";
            btn.setAttribute('aria-pressed', 'false');
        }
    } else {
        report.upvotes++;
        upvotedList.push(report.id);
        if (btn) {
            btn.className = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-600 font-bold transition-all text-sm bg-brand-600 text-white shadow-lg shadow-brand-100";
            btn.setAttribute('aria-pressed', 'true');
        }
    }

    setUpvotedReports(upvotedList);
    if (countEl) countEl.textContent = report.upvotes;

    // Sync card in the feed
    const cardBtn   = document.querySelector(`#${report.id} .btn-upvote`);
    const cardCount = cardBtn?.querySelector('.upvote-count');
    if (cardCount) cardCount.textContent = report.upvotes;
    
    // Sync button state in feed
    if (cardBtn) {
        if (isUpvoted) {
            cardBtn.className = "btn-upvote flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-600 text-brand-600 font-bold hover:bg-brand-50 active:scale-95 transition-all text-xs";
            cardBtn.setAttribute('aria-pressed', 'false');
        } else {
            cardBtn.className = "btn-upvote flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-600 bg-brand-600 text-white font-bold hover:bg-brand-700 active:scale-95 transition-all text-xs shadow-md shadow-brand-100";
            cardBtn.setAttribute('aria-pressed', 'true');
        }
    }
}

/** Handle TTS play/stop from inside the modal */
function handleModalTTS(report) {
    const btn = document.getElementById('modal-btn-tts');
    const label = document.getElementById('modal-tts-label');
    if (!('speechSynthesis' in window)) return;

    if (modalTTSActive) {
        window.speechSynthesis.cancel();
        modalTTSActive = false;
        if (btn) btn.classList.remove('border-brand-600', 'bg-brand-50', 'text-brand-600');
        if (label) label.textContent = 'Bacakan';
    } else {
        const text = `${report.judul}. Lokasi: ${report.lokasi}. ${report.deskripsi}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith('id'));
        if (idVoice) utterance.voice = idVoice;
        utterance.onend = () => {
            modalTTSActive = false;
            if (btn) btn.classList.remove('border-brand-600', 'bg-brand-50', 'text-brand-600');
            if (label) label.textContent = 'Bacakan';
        };
        window.speechSynthesis.speak(utterance);
        modalTTSActive = true;
        if (btn) btn.classList.add('border-brand-600', 'bg-brand-50', 'text-brand-600');
        if (label) label.textContent = 'Berhenti';
    }
}

/** Initialize modal: build scaffold + event delegation on feed */
function initReportDetailModal() {
    buildModalScaffold();

    const feed = document.getElementById('feed-aspirasi');
    if (feed) {
        feed.addEventListener('click', (e) => {
            // Ignore clicks on upvote buttons (handled separately)
            if (e.target.closest('.btn-upvote')) return;
            // Ignore listen buttons
            if (e.target.closest('.btn-listen')) return;

            const card = e.target.closest('article[id]');
            if (!card) return;
            openReportDetailModal(card.id);
        });
    }

    // Overlay click to close
    document.getElementById('modal-detail-laporan')
        ?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-detail-laporan')) {
                closeReportDetailModal();
            }
        });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('modal-detail-laporan')?.classList.contains('visible')) {
            closeReportDetailModal();
        }
    });
}

