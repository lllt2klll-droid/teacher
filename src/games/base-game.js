/* ==========================================================================
   TeacherStudio Base Game Framework
   ========================================================================== */

import { Sound } from './audio-synth.js';
import { ThemeEngine } from '../core/theme-engine.js';

function escBase(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export class BaseGame {
  constructor(container, project = {}, content = {}, options = {}) {
    this.container = container;
    this.project = project;
    this.content = content;
    this.options = { ...project.settings, ...options };
    
    this.state = 'ready'; // 'ready' | 'playing' | 'paused' | 'finished'
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.timer = null;
    this.timeLeft = this.options.timerSeconds || 30;
    this._timeouts = new Set();
    this._rafIds = new Set();
    
    if (this.options.soundEnabled !== undefined) {
      Sound.setEnabled(this.options.soundEnabled);
    }
  }

  // Timeout/RAF có tracking để destroy() hủy được, chống callback ma
  gameTimeout(fn, ms) {
    const id = setTimeout(() => { this._timeouts.delete(id); try { fn(); } catch (e) {} }, ms);
    this._timeouts.add(id);
    return id;
  }

  clearGameTimeouts() {
    this._timeouts.forEach(id => { try { clearTimeout(id); } catch (e) {} });
    this._timeouts.clear();
  }

  gameRAF(fn) {
    const id = requestAnimationFrame((t) => { this._rafIds.delete(id); try { fn(t); } catch (e) {} });
    this._rafIds.add(id);
    return id;
  }

  cancelGameRAFs() {
    this._rafIds.forEach(id => { try { cancelAnimationFrame(id); } catch (e) {} });
    this._rafIds.clear();
  }

  mount() {
    this.container.innerHTML = '';
    const viewport = document.createElement('div');
    viewport.className = `game-viewport viewport-${(this.project.viewport?.mode || '16-9').replace(':', '-')}`;
    ThemeEngine.applyThemeToElement(viewport, this.project.themeId || 'minimal');
    this.container.appendChild(viewport);
    this.viewportEl = viewport;
    this.init();
  }

  init() {
    this.renderReadyScreen();
  }

  renderReadyScreen() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">${escBase(this.project.name || 'Trò chơi')}</span>
        <span class="badge badge-primary">${escBase(this.project.subject || 'Lớp học')}</span>
      </div>
      <div class="game-body text-center">
        <h2 style="font-size: 26px; margin-bottom: 12px; color: var(--theme-text);">${escBase(this.project.name || 'Sẵn sàng!')}</h2>
        <p style="color: var(--theme-text-subtle); max-width: 440px; margin-bottom: 24px;">
          ${escBase(this.project.description || 'Bấm nút Bắt đầu để tham gia trò chơi.')}
        </p>
        <button class="btn btn-primary btn-lg" id="btn-start-game" style="font-size: 18px; padding: 12px 32px; border-radius: 9999px;">
          ▶ Bắt đầu trò chơi
        </button>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">${this.content?.questions?.length || 0} câu hỏi</span>
      </div>
    `;

    const startBtn = this.viewportEl.querySelector('#btn-start-game');
    if (startBtn) {
      startBtn.onclick = () => this.start();
    }
  }

  start() {
    this.state = 'playing';
    Sound.playClick();
    this.render();
  }

  render() {
    // Override in derived game
  }

  finish() {
    this.state = 'finished';
    this.stopTimer();
    Sound.playCheer();
    this.renderResultScreen();
  }

  renderResultScreen() {
    const totalQ = this.content?.questions?.length || 1;
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">${escBase(this.project.name || 'Kết quả')}</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body text-center">
        <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
        <h2 style="font-size: 26px; margin-bottom: 8px;">Chúc mừng Thầy/Cô và các Em!</h2>
        <p style="font-size: 16px; color: var(--theme-text-subtle); margin-bottom: 24px;">
          Điểm số đạt được: <strong style="color: var(--theme-primary); font-size: 24px;">${this.score}</strong> điểm
        </p>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">
          🔄 Chơi lại từ đầu
        </button>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio</span>
      </div>
    `;

    const restartBtn = this.viewportEl.querySelector('#btn-restart-game');
    if (restartBtn) {
      restartBtn.onclick = () => this.restart();
    }
  }

  restart() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.start();
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Central keyboard registry: every game stores its handler here so
  // destroy() always cleans up, even if the game forgets to unbind.
  bindKey(handler) {
    this.unbindKey();
    this.keyHandler = handler;
    if (typeof window !== 'undefined' && handler) {
      window.addEventListener('keydown', handler);
    }
  }

  unbindKey() {
    if (this.keyHandler && typeof window !== 'undefined') {
      try { window.removeEventListener('keydown', this.keyHandler); } catch (e) {}
    }
    this.keyHandler = null;
  }

  destroy() {
    this.stopTimer();
    this.unbindKey();
    this.clearGameTimeouts();
    this.cancelGameRAFs();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
