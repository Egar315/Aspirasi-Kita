/**
 * Aspirasi-Kita - Portal Pengaduan Sosial & Fasilitas Publik
 * Main Application Logic
 * Phase 1: Foundations
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aspirasi-Kita Main App initialized.');
    
    // Initialize components
    initReportForm();
    initCategoryFilters();
    initUpvoteSystem();
});

/**
 * 1. LOGIKA FORM PELAPORAN
 * Menangani pengumpulan data laporan pengaduan masyarakat baru.
 */
function initReportForm() {
    const reportForm = document.getElementById('form-pengaduan');
    
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Mengambil input data form
            const title = document.getElementById('input-judul')?.value;
            const category = document.getElementById('input-kategori')?.value;
            const description = document.getElementById('input-deskripsi')?.value;
            const location = document.getElementById('input-lokasi')?.value;
            
            console.log('Mengirim Laporan Baru:', { title, category, description, location });
            
            // TODO: Tambahkan validasi dan pengiriman ke backend/state lokal
            alert('Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasi Anda.');
            reportForm.reset();
            
            // Menutup modal jika form berada di dalam modal
            toggleReportModal(false);
        });
    }
}

/**
 * Membuka/Menutup Modal Formulir Laporan
 * @param {boolean} show - True untuk membuka, False untuk menutup
 */
function toggleReportModal(show) {
    const modal = document.getElementById('modal-pelaporan');
    if (modal) {
        if (show) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            // Fokus otomatis ke elemen pertama untuk aksesibilitas keyboard
            document.getElementById('input-judul')?.focus();
        } else {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    }
}

/**
 * 2. LOGIKA FILTER KATEGORI
 * Menyaring kartu pengaduan/aspirasi di feed berdasarkan kategori yang dipilih.
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.getAttribute('data-category');
            console.log(`Menyaring feed berdasarkan kategori: ${selectedCategory}`);
            
            // Update active state pada tombol
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            button.classList.remove('bg-gray-100', 'text-gray-700');
            button.classList.add('bg-indigo-600', 'text-white');
            button.setAttribute('aria-pressed', 'true');
            
            // Panggil fungsi untuk menyaring artikel
            filterArticles(selectedCategory);
        });
    });
}

/**
 * Menyembunyikan/menampilkan artikel berdasarkan filter kategori
 * @param {string} category - Kategori yang dipilih
 */
function filterArticles(category) {
    const articles = document.querySelectorAll('#feed-aspirasi article');
    
    articles.forEach(article => {
        const articleCategory = article.getAttribute('data-category');
        
        if (category === 'semua' || articleCategory === category) {
            article.classList.remove('hidden');
        } else {
            article.classList.add('hidden');
        }
    });
}

/**
 * 3. LOGIKA UPVOTE ASPIRASI
 * Menambah/mengurangi jumlah dukungan dari pengguna terhadap aspirasi tertentu.
 */
function initUpvoteSystem() {
    // Delegasi event untuk tombol upvote dinamis
    const feedContainer = document.getElementById('feed-aspirasi');
    
    if (feedContainer) {
        feedContainer.addEventListener('click', (e) => {
            const upvoteBtn = e.target.closest('.btn-upvote');
            
            if (upvoteBtn) {
                const countSpan = upvoteBtn.querySelector('.upvote-count');
                const article = upvoteBtn.closest('article');
                const articleId = article?.getAttribute('id') || 'unknown';
                
                let isUpvoted = upvoteBtn.getAttribute('aria-pressed') === 'true';
                let currentCount = parseInt(countSpan.textContent) || 0;
                
                if (isUpvoted) {
                    // Batalkan upvote
                    currentCount--;
                    upvoteBtn.setAttribute('aria-pressed', 'false');
                    upvoteBtn.classList.remove('text-indigo-600', 'bg-indigo-50');
                    upvoteBtn.classList.add('text-gray-500', 'bg-gray-50');
                } else {
                    // Berikan upvote
                    currentCount++;
                    upvoteBtn.setAttribute('aria-pressed', 'true');
                    upvoteBtn.classList.remove('text-gray-500', 'bg-gray-50');
                    upvoteBtn.classList.add('text-indigo-600', 'bg-indigo-50');
                }
                
                countSpan.textContent = currentCount;
                console.log(`Laporan ${articleId}: Upvote berubah menjadi ${currentCount}. Status: ${!isUpvoted}`);
            }
        });
    }
}
