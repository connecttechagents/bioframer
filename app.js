// ============================================
// FARMER ADVISOR - JAVASCRIPT
// Language switching, audio, forms, navigation
// ============================================

// Language Management
const LanguageManager = {
    currentLang: 'te', // Default to Telugu

    init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('farmerAdvisorLang') || 'te';
        this.setLanguage(savedLang);

        // Add event listeners to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('farmerAdvisorLang', lang);

        // Update body lang attribute
        document.body.setAttribute('lang', lang);

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update all text content
        document.querySelectorAll('.lang-text').forEach(element => {
            const text = element.getAttribute(`data-lang-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }
};

// Audio Player
const AudioPlayer = {
    currentAudio: null,

    play(audioId) {
        // Simulate audio playback (in production, use actual audio files)
        console.log(`Playing audio: ${audioId}`);

        const audioBtn = event.target.closest('.audio-btn');
        if (!audioBtn) return;

        const isPlaying = audioBtn.classList.contains('playing');

        if (isPlaying) {
            this.stop(audioBtn);
        } else {
            this.start(audioBtn);
        }
    },

    start(btn) {
        // Stop any currently playing audio
        document.querySelectorAll('.audio-btn.playing').forEach(playingBtn => {
            this.stop(playingBtn);
        });

        btn.classList.add('playing');
        btn.querySelector('span').textContent = '⏸';

        // Simulate audio duration (in production, sync with actual audio)
        setTimeout(() => {
            this.stop(btn);
        }, 45000); // 45 seconds
    },

    stop(btn) {
        btn.classList.remove('playing');
        btn.querySelector('span').textContent = '▶';
    }
};

// Crop Selection
function selectCrop(cropName) {
    // Store selected crop
    localStorage.setItem('selectedCrop', cropName);
    // Navigate to crop detail page
    window.location.href = `crop-detail.html?crop=${cropName}`;
}

// Tab Management
const TabManager = {
    init() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    },

    switchTab(tabId) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
    }
};

// Form Handling
const FormHandler = {
    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        });
    },

    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form submitted:', data);

        // Show success message
        this.showMessage('success', 'మీ సమాచారం విజయవంతంగా పంపబడింది!');

        // Reset form
        form.reset();

        // In production, send data to server
        // fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })
    },

    showMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background-color: ${type === 'success' ? '#4CAF50' : '#EF5350'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
};

// Image Upload Handler
const ImageUploader = {
    init() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        });

        // Drag and drop support
        const dropZones = document.querySelectorAll('.file-upload');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.borderColor = 'var(--color-primary)';
            });

            zone.addEventListener('dragleave', () => {
                zone.style.borderColor = 'var(--color-bg-secondary)';
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.borderColor = 'var(--color-bg-secondary)';
                const files = e.dataTransfer.files;
                this.handleFiles(files);
            });
        });
    },

    handleFileSelect(event) {
        const files = event.target.files;
        this.handleFiles(files);
    },

    handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('దయచేసి చిత్రం మాత్రమే ఎంచుకోండి');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('చిత్రం పరిమాణం 5MB కంటే తక్కువగా ఉండాలి');
            return;
        }

        // Show preview
        this.showPreview(file);
    },

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 12px; margin-top: 16px;">
                `;
            }
        };
        reader.readAsDataURL(file);
    }
};

// WhatsApp Integration
function openWhatsApp(message) {
    const phoneNumber = '919985486645'; // Replace with actual WhatsApp Business number
    const lang = LanguageManager.currentLang;

    const messages = {
        te: 'నా పంట సమస్యకు సహాయం కావాలి',
        hi: 'मुझे अपनी फसल की समस्या में मदद चाहिए',
        en: 'I need help with my crop problem'
    };

    const defaultMessage = message || messages[lang] || messages.te;
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// Problem Finder
const ProblemFinder = {
    symptoms: {
        yellowing: {
            te: 'ఆకులు పసుపు రంగులోకి మారడం',
            hi: 'पत्तियां पीली हो रही हैं',
            en: 'Leaves turning yellow',
            solutions: ['nitrogen-deficiency', 'water-stress']
        },
        curl: {
            te: 'ఆకులు ముడుచుకోవడం',
            hi: 'पत्तियां मुड़ रही हैं',
            en: 'Leaf curling',
            solutions: ['virus-attack', 'pest-damage']
        },
        drop: {
            te: 'పువ్వులు రాలడం',
            hi: 'फूल गिर रहे हैं',
            en: 'Flower dropping',
            solutions: ['nutrient-deficiency', 'temperature-stress']
        }
    },

    findSolution(symptom) {
        const symptomData = this.symptoms[symptom];
        if (!symptomData) return;

        // Store selected symptom
        localStorage.setItem('selectedSymptom', symptom);

        // Navigate to solution page
        window.location.href = `problem-finder.html?symptom=${symptom}`;
    }
};

// Voice Assistant (Text-to-Speech)
const VoiceAssistant = {
    enabled: true,
    voices: [],

    init() {
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech not supported in this browser');
            return;
        }

        // Initialize voices (voices are loaded asynchronously)
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }

        this.attachListeners();
    },

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        console.log(`Loaded ${this.voices.length} voices`);
    },

    attachListeners() {
        // Select all interactive elements
        const selector = 'button, a, input, select, textarea, .crop-card, .card, [role="button"]';
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            // Remove existing listeners to avoid duplicates if re-initialized
            el.removeEventListener('mouseenter', this.handleMouseEnter);
            el.removeEventListener('mouseleave', this.handleMouseLeave);

            el.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
            el.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
    },

    handleMouseEnter(e) {
        if (!this.enabled) return;

        // Stop any current speech before starting new
        this.cancel();

        const target = e.currentTarget; // Use currentTarget to get the main element (e.g., button, card)
        const text = this.getTargetText(target);

        if (text) {
            // Small delay to prevent reading if user just passes over quickly
            this.speakTimeout = setTimeout(() => {
                this.speak(text);
            }, 200);
        }
    },

    handleMouseLeave(e) {
        if (this.speakTimeout) {
            clearTimeout(this.speakTimeout);
            this.speakTimeout = null;
        }
        this.cancel();
    },

    getTargetText(element) {
        // 1. Try aria-label first
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }

        // 2. For custom cards, look for specific text elements
        // This is specific to our card structure to give better context
        if (element.classList.contains('crop-card')) {
            const nameEl = element.querySelector('.crop-name span');
            return nameEl ? nameEl.textContent : '';
        }

        // 3. Try finding specific lang-text span inside
        const currentLang = LanguageManager.currentLang;
        // Try finding the text specifically for the current language if it's hidden/swapped? 
        // Current implementation swaps textContent of .lang-text elements, so innerText should be correct.

        return element.innerText || element.textContent;
    },

    getVoice(langCode) {
        if (this.voices.length === 0) return null;

        // Normalize langCode (e.g., 'te' -> 'te-IN')
        // const langMap = {
        //     'te': 'te-IN',
        //     'hi': 'hi-IN',
        //     'en': 'en-IN'
        // };
        // const targetLang = langMap[langCode] || langCode;

        // Strategy:
        // 1. Exact match for full locale (if provided) or partial match for language code
        // 2. Prefer Google voices

        const voicesForLang = this.voices.filter(v => v.lang.startsWith(langCode));

        if (voicesForLang.length === 0) return null;

        // Prefer Google voices
        const googleVoice = voicesForLang.find(v => v.name.includes('Google'));
        return googleVoice || voicesForLang[0];
    },

    speak(text) {
        if (!text || !text.trim()) return;

        const currentLang = LanguageManager.currentLang;
        let langCode = 'en-IN'; // Default fallback
        if (currentLang === 'te') langCode = 'te-IN';
        if (currentLang === 'hi') langCode = 'hi-IN';

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;

        // Find best voice
        const voice = this.getVoice(currentLang); // Pass 'te', 'hi' etc directly
        if (voice) {
            utterance.voice = voice;
        }

        // Adjust rate/pitch if needed
        utterance.rate = 0.9; // Slightly slower for clarity

        speechSynthesis.speak(utterance);
    },

    cancel() {
        speechSynthesis.cancel();
    }
};

// Smooth Scroll
function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
    TabManager.init();
    FormHandler.init();
    ImageUploader.init();
    VoiceAssistant.init();

    // Add audio player click handlers
    document.querySelectorAll('.audio-btn').forEach(btn => {
        btn.addEventListener('click', () => AudioPlayer.play());
    });

    console.log('Farmer Advisor initialized');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
