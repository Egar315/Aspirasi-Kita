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
            loadComponent('header-component', 'assets/components/header.html'),
            loadComponent('hero-component', 'assets/components/hero.html'),
            loadComponent('filter-component', 'assets/components/filter.html'),
            loadComponent('accessibility-panel-component', 'assets/components/accessibility-panel.html'),
            loadComponent('footer-component', 'assets/components/footer.html')
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
async function loadComponent(elementId, filepath) {
    const container = document.getElementById(elementId);
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
                Gagal memuat komponen visual '${elementId}'. Hubungi administrator.
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
    inputElement.classList.remove('border-slate-200', 'focus:border-brand-500', 'focus:ring-brand-100');
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
    inputElement.classList.add('border-slate-200', 'focus:border-brand-500', 'focus:ring-brand-100');
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
