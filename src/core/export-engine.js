/* ==========================================================================
   TeacherStudio Export Engine - Standalone Single HTML Generator
   v2: Per-game renderers (12 games) + profiles: standalone | canva
   Zero External Dependencies / Offline-first
   ========================================================================== */

import { ThemeEngine } from './theme-engine.js';
import { ValidationEngine } from './validation-engine.js';

export const SUPPORTED_GAME_TYPES = [
  'quiz', 'true-false', 'flashcard', 'matching', 'drag-drop', 'connect',
  'wheel', 'jigsaw', 'crossword', 'timer', 'tug-of-war', 'race'
];

export const ExportEngine = {
  getSupportedGameTypes() {
    return [...SUPPORTED_GAME_TYPES];
  },

  /** Iframe snippet để dán vào Canva Sites / website sau khi đã đăng file lên link https công khai */
  getEmbedCode(publicUrl, width = 1280, height = 720) {
    const safe = String(publicUrl || '').replace(/"/g, '&quot;');
    return `<iframe src="${safe}" width="${width}" height="${height}" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>`;
  },

  /** URL tạo QR miễn phí (dùng api.qrserver.com, chỉ cần mở link này sau khi có link game) */
  buildQrUrl(publicUrl, size = 220) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodeURIComponent(publicUrl || '');
  },

  generateStandaloneHtml(project, content, profile = 'standalone') {
    const prof = profile === 'canva' ? 'canva' : 'standalone';
    const theme = ThemeEngine.getTheme(project.themeId || 'minimal');
    const gameType = SUPPORTED_GAME_TYPES.includes(project.gameType) ? project.gameType : 'quiz';

    // Serialize an toàn: chặn </script> phá vỡ file xuất
    const projectJson = JSON.stringify(project || {}).replace(/</g, '\\u003c');
    const contentJson = JSON.stringify(content || {}).replace(/</g, '\\u003c');
    const themeJson = JSON.stringify(theme.colors || {}).replace(/</g, '\\u003c');
    const pageTitle = String(project.name || 'Tro choi hoc tap').replace(/</g, '');
    const isCanva = prof === 'canva';

    const profileCss = isCanva ? `
    html, body { width: 100%; min-height: 100%; height: auto; overflow-y: auto; overflow-x: hidden;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: transparent; margin: 0; padding: 0; display: block; }
    #standalone-root { width: 100%; min-height: 100vh; margin: 0; position: relative;
      display: flex; flex-direction: column; border-radius: 0; box-shadow: none; overflow: visible;
      background-color: var(--theme-bg, #FFFFFF); color: var(--theme-text, #242424); }
    .game-body { padding: 20px 16px 28px; }
    .game-q-text { font-size: 28px !important; line-height: 1.45 !important; }
    .game-option-btn { font-size: 19px !important; padding: 16px 18px !important; }
    .btn-lg { font-size: 20px !important; padding: 16px 32px !important; }
    .canva-badge { display: inline-flex; font-size: 12px; background: rgba(0,0,0,.06);
      padding: 4px 10px; border-radius: 9999px; margin-bottom: 8px; }
    ` : `
    html, body { width: 100%; height: 100%; overflow: hidden;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background-color: #1A1A1A; display: flex; align-items: center; justify-content: center; margin: 0; }
    #standalone-root { width: 100vw; height: 100vh; max-width: 1280px; max-height: 720px;
      aspect-ratio: 16 / 9; position: relative; display: flex; flex-direction: column;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden;
      background-color: var(--theme-bg, #FFFFFF); color: var(--theme-text, #242424); }
    @media (max-aspect-ratio: 16/9) {
      #standalone-root { width: 100vw; height: auto; min-height: 100vh; border-radius: 0; aspect-ratio: auto; }
    }
    .game-q-text { font-size: 22px; line-height: 1.4; }
    `;

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} - TeacherStudio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ${profileCss}
    .flex { display: flex; } .flex-col { display: flex; flex-direction: column; }
    .items-center { align-items: center; } .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; } .gap-1 { gap: 4px; } .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; } .font-semibold { font-weight: 600; } .text-center { text-align: center; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 10px 18px; font-size: 15px; font-weight: 600; border-radius: 8px;
      border: 1px solid transparent; cursor: pointer; transition: all 0.15s ease; }
    .btn:disabled { opacity: .5; cursor: not-allowed; }
    .btn-primary { background-color: var(--theme-primary, #3F5F55); color: #FFFFFF; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: rgba(0,0,0,0.06); color: inherit; }
    .btn-lg { padding: 14px 28px; font-size: 18px; border-radius: 9999px; }
    .btn-sm { padding: 6px 12px; font-size: 13px; }
    .badge { display: inline-flex; padding: 4px 10px; font-size: 12px; font-weight: 600;
      border-radius: 9999px; background: rgba(0,0,0,0.08); }
    .badge-primary { background: rgba(63, 95, 85, 0.15); color: var(--theme-primary, #3F5F55); }
    .badge-success { background: #EDF5F0; color: #2D5838; }
    .game-header { padding: 14px 24px; display: flex; align-items: center; justify-content: space-between;
      background: var(--theme-header-bg, rgba(255,255,255,0.95));
      border-bottom: 2px solid var(--theme-border, #E4E4DF); flex-wrap: wrap; gap: 8px; }
    .game-body { flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 24px; overflow-y: auto; }
    .game-footer { padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;
      background: var(--theme-footer-bg, rgba(255,255,255,0.95));
      border-top: 1px solid var(--theme-border, #E4E4DF); font-size: 13px; opacity: 0.85;
      flex-wrap: wrap; gap: 8px; }
    .game-q-text { font-weight: 600; text-align: center; margin-bottom: 24px; color: var(--theme-text); }
    .game-option-btn { display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 18px;
      margin-bottom: 12px; background: var(--theme-surface, #FFF);
      border: 2px solid var(--theme-border, #E4E4DF); border-radius: 10px;
      font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      text-align: left; color: inherit; min-height: 56px; }
    .game-option-btn:hover:not(:disabled) { border-color: var(--theme-primary, #3F5F55); transform: translateY(-1px); }
    .game-option-letter { width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.06);
      display: inline-flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .game-option-btn.correct { border-color: #4D7A5A !important; background: #EDF5F0 !important; color: #1E462B !important; }
    .game-option-btn.incorrect { border-color: #B45454 !important; background: #FDF1F1 !important; color: #5C1D1D !important; }
    .match-btn { padding: 14px 16px; border: 2px solid var(--theme-border); border-radius: 10px;
      background: var(--theme-surface); text-align: left; cursor: pointer; font-size: 16px; width: 100%; }
    .match-btn.matched { border-color: #4D7A5A !important; background: #EDF5F0 !important; }
    .drag-chip { padding: 10px 18px; background: var(--theme-primary); color: #FFF; font-weight: 600;
      border-radius: 8px; cursor: pointer; user-select: none; border: none; font-size: 16px; }
    .drop-box { min-height: 170px; background: var(--theme-surface); border: 2px solid var(--theme-border);
      border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
    .cross-input { padding: 10px 14px; border: 2px solid var(--theme-border); border-radius: 8px;
      font-size: 18px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; max-width: 220px; }
    .big-timer { font-size: 72px; font-weight: 700; font-family: monospace; letter-spacing: 2px;
      color: var(--theme-primary); margin-bottom: 24px; padding: 16px 36px;
      background: var(--theme-surface); border: 3px solid var(--theme-border); border-radius: 20px; }
    .q-img { max-width: 100%; border-radius: 12px; border: 2px solid var(--theme-border);
      object-fit: contain; background: #fff; display: block; margin: 0 auto 16px; }
    .gv-badge { display: inline-block; font-size: 13px; background: #FEF3C7; color: #92400E;
      border: 1px dashed #D97706; border-radius: 8px; padding: 6px 12px; margin-bottom: 12px; }
    .fs-btn { position: absolute; top: 10px; right: 10px; z-index: 50; opacity: .65;
      padding: 6px 10px; font-size: 13px; border-radius: 8px; border: 1px solid var(--theme-border);
      background: var(--theme-surface); color: inherit; cursor: pointer; }
    .fs-btn:hover { opacity: 1; }
    .flash-inner { position: relative; width: 100%; height: 100%; text-align: center;
      transition: transform 0.5s ease; transform-style: preserve-3d;
      border-radius: 16px; border: 2px solid var(--theme-border); }
    .tf-btn { padding: 32px 20px; font-size: 24px; font-weight: 700; border-radius: 16px;
      cursor: pointer; width: 100%; }
    :root { --theme-bg: ${theme.colors.bg}; --theme-surface: ${theme.colors.surface};
      --theme-text: ${theme.colors.text}; --theme-text-subtle: ${theme.colors.textSubtle};
      --theme-primary: ${theme.colors.primary}; --theme-accent: ${theme.colors.accent};
      --theme-border: ${theme.colors.border}; --theme-header-bg: ${theme.colors.headerBg};
      --theme-footer-bg: ${theme.colors.footerBg}; }
  </style>
</head>
<body>
  <div id="standalone-root"></div>
  <script>
    var project = ${projectJson};
    var content = ${contentJson};
    var themeColors = ${themeJson};
    var GAME_TYPE = ${JSON.stringify(gameType)};
    var PROFILE = ${JSON.stringify(prof)};
    var READ_ALOUD = !(project.settings && project.settings.readAloud === false);
    var TEACHER_MODE = !!((project.settings && project.settings.teacherMode) || /chedo=gv/.test(location.search));

    // Đọc to giọng Việt (Web Speech API, không cần mạng/cài thêm)
    function speak(t) {
      try {
        if (!window.speechSynthesis) return;
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(t || '').slice(0, 500));
        u.lang = 'vi-VN'; u.rate = 0.95;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
    function qImg(q, h) {
      if (!q || !q.image) return '';
      return '<img class="q-img" style="max-height:' + (h || 180) + 'px;" src="' + q.image + '" alt="Minh hoa cau hoi">';
    }
    function speakBtn(t) {
      if (!READ_ALOUD || !window.speechSynthesis) return '';
      return '<button class="btn btn-secondary btn-sm" data-speak="' + esc(t) + '" title="Doc to cau hoi">🔊 Đọc</button>';
    }
    function gvBadge(q) {
      if (!TEACHER_MODE || !q || !q.answers) return '';
      var L = String.fromCharCode(65 + (q.correctAnswer || 0));
      return '<div><span class="gv-badge">👩‍🏫 Đáp án GV: ' + L + (q.explanation ? ' — ' + esc(q.explanation) : '') + '</span></div>';
    }
    function toggleFS() {
      try {
        var el = document.getElementById('standalone-root');
        if (!document.fullscreenElement) { if (el.requestFullscreen) el.requestFullscreen(); }
        else { if (document.exitFullscreen) document.exitFullscreen(); }
      } catch (e) {}
    }

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    function norm(s) {
      return String(s || '').replace(/Đ/g, 'D').replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    function StandaloneAudio() { this.ctx = null; this.enabled = true; }
    StandaloneAudio.prototype.init = function () {
      if (!this.ctx) { var C = window.AudioContext || window.webkitAudioContext; if (C) this.ctx = new C(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(function(){});
    };
    StandaloneAudio.prototype.tone = function (f0, f1, dur, type, vol, delay) {
      if (!this.enabled) return; this.init(); if (!this.ctx) return;
      var now = this.ctx.currentTime + (delay || 0);
      var o = this.ctx.createOscillator(); var g = this.ctx.createGain();
      o.type = type || 'triangle'; o.frequency.setValueAtTime(f0, now);
      if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), now + dur);
      g.gain.setValueAtTime(vol || 0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.connect(g); g.connect(this.ctx.destination); o.start(now); o.stop(now + dur + 0.02);
    };
    StandaloneAudio.prototype.playClick = function () { this.tone(600, 300, 0.06, 'square', 0.15); };
    StandaloneAudio.prototype.playCorrect = function () {
      this.tone(659.25, 659.25, 0.35, 'triangle', 0.3, 0); this.tone(830.61, 830.61, 0.4, 'triangle', 0.3, 0.12); };
    StandaloneAudio.prototype.playWrong = function () { this.tone(220, 150, 0.25, 'sawtooth', 0.2, 0); };
    StandaloneAudio.prototype.playTick = function () { this.tone(880, 880, 0.06, 'square', 0.12, 0); };
    StandaloneAudio.prototype.playBell = function () {
      this.tone(880, 880, 0.8, 'sine', 0.3, 0); this.tone(1174.66, 1174.66, 0.9, 'sine', 0.25, 0.15); };
    StandaloneAudio.prototype.playCheer = function () {
      var seq = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < seq.length; i++) this.tone(seq[i], seq[i], 0.45, 'triangle', 0.25, i * 0.1); };
    StandaloneAudio.prototype.playWheelTick = function () { this.tone(1200, 1200, 0.04, 'square', 0.08, 0); };
    var Sound = new StandaloneAudio();

    // Canva/profile: báo chiều cao cho iframe cha để tự co giãn (Canva Sites / web nhúng)
    function notifyParent() {
      try {
        var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 480);
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'ts-resize', height: h, game: GAME_TYPE }, '*');
        }
      } catch (e) {}
    }
    if (PROFILE === 'canva') {
      window.addEventListener('load', function () { notifyParent(); setTimeout(notifyParent, 500); });
    }

    function pairsFromContent(max) {
      var qs = (content && content.questions) || [];
      var pairs = [];
      if (content && content.pairs && content.pairs.length) {
        pairs = content.pairs.slice(0, max || 6).map(function (p, i) {
          return { id: i, left: p.left, right: p.right }; });
      } else {
        pairs = qs.slice(0, max || 6).map(function (q, i) {
          var r = (q.answers && q.answers[q.correctAnswer]) || q.explanation || ('Y ' + (i + 1));
          return { id: i, left: q.question, right: r }; });
      }
      return pairs;
    }
    function wheelItems() {
      if (content && content.wheelOptions && content.wheelOptions.length) return content.wheelOptions.slice();
      var qs = (content && content.questions) || [];
      if (qs.length) return qs.map(function (q) { return q.question; });
      return ['Hoc sinh 1', 'Hoc sinh 2', 'Hoc sinh 3', 'Hoc sinh 4', 'Hoc sinh 5', 'Hoc sinh 6'];
    }
    function crosswordWords() {
      if (content && content.words && content.words.length) return content.words.slice(0, 8);
      var qs = (content && content.questions) || [];
      var words = qs.slice(0, 8).map(function (q, i) {
        var ans = (q.answers && q.answers[q.correctAnswer]) || '';
        return { id: i + 1, clue: q.question, answer: norm(ans) };
      }).filter(function (w) { return w.answer && w.answer.length >= 2 && w.answer.length <= 12; });
      if (!words.length) return [
        { id: 1, clue: 'Thu do ngan nam van hien (5 chu cai)', answer: 'HANOI' },
        { id: 2, clue: 'Mau co To quoc (2 chu cai)', answer: 'DO' },
        { id: 3, clue: 'Quoc hoa Viet Nam (3 chu cai)', answer: 'SEN' }
      ];
      return words;
    }

    document.addEventListener('DOMContentLoaded', function () {
      var root = document.getElementById('standalone-root');
      var score = 0, qIndex = 0;
      var questions = (content && content.questions) || [];

      function header(title, right) {
        return '<div class="game-header"><span class="font-semibold">' + esc(title) +
          '</span><span>' + (right || '') + '</span></div>';
      }
      function footer(left, right) {
        return '<div class="game-footer"><span>' + esc(left || 'TeacherStudio - Ban xuat doc lap') +
          '</span><span>' + esc(right || '') + '</span></div>';
      }
      function finishScreen(title, sub) {
        Sound.playCheer();
        root.innerHTML = header(project.name || 'Tro choi', '<span class="badge badge-success">Hoan thanh!</span>') +
          '<div class="game-body text-center"><div style="font-size:56px;margin-bottom:16px;">🎉</div>' +
          '<h2 style="font-size:28px;margin-bottom:12px;">' + esc(title || 'Chuc mung cac Em!') + '</h2>' +
          '<p style="font-size:18px;margin-bottom:28px;">Tong diem: <strong style="font-size:28px;color:var(--theme-primary);">' +
          score + '</strong> diem' + (sub ? '<br><span style="font-size:15px;">' + esc(sub) + '</span>' : '') + '</p>' +
          '<button class="btn btn-primary btn-lg" id="btn-restart">🔄 Choi lai tu dau</button></div>' +
          footer();
        document.getElementById('btn-restart').onclick = function () { score = 0; qIndex = 0; boot(); };
        if (PROFILE === 'canva') notifyParent();
      }
      function startScreen(startFn, note) {
        root.innerHTML = header(project.name || 'Tro choi', '<span class="badge badge-primary">' +
          esc(project.subject || 'Lop hoc') + '</span>') +
          '<div class="game-body text-center">' +
          (PROFILE === 'canva' ? '<span class="canva-badge">🎮 Game tuong tac - Bam de choi ngay trong Canva</span>' : '') +
          '<h1 style="font-size:32px;margin-bottom:16px;">' + esc(project.name || 'San sang!') + '</h1>' +
          '<p style="max-width:520px;margin-bottom:28px;font-size:16px;">' +
          esc(project.description || 'Bam nut Bat dau de tham gia.') + '</p>' +
          '<button class="btn btn-primary btn-lg" id="btn-start">▶ Bat dau tro choi</button>' +
          (note ? '<p style="margin-top:16px;font-size:13px;opacity:.7;">' + esc(note) + '</p>' : '') + '</div>' +
          footer('', questions.length + ' cau hoi');
        document.getElementById('btn-start').onclick = function () { Sound.playClick(); score = 0; qIndex = 0; startFn(); };
        if (PROFILE === 'canva') notifyParent();
      }

      /* ---- QUIZ ---- */
      function runQuiz() {
        function showQ() {
          var q = questions[qIndex];
          if (!q) { finishScreen(); return; }
          root.innerHTML = header('Quiz - Cau ' + (qIndex + 1) + ' / ' + questions.length,
            '<span>Diem: <strong>' + score + '</strong></span>') +
            '<div class="game-body" style="max-width:680px;width:100%;margin:0 auto;">' +
            qImg(q) + gvBadge(q) +
            '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="game-q-text" style="flex:1;">' + esc(q.question) + '</div>' + speakBtn(q.question) + '</div><div style="width:100%;">' +
            (q.answers || []).map(function (a, i) {
              return '<button class="game-option-btn" data-i="' + i + '"><span class="game-option-letter">' +
                String.fromCharCode(65 + i) + '</span><span>' + esc(a) + '</span></button>';
            }).join('') + '</div>' +
            (q.explanation ? '<div id="exp" style="display:none;margin-top:12px;font-size:14px;text-align:left;">' +
              '<strong>Giai thich:</strong> ' + esc(q.explanation) + '</div>' : '') + '</div>' +
            footer('Bam chuot / cham de chon - Phim 1-4');
          var btns = root.querySelectorAll('.game-option-btn');
          function answer(idx) {
            var ok = idx === q.correctAnswer;
            for (var k = 0; k < btns.length; k++) {
              btns[k].disabled = true;
              if (k === q.correctAnswer) btns[k].classList.add('correct');
              else if (k === idx) btns[k].classList.add('incorrect');
            }
            if (ok) { Sound.playCorrect(); score += (q.points || 10); }
            else Sound.playWrong();
            var e = document.getElementById('exp'); if (e && q.explanation) e.style.display = 'block';
            setTimeout(function () { qIndex++; showQ(); }, 1400);
          }
          for (var b = 0; b < btns.length; b++) {
            (function (i) { btns[i].onclick = function () { answer(i); }; })(b);
          }
          document.onkeydown = function (e) {
            var n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) answer(n - 1); };
          if (PROFILE === 'canva') notifyParent();
        }
        showQ();
      }

      /* ---- TRUE/FALSE ---- */
      function runTrueFalse() {
        function showQ() {
          var q = questions[qIndex];
          if (!q) { document.onkeydown = null; finishScreen(); return; }
          root.innerHTML = header('Menh de ' + (qIndex + 1) + ' / ' + questions.length,
            '<span>Diem: <strong>' + score + '</strong></span>') +
            '<div class="game-body text-center" style="max-width:600px;margin:0 auto;width:100%;">' +
            qImg(q) + gvBadge(q) +
            '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="game-q-text" style="flex:1;">“' + esc(q.question) + '”</div>' + speakBtn(q.question) + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;">' +
            '<button class="tf-btn" id="bT" style="border:3px solid #4D7A5A;color:#2D5838;background:rgba(77,122,90,.1);">✓ DUNG<div style="font-size:12px;font-weight:400;">(Phim 1 / ←)</div></button>' +
            '<button class="tf-btn" id="bF" style="border:3px solid #B45454;color:#872828;background:rgba(180,84,84,.1);">✗ SAI<div style="font-size:12px;font-weight:400;">(Phim 2 / →)</div></button>' +
            '</div></div>' + footer('Bam truc tiep hoac phim mui ten');
          function pick(c) {
            var ok = c === (q.correctAnswer || 0);
            document.getElementById('bT').disabled = true; document.getElementById('bF').disabled = true;
            if (ok) { Sound.playCorrect(); score += (q.points || 10); }
            else Sound.playWrong();
            setTimeout(function () { qIndex++; showQ(); }, 1000);
          }
          document.getElementById('bT').onclick = function () { pick(0); };
          document.getElementById('bF').onclick = function () { pick(1); };
          document.onkeydown = function (e) {
            if (e.key === '1' || e.key === 'ArrowLeft') pick(0);
            if (e.key === '2' || e.key === 'ArrowRight') pick(1); };
          if (PROFILE === 'canva') notifyParent();
        }
        showQ();
      }

      /* ---- FLASHCARD ---- */
      function runFlashcard() {
        var cards = questions.map(function (q) {
          return { f: q.front || q.question, img: q.image || '',
            b: q.back || ((q.answers && q.answers[q.correctAnswer]) || q.explanation || 'Dap an') }; });
        if (!cards.length) cards = [{ f: 'Chua co the hoc', b: 'Hay them cau hoi trong TeacherStudio' }];
        var idx = 0, flip = false, done = 0;
        function show() {
          var c = cards[idx]; if (!c) { document.onkeydown = null; finishScreen('Hoan thanh bo the!'); return; }
          flip = false;
          root.innerHTML = header('The ' + (idx + 1) + ' / ' + cards.length,
            '<span>Da nho: <strong>' + done + '</strong></span>') +
            '<div class="game-body text-center" style="max-width:520px;margin:0 auto;width:100%;">' +
            '<div id="fc" style="perspective:1000px;width:100%;height:260px;cursor:pointer;">' +
            '<div id="fci" class="flash-inner">' +
            '<div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--theme-surface);border-radius:16px;overflow-y:auto;">' +
            '<span class="badge badge-primary">Mat truoc</span>' +
            (c.img ? '<img class="q-img" style="max-height:100px;margin:8px auto;" src="' + c.img + '" alt="Minh hoa">' : '') +
            '<div style="font-size:20px;font-weight:600;margin-top:8px;">' + esc(c.f) + '</div></div>' +
            '<div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;transform:rotateY(180deg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:rgba(63,95,85,.1);border-radius:16px;">' +
            '<span class="badge badge-success">Mat sau</span><div style="font-size:20px;font-weight:600;margin-top:8px;">' + esc(c.b) + '</div></div>' +
            '</div></div>' +
            '<div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">' +
            '<button class="btn btn-secondary" id="bP">← Truoc</button>' +
            '<button class="btn btn-primary" id="bF">🔄 Lat the</button>' +
            '<button class="btn btn-secondary" id="bN">Sau →</button>' +
            (READ_ALOUD ? '<button class="btn btn-secondary btn-sm" data-speak="' + esc(c.f + '. ' + c.b) + '">🔊 Đọc</button>' : '') +
            '</div></div>' +
            footer('', 'Nhan ✓ khi da thuoc');
          function tg() { flip = !flip; Sound.playClick();
            document.getElementById('fci').style.transform = flip ? 'rotateY(180deg)' : 'rotateY(0deg)'; }
          document.getElementById('fc').onclick = tg; document.getElementById('bF').onclick = tg;
          document.getElementById('bP').onclick = function () { if (idx > 0) { idx--; show(); } };
          document.getElementById('bN').onclick = function () { idx++; show(); };
          if (PROFILE === 'canva') notifyParent();
        }
        document.onkeydown = function (e) {
          if (e.key === ' ') { var b = document.getElementById('bF'); if (b) b.click(); }
          if (e.key === 'ArrowRight') { var n = document.getElementById('bN'); if (n) n.click(); }
          if (e.key === 'ArrowLeft') { var p = document.getElementById('bP'); if (p) p.click(); } };
        show();
      }

      /* ---- MATCHING ---- */
      function runMatching() {
        var pairs = pairsFromContent(6);
        if (!pairs.length) { finishScreen('Chua co cap ghep'); return; }
        var left = shuffle(pairs), right = shuffle(pairs);
        var selL = null, selR = null, matched = {}, mCount = 0;
        function draw() {
          root.innerHTML = header('Ghep doi tuong ung', '<span>Da ghep: <strong>' + mCount + ' / ' + pairs.length + '</strong></span>') +
            '<div class="game-body" style="max-width:760px;margin:0 auto;width:100%;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;">' +
            '<div>' + left.map(function (p) {
              return matched[p.id] ? '<button class="match-btn matched" disabled>✓ ' + esc(p.left) + '</button>'
                : '<button class="match-btn ml" data-id="' + p.id + '"' + (selL === p.id ? ' style="border-color:var(--theme-primary);"' : '') + '>' + esc(p.left) + '</button>';
            }).join('') + '</div><div>' + right.map(function (p) {
              return matched[p.id] ? '<button class="match-btn matched" disabled>✓ ' + esc(p.right) + '</button>'
                : '<button class="match-btn mr" data-id="' + p.id + '"' + (selR === p.id ? ' style="border-color:var(--theme-primary);"' : '') + '>' + esc(p.right) + '</button>';
            }).join('') + '</div></div></div>' + footer('Chon 1 muc cot A roi chon muc cot B', score + ' diem');
          var ls = root.querySelectorAll('.ml'), rs = root.querySelectorAll('.mr');
          for (var i = 0; i < ls.length; i++) { (function (b) {
            b.onclick = function () { Sound.playClick(); selL = parseInt(b.getAttribute('data-id'), 10); check(); }; })(ls[i]); }
          for (var j = 0; j < rs.length; j++) { (function (b) {
            b.onclick = function () { Sound.playClick(); selR = parseInt(b.getAttribute('data-id'), 10); check(); }; })(rs[j]); }
          if (PROFILE === 'canva') notifyParent();
        }
        function check() {
          if (selL == null || selR == null) { draw(); return; }
          if (selL === selR) { Sound.playCorrect(); matched[selL] = true; mCount++; score += 10;
            selL = null; selR = null;
            if (mCount >= pairs.length) { setTimeout(function () { finishScreen(); }, 700); return; } }
          else { Sound.playWrong(); selL = null; selR = null; }
          draw();
        }
        draw();
      }

      /* ---- DRAG-DROP (click-to-place, cam ung + chuot) ----
         Cung logic voi preview: phuong an = ten nhom, dap an dung = nhom
         chua muc. Toi da 4 nhom, 8 muc. (Dong bo voi pairs-helper.js) */
      function dragGroups(qs) {
        qs = (qs || []).slice(0, 8);
        var ok = qs.length > 0;
        for (var i = 0; i < qs.length; i++) {
          var n = 0;
          for (var j = 0; j < ((qs[i].answers || []).length); j++) {
            if (String(qs[i].answers[j] || '').trim()) n++;
          }
          if (n < 2) ok = false;
        }
        if (!ok) return null;
        var groups = [];
        for (var a = 0; a < qs.length; a++) {
          var arr = qs[a].answers || [];
          for (var b = 0; b < arr.length; b++) {
            var nm = String(arr[b] || '').trim();
            if (nm && groups.indexOf(nm) < 0) groups.push(nm);
          }
        }
        if (groups.length < 2 || groups.length > 4) return null;
        var cats = groups.map(function (t, i) { return { id: 'cat_' + i, t: t }; });
        var items = qs.map(function (q, i) {
          var tg = String((q.answers || [])[q.correctAnswer] || '').trim();
          var gi = groups.indexOf(tg);
          if (gi < 0) gi = 0;
          return { id: i, text: q.question, cat: 'cat_' + gi };
        });
        return { cats: cats, items: items };
      }
      function runDragDrop() {
        var g = dragGroups(questions);
        var cats, items;
        if (g) { cats = g.cats; items = g.items; }
        else if (questions.length) {
          var pairs = pairsFromContent(8);
          var half = Math.max(1, Math.ceil(pairs.length / 2));
          cats = [{ id: 'A', t: 'Nhom 1' }, { id: 'B', t: 'Nhom 2' }];
          items = pairs.map(function (p, i) { return { id: p.id, text: p.left, cat: i < half ? 'A' : 'B' }; });
        }
        else { finishScreen('Chua co du lieu phan loai'); return; }
        items = shuffle(items);
        var picked = null, placed = 0;
        function draw() {
          root.innerHTML = header('Keo tha phan loai', '<span>Da xep: <strong>' + placed + ' / ' + items.length + '</strong></span>') +
            '<div class="game-body" style="max-width:760px;margin:0 auto;width:100%;gap:16px;">' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">' +
            items.filter(function (x) { return !x.done; }).map(function (x) {
              return '<button class="drag-chip" data-id="' + x.id + '"' +
                (picked === x.id ? ' style="outline:3px solid var(--theme-accent);"' : '') + '>' + esc(x.text) + '</button>';
            }).join('') + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;">' +
            cats.map(function (c) {
              var inside = items.filter(function (x) { return x.done && x.cat === c.id; })
                .map(function (x) { return '<span class="drag-chip" style="background:#4D7A5A;">✓ ' + esc(x.text) + '</span>'; }).join('');
              return '<div class="drop-box" data-cat="' + c.id + '"><div class="font-semibold" style="margin-bottom:8px;">' +
                esc(c.t) + ' (' + items.filter(function (x) { return x.cat === c.id; }).length + ' muc)</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + inside + '</div>' +
                '<button class="btn btn-secondary btn-sm" data-drop="' + c.id + '" style="margin-top:12px;">Chon nhom nay</button></div>';
            }).join('') + '</div></div>' + footer('Cham 1 the roi cham nhom dich');
          var chips = root.querySelectorAll('.drag-chip[data-id]');
          for (var i = 0; i < chips.length; i++) { (function (b) {
            b.onclick = function () { Sound.playClick(); picked = parseInt(b.getAttribute('data-id'), 10); draw(); }; })(chips[i]); }
          var drops = root.querySelectorAll('[data-drop]');
          for (var j = 0; j < drops.length; j++) { (function (b) {
            b.onclick = function () {
              if (picked == null) return;
              var cat = b.getAttribute('data-drop');
              var it = null;
              for (var k = 0; k < items.length; k++) if (items[k].id === picked) it = items[k];
              if (it && it.cat === cat) { Sound.playCorrect(); it.done = true; picked = null; placed++; score += 10;
                if (placed >= items.length) { draw(); setTimeout(function () { finishScreen(); }, 700); return; } }
              else { Sound.playWrong(); picked = null; }
              draw(); }; })(drops[j]); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      /* ---- CONNECT ---- */
      function runConnect() {
        var pairs = pairsFromContent(4);
        if (!pairs.length) { finishScreen('Chua co cap noi'); return; }
        var left = shuffle(pairs), right = shuffle(pairs);
        var sel = null, done = {}, dCount = 0;
        function draw() {
          root.innerHTML = header('Noi y tuong quan', '<span>Da noi: <strong>' + dCount + ' / ' + pairs.length + '</strong></span>') +
            '<div class="game-body" style="max-width:680px;margin:0 auto;width:100%;">' +
            '<div style="display:flex;gap:32px;width:100%;">' +
            '<div style="flex:1;display:flex;flex-direction:column;gap:10px;">' +
            left.map(function (p) { return done[p.id]
              ? '<button class="match-btn matched" disabled>● ' + esc(p.left) + '</button>'
              : '<button class="match-btn cl" data-id="' + p.id + '"' + (sel === p.id ? ' style="border-color:var(--theme-primary);"' : '') + '>● ' + esc(p.left) + '</button>'; }).join('') +
            '</div><div style="flex:1;display:flex;flex-direction:column;gap:10px;">' +
            right.map(function (p) { return done[p.id]
              ? '<button class="match-btn matched" disabled>' + esc(p.right) + ' ●</button>'
              : '<button class="match-btn cr" data-id="' + p.id + '">' + esc(p.right) + ' ●</button>'; }).join('') +
            '</div></div></div>' + footer('Chon trai truoc, phai sau', score + ' diem');
          var ls = root.querySelectorAll('.cl'), rs = root.querySelectorAll('.cr');
          for (var i = 0; i < ls.length; i++) { (function (b) {
            b.onclick = function () { Sound.playClick(); sel = parseInt(b.getAttribute('data-id'), 10); draw(); }; })(ls[i]); }
          for (var j = 0; j < rs.length; j++) { (function (b) {
            b.onclick = function () {
              if (sel == null) return;
              var r = parseInt(b.getAttribute('data-id'), 10);
              if (r === sel) { Sound.playCorrect(); done[sel] = true; dCount++; score += 15; sel = null;
                if (dCount >= pairs.length) { draw(); setTimeout(function () { finishScreen(); }, 700); return; } }
              else Sound.playWrong();
              draw(); }; })(rs[j]); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      /* ---- WHEEL ---- */
      function runWheel() {
        var list = wheelItems();
        var full = list.slice(), ang = 0, spin = false, picked = null;
        var colors = ['#3F5F55', '#D1A153', '#2F7C48', '#0284C7', '#818CF8', '#15803D', '#3B82F6', '#DC2626', '#D97706', '#9E4B37'];
        function draw() {
          root.innerHTML = header('Vong quay may man', '<span>Con lai: <strong>' + list.length + '</strong></span>') +
            '<div class="game-body text-center"><div style="position:relative;width:320px;height:320px;">' +
            '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);border-left:14px solid transparent;border-right:14px solid transparent;border-top:24px solid #B45454;z-index:5;"></div>' +
            '<canvas id="wc" width="320" height="320" style="border-radius:50%;border:4px solid #fff;"></canvas>' +
            '<button id="wGo" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:68px;border-radius:50%;background:var(--theme-primary);color:#fff;font-weight:700;border:4px solid #fff;cursor:pointer;">QUAY</button></div>' +
            '<div id="wRes" style="margin-top:16px;font-size:20px;font-weight:700;min-height:32px;">' +
            (picked ? '🎉 Ket qua: ' + esc(picked) : '') + '</div>' +
            '<div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;justify-content:center;">' +
            '<button class="btn btn-primary btn-lg" id="wSpin">🎯 Quay ngay!</button>' +
            (picked ? '<button class="btn btn-secondary" id="wDel">✕ Bo muc nay</button>' : '') + '</div></div>' +
            footer('Nhan QUAY hoac phim Space', '');
          paint();
          document.getElementById('wGo').onclick = doSpin;
          document.getElementById('wSpin').onclick = doSpin;
          var d = document.getElementById('wDel');
          if (d) d.onclick = function () { list = list.filter(function (x) { return x !== picked; }); picked = null; draw(); };
          document.onkeydown = function (e) { if (e.key === ' ') doSpin(); };
          if (PROFILE === 'canva') notifyParent();
        }
        function paint() {
          var c = document.getElementById('wc'); if (!c) return;
          var x = c.getContext('2d'), n = Math.max(1, list.length), arc = Math.PI * 2 / n;
          x.clearRect(0, 0, 320, 320);
          for (var i = 0; i < n; i++) {
            var a = ang + i * arc;
            x.beginPath(); x.fillStyle = colors[i % colors.length];
            x.moveTo(160, 160); x.arc(160, 160, 160, a, a + arc); x.lineTo(160, 160); x.fill();
            x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
            x.save(); x.translate(160, 160); x.rotate(a + arc / 2);
            x.fillStyle = '#fff'; x.font = 'bold 13px system-ui,sans-serif'; x.textAlign = 'right';
            x.fillText(String(list[i]).substring(0, 16), 140, 5); x.restore();
          }
        }
        function doSpin() {
          if (spin || !list.length) return; spin = true; Sound.playClick();
          document.getElementById('wRes').textContent = 'Dang quay... 🌀';
          var from = ang, to = from + (4 + Math.random() * 4) * Math.PI * 2 + Math.random() * Math.PI * 2;
          var t0 = performance.now(), D = 3800, last = from, slice = Math.PI * 2 / list.length;
          function fr(t) {
            var p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3);
            ang = from + (to - from) * e;
            if (Math.abs(ang - last) >= slice) { Sound.playWheelTick(); last = ang; }
            paint();
            if (p < 1) requestAnimationFrame(fr);
            else { spin = false; Sound.playCheer();
              var na = (1.5 * Math.PI - (ang % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
              picked = list[Math.floor(na / slice) % list.length];
              score += 10; draw(); }
          }
          requestAnimationFrame(fr);
        }
        list = full.slice(); draw();
      }

      /* ---- JIGSAW ---- */
      function runJigsaw() {
        var qs = questions.length ? questions : [
          { question: 'Mat troi moc huong nao?', answers: ['Dong', 'Tay', 'Nam', 'Bac'], correctAnswer: 0 },
          { question: 'Thu do Viet Nam?', answers: ['Ha Noi', 'Hue', 'Da Nang', 'Can Tho'], correctAnswer: 0 },
          { question: 'So lien sau 99?', answers: ['100', '98', '101', '90'], correctAnswer: 0 },
          { question: '1 tuan may ngay?', answers: ['7', '5', '6', '8'], correctAnswer: 0 }];
        var open = {}, n = 0, qi = 0, total = 4;
        function draw() {
          var q = qs[qi];
          if (!q || n >= total) { document.onkeydown = null; finishScreen('Da mo het buc tranh bi mat!'); return; }
          root.innerHTML = header('Manh ghep bi mat', '<span>Da mo: <strong>' + n + ' / ' + total + '</strong></span>') +
            '<div class="game-body" style="display:flex;gap:24px;align-items:center;justify-content:center;width:100%;max-width:840px;flex-wrap:wrap;">' +
            '<div style="position:relative;width:280px;height:280px;border-radius:12px;overflow:hidden;flex-shrink:0;background:linear-gradient(135deg,#1E3A8A,#3B82F6,#10B981);">' +
            '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:20px;">' +
            '<div style="font-size:60px;">🌟</div><div style="font-size:18px;font-weight:700;">HOC TAP TOT</div></div>' +
            '<div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2px;">' +
            [0, 1, 2, 3].map(function (i) {
              return '<div style="background:var(--theme-surface);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;' +
                (open[i] ? 'opacity:0;pointer-events:none;' : '') + '">' + (i + 1) + '</div>'; }).join('') +
            '</div></div>' +
            '<div style="flex:1;min-width:260px;background:var(--theme-surface);padding:20px;border-radius:12px;border:1px solid var(--theme-border);">' +
            qImg(q, 140) + gvBadge(q) +
            '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="game-q-text" style="font-size:18px;flex:1;">' + esc(q.question) + '</div>' + speakBtn(q.question) + '</div>' +
            (q.answers || []).map(function (a, i) {
              return '<button class="game-option-btn" data-i="' + i + '"><span class="game-option-letter">' +
                String.fromCharCode(65 + i) + '</span><span>' + esc(a) + '</span></button>'; }).join('') +
            '</div></div>' + footer('Tra loi dung de mo manh ghep');
          var bs = root.querySelectorAll('.game-option-btn');
          for (var k = 0; k < bs.length; k++) { (function (i) {
            bs[i].onclick = function () {
              if (i === q.correctAnswer) { Sound.playCorrect(); bs[i].classList.add('correct');
                open[n] = true; n++; score += 15;
                setTimeout(function () { qi++; draw(); }, 800); }
              else { Sound.playWrong(); bs[i].classList.add('incorrect'); } }; })(k); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      /* ---- CROSSWORD (dùng đáp án đúng của GV, không còn chữ cứng) ---- */
      function runCrossword() {
        var words = crosswordWords(), solved = {}, sCount = 0;
        function draw() {
          root.innerHTML = header('Giai o chu vui', '<span>Da giai: <strong>' + sCount + ' / ' + words.length + '</strong></span>') +
            '<div class="game-body" style="max-width:680px;margin:0 auto;width:100%;gap:12px;">' +
            words.map(function (w, i) {
              return '<div style="padding:14px;border:2px solid ' + (solved[w.id] ? '#4D7A5A' : 'var(--theme-border)') +
                ';border-radius:10px;background:var(--theme-surface);width:100%;">' +
                '<div class="font-semibold" style="margin-bottom:8px;">Hang ' + (i + 1) + ': ' + esc(w.clue) + '</div>' +
                '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
                '<input class="cross-input" data-id="' + w.id + '" maxlength="' + w.answer.length + '" placeholder="' +
                w.answer.length + ' ky tu"' + (solved[w.id] ? ' value="' + esc(w.answer) + '" disabled' : '') + '>' +
                '<button class="btn btn-primary btn-sm" data-check="' + w.id + '"' + (solved[w.id] ? ' disabled' : '') + '>' +
                (solved[w.id] ? '✓ Da giai' : 'Kiem tra') + '</button></div></div>'; }).join('') +
            '</div>' + footer('Nhap khong dau, in hoa', score + ' diem');
          var cs = root.querySelectorAll('[data-check]');
          for (var i = 0; i < cs.length; i++) { (function (b) {
            b.onclick = function () {
              var id = parseInt(b.getAttribute('data-check'), 10), w = null;
              for (var k = 0; k < words.length; k++) if (words[k].id === id) w = words[k];
              var inp = root.querySelector('.cross-input[data-id="' + id + '"]');
              if (!w || !inp) return;
              if (norm(inp.value) === w.answer) { Sound.playCorrect(); solved[id] = true; sCount++; score += 20;
                if (sCount >= words.length) { draw(); setTimeout(function () { finishScreen(); }, 700); return; }
                draw(); }
              else { Sound.playWrong(); inp.style.borderColor = '#B45454'; } }; })(cs[i]); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      /* ---- TIMER ---- */
      function runTimer() {
        var total = (project.settings && project.settings.timerSeconds) || 180;
        var left = total, run = false, tick = null;
        function fmt(s) { var m = Math.floor(s / 60), ss = s % 60;
          return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; }
        root.innerHTML = header('Dong ho dem nguoc', '<span>' + esc(project.name || '') + '</span>') +
          '<div class="game-body text-center"><div class="big-timer" id="tD">' + fmt(left) + '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;">' +
          [60, 120, 180, 300, 600].map(function (s) {
            return '<button class="btn btn-secondary btn-sm" data-t="' + s + '">' + (s / 60) + ' phut</button>'; }).join('') +
          '</div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
          '<button class="btn btn-primary btn-lg" id="tGo">▶ Bat dau</button>' +
          '<button class="btn btn-secondary btn-lg" id="tRs">🔄 Dat lai</button></div></div>' +
          footer('Chuong reo khi het gio');
        var d = document.getElementById('tD'), go = document.getElementById('tGo');
        function stop() { if (tick) { clearInterval(tick); tick = null; } }
        go.onclick = function () {
          run = !run; Sound.playClick(); go.innerHTML = run ? '⏸ Tam dung' : '▶ Tiep tuc';
          stop();
          if (run) tick = setInterval(function () {
            if (left > 0) { left--; d.textContent = fmt(left);
              if (left <= 10) { d.style.color = '#B45454'; Sound.playTick(); } }
            else { stop(); run = false; Sound.playBell(); d.textContent = 'HET GIO! 🔔'; go.innerHTML = '▶ Bat dau lai'; }
          }, 1000);
        };
        document.getElementById('tRs').onclick = function () { stop(); run = false; left = total;
          d.textContent = fmt(left); d.style.color = ''; go.innerHTML = '▶ Bat dau'; };
        var ps = root.querySelectorAll('[data-t]');
        for (var i = 0; i < ps.length; i++) { (function (b) {
          b.onclick = function () { stop(); run = false; total = parseInt(b.getAttribute('data-t'), 10);
            left = total; d.textContent = fmt(left); d.style.color = ''; go.innerHTML = '▶ Bat dau'; }; })(ps[i]); }
        if (PROFILE === 'canva') notifyParent();
      }

      /* ---- TUG OF WAR ---- */
      function runTug() {
        var qs = questions.length ? questions : [
          { question: '12 x 5 = ?', answers: ['50', '60', '70', '55'], correctAnswer: 1 },
          { question: 'So nguyen to nho nhat?', answers: ['1', '2', '3', '0'], correctAnswer: 1 }];
        var qi = 0, rope = 0, team = 'blue';
        function draw() {
          if (qi >= qs.length || Math.abs(rope) >= 50) {
            var w = rope < 0 ? 'DOI XANH 🔵' : (rope > 0 ? 'DOI DO 🔴' : 'HOA NHAU 🤝');
            Sound.playCheer();
            root.innerHTML = header('Keo co hoan tat!', '<span class="badge badge-success">Ket thuc</span>') +
              '<div class="game-body text-center"><div style="font-size:64px;">🏆</div>' +
              '<h2 style="font-size:28px;margin:12px 0;">CHIEN THANG: ' + w + '</h2>' +
              '<button class="btn btn-primary btn-lg" id="bR">🔄 Hiep moi</button></div>' + footer();
            document.getElementById('bR').onclick = function () { qi = 0; rope = 0; team = 'blue'; score = 0; draw(); };
            return;
          }
          var q = qs[qi], tn = team === 'blue' ? 'DOI XANH' : 'DOI DO';
          var tc = team === 'blue' ? '#2563EB' : '#DC2626';
          root.innerHTML = header('Keo co dong doi', '<span class="badge" style="background:' + tc + ';color:#fff;">LUOT: ' + tn + '</span>') +
            '<div class="game-body" style="max-width:800px;margin:0 auto;width:100%;">' +
            '<div style="width:100%;height:90px;background:var(--theme-surface);border:2px solid var(--theme-border);border-radius:16px;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:20px;overflow:hidden;">' +
            '<div style="position:absolute;width:2px;height:100%;background:#94A3B8;left:50%;"></div>' +
            '<div style="position:absolute;left:16px;font-weight:700;color:#2563EB;">🏁 XANH</div>' +
            '<div style="position:absolute;right:16px;font-weight:700;color:#DC2626;">DO 🏁</div>' +
            '<div style="position:absolute;width:70%;height:8px;background:#B45309;border-radius:4px;left:15%;"></div>' +
            '<div style="position:absolute;left:calc(50% + ' + (rope * 3) + 'px);width:28px;height:28px;background:#FBBF24;border:3px solid #78350F;border-radius:50%;transform:translateX(-50%);transition:left .5s;">🎀</div></div>' +
            '<div style="width:100%;background:var(--theme-surface);border:2px solid var(--theme-border);border-radius:12px;padding:20px;text-align:center;">' +
            '<div style="color:' + tc + ';font-weight:700;margin-bottom:8px;">' + tn + ' tra loi:</div>' +
            qImg(q, 140) + gvBadge(q) +
            '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="game-q-text" style="font-size:20px;flex:1;">' + esc(q.question) + '</div>' + speakBtn(q.question) + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            (q.answers || []).map(function (a, i) {
              return '<button class="game-option-btn" data-i="' + i + '"><span class="game-option-letter">' +
                String.fromCharCode(65 + i) + '</span><span>' + esc(a) + '</span></button>'; }).join('') +
            '</div></div></div>' + footer('Dung keo 20 buoc ve doi minh');
          var bs = root.querySelectorAll('.game-option-btn');
          for (var k = 0; k < bs.length; k++) { (function (i) {
            bs[i].onclick = function () {
              if (i === q.correctAnswer) { Sound.playCorrect(); bs[i].classList.add('correct');
                rope += (team === 'blue' ? -20 : 20); score += 10; }
              else { Sound.playWrong(); bs[i].classList.add('incorrect'); }
              team = team === 'blue' ? 'red' : 'blue'; qi++;
              setTimeout(draw, 900); }; })(k); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      /* ---- RACE ---- */
      function runRace() {
        var qs = questions.length ? questions : [{ question: 'Mau co To quoc?', answers: ['Do', 'Xanh', 'Vang', 'Trang'], correctAnswer: 0 }];
        var qi = 0, prog = 0;
        function draw() {
          var q = qs[qi];
          if (!q || prog >= 100) { finishScreen('Ve dich! 🏁', 'Hoan thanh duong dua'); return; }
          root.innerHTML = header('Dua xe toc do', '<span>Quang duong: <strong>' + prog + '%</strong></span>') +
            '<div class="game-body" style="max-width:800px;margin:0 auto;width:100%;">' +
            '<div style="width:100%;height:80px;background:#334155;border-radius:12px;position:relative;overflow:hidden;margin-bottom:20px;border:3px solid #1E293B;">' +
            '<div style="position:absolute;top:50%;left:0;right:0;border-top:2px dashed #CBD5E1;"></div>' +
            '<div style="position:absolute;right:12px;top:0;bottom:0;width:14px;background:repeating-linear-gradient(45deg,#000,#000 6px,#fff 6px,#fff 12px);"></div>' +
            '<div style="position:absolute;left:' + Math.min(88, prog) + '%;top:50%;transform:translateY(-50%);font-size:32px;transition:left .6s;">🏎️</div></div>' +
            '<div style="background:var(--theme-surface);border:2px solid var(--theme-border);border-radius:12px;padding:20px;text-align:center;width:100%;">' +
            qImg(q, 140) + gvBadge(q) +
            '<div style="display:flex;gap:8px;align-items:flex-start;"><div class="game-q-text" style="font-size:19px;flex:1;">' + esc(q.question) + '</div>' + speakBtn(q.question) + '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            (q.answers || []).map(function (a, i) {
              return '<button class="game-option-btn" data-i="' + i + '"><span class="game-option-letter">' +
                String.fromCharCode(65 + i) + '</span><span>' + esc(a) + '</span></button>'; }).join('') +
            '</div></div></div>' + footer('Dung +25% quang duong');
          var bs = root.querySelectorAll('.game-option-btn');
          for (var k = 0; k < bs.length; k++) { (function (i) {
            bs[i].onclick = function () {
              if (i === q.correctAnswer) { Sound.playCorrect(); bs[i].classList.add('correct'); prog += 25; score += 20; }
              else { Sound.playWrong(); bs[i].classList.add('incorrect'); }
              qi++; setTimeout(draw, 850); }; })(k); }
          if (PROFILE === 'canva') notifyParent();
        }
        draw();
      }

      function boot() {
        document.onkeydown = null;
        // Ủy quyền 1 nơi: mọi nút [data-speak] trong game đều đọc to
        root.addEventListener('click', function (e) {
          var b = e.target && e.target.closest ? e.target.closest('[data-speak]') : null;
          if (b) { e.stopPropagation(); speak(b.getAttribute('data-speak')); }
        });
        // Nút toàn màn hình nổi (máy chiếu lớp học) + phím F — nằm ngoài root nên không bị xóa khi chuyển câu
        var fs = document.createElement('button');
        fs.innerHTML = '⛶ Toàn màn hình'; fs.title = 'Toàn màn hình (phím F)';
        fs.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:9999;opacity:.7;padding:8px 14px;font-size:13px;font-weight:600;border-radius:8px;border:1px solid #ccc;background:#fff;cursor:pointer;';
        fs.onmouseover = function () { fs.style.opacity = '1'; };
        fs.onmouseout = function () { fs.style.opacity = '.7'; };
        fs.onclick = function (e) { e.stopPropagation(); toggleFS(); };
        document.body.appendChild(fs);
        document.addEventListener('keydown', function (e) {
          if ((e.key === 'f' || e.key === 'F') && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) toggleFS();
        });
        if (GAME_TYPE === 'timer') { startScreen(runTimer, 'Khong can bo cau hoi'); return; }
        if (GAME_TYPE === 'wheel') { startScreen(runWheel, 'Quay goi ten / quay cau hoi'); return; }
        if (GAME_TYPE === 'flashcard') { startScreen(runFlashcard); return; }
        if (GAME_TYPE === 'matching') { startScreen(runMatching); return; }
        if (GAME_TYPE === 'drag-drop') { startScreen(runDragDrop); return; }
        if (GAME_TYPE === 'connect') { startScreen(runConnect); return; }
        if (GAME_TYPE === 'jigsaw') { startScreen(runJigsaw); return; }
        if (GAME_TYPE === 'crossword') { startScreen(runCrossword); return; }
        if (GAME_TYPE === 'tug-of-war') { startScreen(runTug); return; }
        if (GAME_TYPE === 'race') { startScreen(runRace); return; }
        if (GAME_TYPE === 'true-false') { startScreen(runTrueFalse); return; }
        startScreen(runQuiz);
      }
      boot();
    });
  </script>
</body>
</html>`;
  },

  validateBeforeExport(project, content) {
    return ValidationEngine.validateProjectForExport(project, content);
  },

  downloadStandaloneHtml(project, content, profile = 'standalone') {
    const prof = profile === 'canva' ? 'canva' : 'standalone';
    const htmlContent = this.generateStandaloneHtml(project, content, prof);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const safeTitle = (project.name || 'Tro-Choi-TeacherStudio')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1EA0-\u1EF9]/g, '');
    const suffix = prof === 'canva' ? '_Canva-Embed' : '_Offline';
    const filename = `${safeTitle}${suffix}.html`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename, profile: prof, gameType: project.gameType };
  }
};
