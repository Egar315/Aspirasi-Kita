/**
 * Aspirasi-Kita - Portal Pengaduan Sosial & Fasilitas Publik
 * Accessibility Support Logic
 * Phase 4: Javascript Accessibility System
 */

let textToSpeechActive = false;
let currentTextScale = 1; // Default skala teks (1-5)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Accessibility Engine initialized.');
    
    // Inisialisasi awal seluruh fitur aksesibilitas
    initAccessibilityPanel();
    initSmartProfiles();
    initTextResizer();
    initContentAdjuster();
    initColorDisplayAdjuster();
    initAssistiveTools();
    
    // Sinkronisasi status warna display aktif di awal (Default)
    updateColorDisplayButtons('reset');
});

// ==========================================================================
// 0. CONTROLLER PANEL AKSESIBILITAS
// ==========================================================================
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
                toggleBtn.setAttribute('aria-expanded', 'true');
                closeBtn?.focus();
            } else {
                panel.classList.add('hidden');
                panel.setAttribute('aria-hidden', 'true');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
            panel.setAttribute('aria-hidden', 'true');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.focus();
            }
        });
    }
}

// ==========================================================================
// 1. PROFIL AKSESIBILITAS CERDAS (SMART PROFILES)
// ==========================================================================
function initSmartProfiles() {
    const profileSelect = document.getElementById('select-profil-cerdas');
    
    if (profileSelect) {
        profileSelect.addEventListener('change', (e) => {
            const selectedProfile = e.target.value;
            console.log(`Mengaktifkan Profil Aksesibilitas: ${selectedProfile}`);
            
            // Reset semua settingan ke normal terlebih dahulu sebelum menerapkan profil baru
            resetAllAccessibilitySettings(false); // false agar tidak me-reset nilai dropdown profil itu sendiri
            
            switch (selectedProfile) {
                case 'adhd':
                    // ADHD: Mengaktifkan penuntun membaca (reading guide) & menyembunyikan animasi/gambar distraksi
                    setReadingGuide(true);
                    setMuteAnimations(true);
                    break;
                case 'low-vision':
                    // Low Vision: Kontras tinggi, Teks besar (skala 4), dan Kursor Besar
                    setHighContrast(true);
                    setTextScale(4);
                    setBigCursor(true);
                    break;
                case 'cognitive':
                    // Kognitif/Disleksia: Sorot semua tautan, perlebar jarak teks
                    setHighlightLinks(true);
                    setSpacedText(true);
                    break;
                case 'motor-navigation':
                    // Motorik: Perjelas fokus keyboard & Kursor Besar
                    setEnhancedFocus(true);
                    setBigCursor(true);
                    break;
                default:
                    console.log('Profil standar digunakan (Reset).');
                    break;
            }
        });
    }
}

// ==========================================================================
// 2. PENGATURAN UKURAN TEKS (TEXT RESIZER)
// ==========================================================================
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
    currentTextScale = scale;
    
    // Hapus kelas skala sebelumnya dari tag body
    document.body.classList.forEach(className => {
        if (className.startsWith('text-scale-')) {
            document.body.classList.remove(className);
        }
    });
    
    // Tambah kelas skala yang baru pada body
    document.body.classList.add(`text-scale-${scale}`);
}

// ==========================================================================
// 3. PENYESUAIAN KONTEN VISUAL
// ==========================================================================
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
    const chk = document.getElementById('chk-highlight-links');
    if (chk) chk.checked = enabled;
    console.log(`Tampilkan Sorotan Tautan: ${enabled}`);
}

// Jarak Teks Luas (Dyslexia Friendly)
function setSpacedText(enabled) {
    document.body.classList.toggle('accessibility-spaced-text', enabled);
    const chk = document.getElementById('chk-spaced-text');
    if (chk) chk.checked = enabled;
    console.log(`Jarak Teks Renggang: ${enabled}`);
}

// Redam Animasi (ADHD Friendly)
function setMuteAnimations(enabled) {
    document.body.classList.toggle('accessibility-mute-animations', enabled);
    const chk = document.getElementById('chk-mute-animations');
    if (chk) chk.checked = enabled;
    console.log(`Redam Animasi & Distraksi: ${enabled}`);
}

// ==========================================================================
// 4. WARNA TAMPILAN (COLOR MODE CONTROLS - NO DARK MODE)
// ==========================================================================
function initColorDisplayAdjuster() {
    const btnMonochrome = document.getElementById('btn-color-monochrome');
    const btnHighContrast = document.getElementById('btn-color-highcontrast');
    const btnResetColor = document.getElementById('btn-color-reset');
    
    btnMonochrome?.addEventListener('click', () => {
        setMonochrome(true);
        setHighContrast(false);
        updateColorDisplayButtons('monochrome');
    });
    
    btnHighContrast?.addEventListener('click', () => {
        setHighContrast(true);
        setMonochrome(false);
        updateColorDisplayButtons('highcontrast');
    });
    
    btnResetColor?.addEventListener('click', () => {
        setHighContrast(false);
        setMonochrome(false);
        updateColorDisplayButtons('reset');
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

// Sinkronisasi kelas CSS tombol warna yang sedang aktif
function updateColorDisplayButtons(mode) {
    const btnMonochrome = document.getElementById('btn-color-monochrome');
    const btnHighContrast = document.getElementById('btn-color-highcontrast');
    const btnResetColor = document.getElementById('btn-color-reset');
    
    if (!btnMonochrome || !btnHighContrast || !btnResetColor) return;
    
    // Reset Kelas Bawaan
    btnMonochrome.className = "px-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
    btnHighContrast.className = "px-2 py-3 bg-black text-yellow-300 border border-yellow-400 rounded-xl text-xs font-bold active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300";
    btnResetColor.className = "px-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
    
    if (mode === 'monochrome') {
        btnMonochrome.className = "px-2 py-3 bg-brand-600 text-white border-brand-600 rounded-xl text-xs font-bold shadow-md shadow-brand-100 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
    } else if (mode === 'highcontrast') {
        btnHighContrast.className = "px-2 py-3 bg-yellow-300 text-black border-yellow-300 rounded-xl text-xs font-bold shadow-md shadow-yellow-100 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300";
    } else {
        btnResetColor.className = "px-2 py-3 bg-brand-600 text-white border-brand-600 rounded-xl text-xs font-bold shadow-md shadow-brand-100 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-600";
    }
}

// ==========================================================================
// 5. ALAT BANTU (ASSISTIVE TOOLS & WEB SPEECH API TTS)
// ==========================================================================
function initAssistiveTools() {
    const chkReadingGuide = document.getElementById('chk-reading-guide');
    const chkTextToSpeech = document.getElementById('chk-text-to-speech');
    const chkEnhancedFocus = document.getElementById('chk-enhanced-focus');
    const chkBigCursor = document.getElementById('chk-big-cursor');
    
    chkReadingGuide?.addEventListener('change', (e) => setReadingGuide(e.target.checked));
    chkTextToSpeech?.addEventListener('change', (e) => setTextToSpeech(e.target.checked));
    chkEnhancedFocus?.addEventListener('change', (e) => setEnhancedFocus(e.target.checked));
    chkBigCursor?.addEventListener('change', (e) => setBigCursor(e.target.checked));
    
    // Inisialisasi garis bantu membaca kursor mouse
    setupReadingGuideMouseListener();
    
    // Inisialisasi pembaca TTS hover & focus
    setupTTSListeners();
}

function setReadingGuide(enabled) {
    document.body.classList.toggle('accessibility-reading-guide', enabled);
    const chk = document.getElementById('chk-reading-guide');
    if (chk) chk.checked = enabled;
    console.log(`Garis Bantu Membaca: ${enabled}`);
}

function setEnhancedFocus(enabled) {
    document.body.classList.toggle('accessibility-enhanced-focus', enabled);
    const chk = document.getElementById('chk-enhanced-focus');
    if (chk) chk.checked = enabled;
    console.log(`Fokus Navigasi Keyboard Diperjelas: ${enabled}`);
}

function setBigCursor(enabled) {
    document.body.classList.toggle('accessibility-big-cursor', enabled);
    const chk = document.getElementById('chk-big-cursor');
    if (chk) chk.checked = enabled;
    console.log(`Kursor Ukuran Besar: ${enabled}`);
}

// --- LOGIKA GARIS PANDU MEMBACA MOUSE ---
function setupReadingGuideMouseListener() {
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

// --- LOGIKA TEXT TO SPEECH (TTS) / SCREEN READER ---
function setTextToSpeech(enabled) {
    textToSpeechActive = enabled;
    const chk = document.getElementById('chk-text-to-speech');
    if (chk) chk.checked = enabled;
    console.log(`Pembaca Suara Cerdas (TTS) Active: ${enabled}`);
    
    if (enabled) {
        speakText("Fitur pembaca suara cerdas diaktifkan.");
    } else {
        window.speechSynthesis.cancel();
    }
}

// Fungsi utama menyuarakan teks Bahasa Indonesia
function speakText(text) {
    if (!textToSpeechActive) return;
    speakTextForcefully(text);
}

// Fungsi paksa menyuarakan teks (digunakan untuk tombol speaker manual)
function speakTextForcefully(text) {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis tidak didukung oleh browser ini.");
        return;
    }
    
    // Batalkan narasi sebelumnya yang sedang berjalan
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    // Temukan suara Bahasa Indonesia (jika ada di OS/browser)
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => voice.lang.includes('id') || voice.lang.includes('ID'));
    if (indonesianVoice) {
        utterance.voice = indonesianVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// Menghubungkan pendengar TTS hover dan focus pada dokumen
function setupTTSListeners() {
    let lastSpokenText = '';
    
    // 1. Hover mouse (mouseenter)
    document.addEventListener('mouseover', (e) => {
        if (!textToSpeechActive) return;
        
        // Cari elemen terdekat yang berisi teks informatif
        const target = e.target.closest('h1, h2, h3, p, a, button, select, label, option');
        if (!target) return;
        
        // Hindari membaca tombol dengarkan secara berulang saat menyorot judul
        if (target.classList.contains('btn-listen')) return;
        
        const textToSpeak = target.innerText || target.getAttribute('aria-label') || target.placeholder;
        if (textToSpeak && textToSpeak.trim() !== '' && textToSpeak !== lastSpokenText) {
            speakText(textToSpeak);
            lastSpokenText = textToSpeak;
        }
    });
    
    // Bersihkan pelacakan teks saat keluar dari hover
    document.addEventListener('mouseout', () => {
        lastSpokenText = '';
    });
    
    // 2. Fokus Keyboard (focusin)
    document.addEventListener('focusin', (e) => {
        if (!textToSpeechActive) return;
        
        const target = e.target;
        if (!target.matches('h1, h2, h3, p, a, button, select, input, textarea, label')) return;
        
        // Hindari membaca tombol dengarkan secara berlebih
        if (target.classList.contains('btn-listen')) return;
        
        const textToSpeak = target.innerText || target.getAttribute('aria-label') || target.placeholder;
        if (textToSpeak && textToSpeak.trim() !== '') {
            speakText(textToSpeak);
        }
    });
}

// ==========================================================================
// UTILITY: RESET SEMUA PENGATURAN AKSESIBILITAS
// ==========================================================================
function resetAllAccessibilitySettings(resetProfileDropdown = true) {
    console.log('Mereset seluruh konfigurasi aksesibilitas ke kondisi bawaan...');
    
    // Batalkan seluruh proses suara yang sedang berjalan
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    // Reset Kelas Body
    document.body.className = '';
    
    // Reset Skala Huruf Dasar
    setTextScale(1);
    
    // Reset status variabel pembaca suara
    textToSpeechActive = false;
    
    // Reset Tampilan Tombol Warna ke Default (Reset)
    updateColorDisplayButtons('reset');
    
    // Kembalikan seluruh checkbox kendali visual ke posisi belum dicentang
    const inputs = [
        'chk-highlight-links',
        'chk-spaced-text',
        'chk-mute-animations',
        'chk-reading-guide',
        'chk-text-to-speech',
        'chk-enhanced-focus',
        'chk-big-cursor'
    ];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.type === 'checkbox') {
            input.checked = false;
        }
    });
    
    // Reset Pilihan Dropdown Profil Cerdas ke "normal" (Standar) jika diminta
    if (resetProfileDropdown) {
        const profileSelect = document.getElementById('select-profil-cerdas');
        if (profileSelect) {
            profileSelect.value = 'normal';
        }
    }
}
