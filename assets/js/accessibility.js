/**
 * Aspirasi-Kita - Portal Pengaduan Sosial & Fasilitas Publik
 * Accessibility Support Logic
 * Phase 1: Foundations
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Accessibility Engine initialized.');
    
    // Initialize accessibility features
    initAccessibilityPanel();
    initSmartProfiles();
    initTextResizer();
    initContentAdjuster();
    initColorDisplayAdjuster();
    initAssistiveTools();
});

/**
 * 0. CONTROLLER PANEL AKSESIBILITAS
 * Mengatur buka-tutup panel samping (aside) kontrol aksesibilitas.
 */
function initAccessibilityPanel() {
    const toggleBtn = document.getElementById('btn-panel-aksesibilitas');
    const panel = document.getElementById('panel-aksesibilitas');
    const closeBtn = document.getElementById('btn-close-panel');
    
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.classList.contains('hidden');
            if (isHidden) {
                panel.classList.remove('hidden');
                panel.setAttribute('aria-hidden', 'false');
                closeBtn?.focus();
            } else {
                panel.classList.add('hidden');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
            panel.setAttribute('aria-hidden', 'true');
            toggleBtn?.focus();
        });
    }
}

/**
 * 1. PROFIL AKSESIBILITAS CERDAS
 * Mengaktifkan kumpulan pengaturan otomatis berdasarkan tipe kebutuhan pengguna.
 * - ADHD Friendly (fokus tinggi, kurangi distraksi)
 * - Blindness/Low Vision Friendly (menyalakan screen reader & kontras tinggi)
 * - Cognitive Disability Friendly (bantuan visual dan jarak teks luas)
 * - Motor Disability Friendly (fokus navigasi keyboard terperinci)
 */
function initSmartProfiles() {
    const profileSelect = document.getElementById('select-profil-cerdas');
    
    if (profileSelect) {
        profileSelect.addEventListener('change', (e) => {
            const selectedProfile = e.target.value;
            console.log(`Mengaktifkan Profil Aksesibilitas: ${selectedProfile}`);
            
            // Reset semua settingan ke normal terlebih dahulu
            resetAllAccessibilitySettings();
            
            switch (selectedProfile) {
                case 'adhd':
                    // ADHD: Mengaktifkan penuntun membaca (reading guide) & menyembunyikan animasi/gambar distraksi
                    setReadingGuide(true);
                    setMuteAnimations(true);
                    break;
                case 'low-vision':
                    // Low Vision: Kontras tinggi & Teks besar (skala 3)
                    setHighContrast(true);
                    setTextScale(3);
                    break;
                case 'cognitive':
                    // Kognitif: Sorot tautan, perlebar jarak teks
                    setHighlightLinks(true);
                    setSpacedText(true);
                    break;
                case 'motor-navigation':
                    // Motorik: Perjelas fokus keyboard & navigasi bantuan
                    setEnhancedFocus(true);
                    break;
                default:
                    console.log('Profil standar digunakan (Reset).');
                    break;
            }
        });
    }
}

/**
 * 2. PENGATURAN UKURAN TEKS
 * Mengubah skala teks global (body font size) demi kenyamanan pembacaan.
 */
let currentTextScale = 1; // Default skala teks (1-5)
function initTextResizer() {
    const btnIncrease = document.getElementById('btn-increase-text');
    const btnDecrease = document.getElementById('btn-decrease-text');
    
    if (btnIncrease && btnDecrease) {
        btnIncrease.addEventListener('click', () => {
            if (currentTextScale < 5) {
                currentTextScale++;
                setTextScale(currentTextScale);
            }
        });
        
        btnDecrease.addEventListener('click', () => {
            if (currentTextScale > 1) {
                currentTextScale--;
                setTextScale(currentTextScale);
            }
        });
    }
}

function setTextScale(scale) {
    console.log(`Mengubah Skala Teks: ${scale}`);
    
    // Hapus kelas skala sebelumnya dari tag body
    document.body.classList.forEach(className => {
        if (className.startsWith('text-scale-')) {
            document.body.classList.remove(className);
        }
    });
    
    // Tambah kelas skala yang baru
    document.body.classList.add(`text-scale-${scale}`);
}

/**
 * 3. PENYESUAIAN KONTEN
 * Menambahkan visual aid seperti menyorot link, merenggangkan teks, dan meredam animasi.
 */
function initContentAdjuster() {
    const chkHighlightLinks = document.getElementById('chk-highlight-links');
    const chkSpacedText = document.getElementById('chk-spaced-text');
    const chkMuteAnimations = document.getElementById('chk-mute-animations');
    
    chkHighlightLinks?.addEventListener('change', (e) => setHighlightLinks(e.target.checked));
    chkSpacedText?.addEventListener('change', (e) => setSpacedText(e.target.checked));
    chkMuteAnimations?.addEventListener('change', (e) => setMuteAnimations(e.target.checked));
}

function setHighlightLinks(enabled) {
    document.body.classList.toggle('accessibility-highlight-links', enabled);
    console.log(`Tampilkan Sorotan Tautan: ${enabled}`);
}

function setSpacedText(enabled) {
    document.body.classList.toggle('accessibility-spaced-text', enabled);
    console.log(`Jarak Teks Renggang: ${enabled}`);
}

function setMuteAnimations(enabled) {
    document.body.classList.toggle('accessibility-mute-animations', enabled);
    console.log(`Redam Animasi & Distraksi: ${enabled}`);
}

/**
 * 4. WARNA TAMPILAN (DISPLAY COLOR MODE)
 * Memicu skema warna aksesibilitas: Monochrome (Hitam Putih) dan High Contrast.
 * Catatan: Sesuai arahan, FITUR GELAP TIDAK DIIMPLEMENTASIKAN.
 */
function initColorDisplayAdjuster() {
    const btnMonochrome = document.getElementById('btn-color-monochrome');
    const btnHighContrast = document.getElementById('btn-color-highcontrast');
    const btnResetColor = document.getElementById('btn-color-reset');
    
    btnMonochrome?.addEventListener('click', () => {
        setMonochrome(true);
        setHighContrast(false);
    });
    
    btnHighContrast?.addEventListener('click', () => {
        setHighContrast(true);
        setMonochrome(false);
    });
    
    btnResetColor?.addEventListener('click', () => {
        setHighContrast(false);
        setMonochrome(false);
    });
}

function setMonochrome(enabled) {
    document.body.classList.toggle('accessibility-monochrome', enabled);
    console.log(`Monochrome Mode: ${enabled}`);
}

function setHighContrast(enabled) {
    document.body.classList.toggle('accessibility-high-contrast', enabled);
    console.log(`High Contrast Mode: ${enabled}`);
}

/**
 * 5. ALAT BANTU (ASSISTIVE TOOLS)
 * Fitur penunjang interaksi keyboard, membaca, dan mendengar.
 */
function initAssistiveTools() {
    const chkReadingGuide = document.getElementById('chk-reading-guide');
    const chkTextToSpeech = document.getElementById('chk-text-to-speech');
    const chkEnhancedFocus = document.getElementById('chk-enhanced-focus');
    
    chkReadingGuide?.addEventListener('change', (e) => setReadingGuide(e.target.checked));
    chkTextToSpeech?.addEventListener('change', (e) => setTextToSpeech(e.target.checked));
    chkEnhancedFocus?.addEventListener('change', (e) => setEnhancedFocus(e.target.checked));
    
    // Inisialisasi visual reading guide line penjelajah kursor
    setupReadingGuideMouseListener();
}

function setReadingGuide(enabled) {
    document.body.classList.toggle('accessibility-reading-guide', enabled);
    console.log(`Penuntun Membaca: ${enabled}`);
}

function setTextToSpeech(enabled) {
    console.log(`Pembaca Suara Cerdas (Screen Reader): ${enabled}`);
    // Implementasi SpeechSynthesis kelak akan diletakkan di sini
}

function setEnhancedFocus(enabled) {
    document.body.classList.toggle('accessibility-enhanced-focus', enabled);
    console.log(`Fokus Navigasi Keyboard Diperjelas: ${enabled}`);
}

/**
 * Logika memindahkan letak Reading Guide Line mengikuti arah kursor mouse
 */
function setupReadingGuideMouseListener() {
    // Buat elemen visual garis bantu membaca jika belum ada
    let line = document.querySelector('.reading-guide-line');
    if (!line) {
        line = document.createElement('div');
        line.className = 'reading-guide-line';
        document.body.appendChild(line);
    }
    
    window.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('accessibility-reading-guide')) {
            line.style.top = `${e.clientY}px`;
        }
    });
}

/**
 * HELPER: Reset Semua Pengaturan Aksesibilitas
 */
function resetAllAccessibilitySettings() {
    console.log('Mereset semua pengaturan aksesibilitas...');
    
    // Reset Kelas Body
    document.body.className = '';
    
    // Reset State Lokals
    currentTextScale = 1;
    
    // Reset Input Controls UI jika ada
    const inputs = [
        'chk-highlight-links',
        'chk-spaced-text',
        'chk-mute-animations',
        'chk-reading-guide',
        'chk-text-to-speech',
        'chk-enhanced-focus'
    ];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.type === 'checkbox') {
            input.checked = false;
        }
    });
}
