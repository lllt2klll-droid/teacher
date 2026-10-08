/* ==========================================================================
   TeacherStudio Export Engine - Standalone Single HTML Generator
   Zero External Dependencies / Completely Self-Contained Offline File
   ========================================================================== */

import { ThemeEngine } from './theme-engine.js';
import { ValidationEngine } from './validation-engine.js';

export const ExportEngine = {
  generateStandaloneHtml(project, content, profile = 'standalone') {
    const theme = ThemeEngine.getTheme(project.themeId || 'minimal');
    const safeTitle = (project.name || 'Tro-Choi-Hoc-Tap').replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1EA0-\u1EF9 ]/g, '');
    
    // Serialized Data payload
    const projectJson = JSON.stringify(project);
    const contentJson = JSON.stringify(content);

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name || 'Trò chơi học tập'} - TeacherStudio</title>
  <style>
    /* Reset & Base */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; overflow: hidden; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background-color: #1A1A1A; display: flex; align-items: center; justify-content: center; }
    
    /* Standalone Container */
    #standalone-root {
      width: 100vw;
      height: 100vh;
      max-width: 1280px;
      max-height: 720px;
      aspect-ratio: 16 / 9;
      position: relative;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border-radius: 12px;
      overflow: hidden;
      background-color: var(--theme-bg, #FFFFFF);
      color: var(--theme-text, #242424);
    }
    @media (max-aspect-ratio: 16/9) {
      #standalone-root { width: 100vw; height: auto; border-radius: 0; }
    }

    /* Common Styles */
    .flex { display: flex; }
    .flex-col { display: flex; flex-direction: column; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-1 { gap: 4px; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .font-semibold { font-weight: 600; }
    .text-center { text-align: center; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 10px 18px; font-size: 15px; font-weight: 600; border-radius: 8px;
      border: 1px solid transparent; cursor: pointer; transition: all 0.15s ease;
    }
    .btn-primary { background-color: var(--theme-primary, #3F5F55); color: #FFFFFF; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: rgba(0,0,0,0.06); color: inherit; }
    .btn-lg { padding: 14px 28px; font-size: 18px; border-radius: 9999px; }
    .badge { display: inline-flex; padding: 4px 10px; font-size: 12px; font-weight: 600; border-radius: 9999px; background: rgba(0,0,0,0.08); }
    .badge-primary { background: rgba(63, 95, 85, 0.15); color: var(--theme-primary, #3F5F55); }
    .badge-success { background: #EDF5F0; color: #2D5838; }

    .game-header { padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; background: var(--theme-header-bg, rgba(255,255,255,0.95)); border-bottom: 2px solid var(--theme-border, #E4E4DF); }
    .game-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; overflow-y: auto; }
    .game-footer { padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; background: var(--theme-footer-bg, rgba(255,255,255,0.95)); border-top: 1px solid var(--theme-border, #E4E4DF); font-size: 13px; opacity: 0.8; }

    .game-option-btn {
      display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 18px; margin-bottom: 12px;
      background: var(--theme-surface, #FFF); border: 2px solid var(--theme-border, #E4E4DF); border-radius: 10px;
      font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.15s; text-align: left; color: inherit;
    }
    .game-option-btn:hover { border-color: var(--theme-primary, #3F5F55); transform: translateY(-1px); }
    .game-option-letter { width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.06); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .game-option-btn.correct { border-color: #4D7A5A !important; background: #EDF5F0 !important; color: #1E462B !important; }
    .game-option-btn.incorrect { border-color: #B45454 !important; background: #FDF1F1 !important; color: #5C1D1D !important; }

    /* Theme Tokens Injection */
    :root {
      --theme-bg: ${theme.colors.bg};
      --theme-surface: ${theme.colors.surface};
      --theme-text: ${theme.colors.text};
      --theme-text-subtle: ${theme.colors.textSubtle};
      --theme-primary: ${theme.colors.primary};
      --theme-accent: ${theme.colors.accent};
      --theme-border: ${theme.colors.border};
      --theme-header-bg: ${theme.colors.headerBg};
      --theme-footer-bg: ${theme.colors.footerBg};
    }
  </style>
</head>
<body>

  <div id="standalone-root"></div>

  <script>
    // Embedded Audio Synthesizer (Zero External Dependencies)
    class StandaloneAudio {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }
      init() {
        if (!this.ctx) {
          const Cls = window.AudioContext || window.webkitAudioContext;
          if (Cls) this.ctx = new Cls();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
      }
      playClick() {
        if (!this.enabled) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.05);
      }
      playCorrect() {
        if (!this.enabled) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [ { f: 659.25, t: 0 }, { f: 830.61, t: 0.12 } ].forEach(({ f, t }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0.3, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.4);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(now + t); osc.stop(now + t + 0.4);
        });
      }
      playWrong() {
        if (!this.enabled) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.25);
      }
      playCheer() {
        if (!this.enabled) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.25, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.5);
        });
      }
    }
    const Sound = new StandaloneAudio();

    // Embedded Game Data
    const project = ${projectJson};
    const content = ${contentJson};

    // Generic Standalone Game Runner
    document.addEventListener('DOMContentLoaded', () => {
      const root = document.getElementById('standalone-root');
      let score = 0;
      let qIndex = 0;
      const questions = content.questions || [];

      function showStartScreen() {
        root.innerHTML = \`
          <div class="game-header">
            <span class="font-semibold">\${project.name || 'Trò chơi'}</span>
            <span class="badge badge-primary">\${project.subject || 'Lớp học'}</span>
          </div>
          <div class="game-body text-center">
            <h1 style="font-size: 32px; margin-bottom: 16px;">\${project.name || 'Sẵn sàng!'}</h1>
            <p style="color: var(--theme-text-subtle); max-width: 480px; margin-bottom: 32px; font-size: 16px;">
              \${project.description || 'Bấm nút Bắt đầu để tham gia trò chơi.'}
            </p>
            <button class="btn btn-primary btn-lg" id="btn-start">
              ▶ Bắt đầu trò chơi
            </button>
          </div>
          <div class="game-footer">
            <span>TeacherStudio - Bản xuất độc lập</span>
            <span>\${questions.length} câu hỏi</span>
          </div>
        \`;
        document.getElementById('btn-start').onclick = () => {
          Sound.playClick();
          qIndex = 0;
          score = 0;
          showQuestion();
        };
      }

      function showQuestion() {
        const q = questions[qIndex];
        if (!q) {
          showFinishScreen();
          return;
        }

        root.innerHTML = \`
          <div class="game-header">
            <span class="badge badge-primary">Câu \${qIndex + 1} / \${questions.length}</span>
            <span style="font-size: 14px;">Điểm: <strong>\${score}</strong></span>
          </div>
          <div class="game-body" style="max-width: 680px; width: 100%; margin: 0 auto;">
            <div style="font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 28px; line-height: 1.4;">
              \${q.question}
            </div>
            <div style="width: 100%;">
              \${(q.answers || []).map((ans, idx) => \`
                <button class="game-option-btn" data-idx="\${idx}">
                  <span class="game-option-letter">\${String.fromCharCode(65 + idx)}</span>
                  <span>\${ans}</span>
                </button>
              \`).join('')}
            </div>
          </div>
          <div class="game-footer">
            <span>Bấm chuột hoặc chạm vào màn hình để chọn đáp án</span>
          </div>
        \`;

        document.querySelectorAll('.game-option-btn').forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            const isCorrect = idx === q.correctAnswer;
            document.querySelectorAll('.game-option-btn').forEach((b, i) => {
              b.disabled = true;
              if (i === q.correctAnswer) b.classList.add('correct');
              else if (i === idx) b.classList.add('incorrect');
            });
            if (isCorrect) {
              Sound.playCorrect();
              score += q.points || 10;
            } else {
              Sound.playWrong();
            }
            setTimeout(() => {
              qIndex++;
              showQuestion();
            }, 1400);
          };
        });
      }

      function showFinishScreen() {
        Sound.playCheer();
        root.innerHTML = \`
          <div class="game-header">
            <span class="font-semibold">\${project.name}</span>
            <span class="badge badge-success">Hoàn thành!</span>
          </div>
          <div class="game-body text-center">
            <div style="font-size: 56px; margin-bottom: 16px;">🎉</div>
            <h2 style="font-size: 28px; margin-bottom: 12px;">Chúc mừng các Em đã hoàn thành!</h2>
            <p style="font-size: 18px; color: var(--theme-text-subtle); margin-bottom: 28px;">
              Tổng điểm đạt được: <strong style="color: var(--theme-primary); font-size: 28px;">\${score}</strong> điểm
            </p>
            <button class="btn btn-primary btn-lg" id="btn-restart">🔄 Chơi lại từ đầu</button>
          </div>
          <div class="game-footer">
            <span>TeacherStudio - Bản xuất độc lập</span>
          </div>
        \`;
        document.getElementById('btn-restart').onclick = showStartScreen;
      }

      showStartScreen();
    });
  </script>
</body>
</html>`;
  },

  downloadStandaloneHtml(project, content, profile = 'standalone') {
    const htmlContent = this.generateStandaloneHtml(project, content, profile);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const safeTitle = (project.name || 'Tro-Choi-TeacherStudio')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1EA0-\u1EF9]/g, '');
    const filename = `${safeTitle}.html`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  }
};
