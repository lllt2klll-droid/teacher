/* ==========================================================================
   TeacherStudio Speech Helper - Đọc to câu hỏi bằng giọng Việt (TTS)
   Dùng Web Speech API có sẵn của trình duyệt, offline tùy máy, không cần mạng.
   ========================================================================== */

function pickViVoice() {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices ? synth.getVoices() : [];
    return voices.find(v => (v.lang || '').toLowerCase().startsWith('vi'))
      || voices.find(v => (v.lang || '').toLowerCase().includes('viet')) || null;
  } catch (e) { return null; }
}

export const Speech = {
  isSupported() {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  },

  stop() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  },

  speak(text, { lang = 'vi-VN', rate = 0.95 } = {}) {
    if (!this.isSupported()) return false;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const clean = String(text || '').replace(/["“”]/g, '').slice(0, 500);
      if (!clean.trim()) return false;
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = lang; u.rate = rate;
      const voice = pickViVoice();
      if (voice) u.voice = voice;
      synth.speak(u);
      return true;
    } catch (e) { return false; }
  }
};

// Nút loa nhỏ đặt cạnh câu hỏi. Dùng data-speak để không lẫn logic game.
export function speakButtonHtml(text, title = 'Đọc to câu hỏi') {
  if (!Speech.isSupported()) return '';
  const safe = String(text || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${safe}" title="${title}" style="flex-shrink:0;" aria-label="${title}">🔊 Đọc</button>`;
}

export function bindSpeakButtons(rootEl) {
  if (!rootEl) return;
  rootEl.querySelectorAll('.btn-speak').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      Speech.speak(btn.getAttribute('data-speak') || '');
    };
  });
}
