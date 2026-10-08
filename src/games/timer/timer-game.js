/* ==========================================================================
   TeacherStudio Classroom Timer - Visual Teaching Clock with Bell Chime
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class TimerGame extends BaseGame {
  start() {
    this.totalSeconds = this.options.timerSeconds || 180; // Default 3 mins
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    this.state = 'playing';

    this.renderTimerScreen();
  }

  renderTimerScreen() {
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Đồng hồ đếm ngược lớp học</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">${this.project.name || 'Thời gian thảo luận'}</span>
      </div>

      <div class="game-body text-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        
        <!-- Big Clock Display -->
        <div id="big-timer-display" style="font-size: 72px; font-weight: 700; font-family: monospace; letter-spacing: 2px; color: var(--theme-primary); margin-bottom: 24px; padding: 16px 36px; background: var(--theme-surface); border: 3px solid var(--theme-border); border-radius: 20px; box-shadow: var(--shadow-md);">
          ${formatTime(this.remainingSeconds)}
        </div>

        <!-- Presets -->
        <div class="flex gap-2" style="margin-bottom: 24px; flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-secondary btn-sm preset-btn" data-time="60">1 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn" data-time="120">2 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn" data-time="180">3 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn" data-time="300">5 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn" data-time="600">10 phút</button>
        </div>

        <!-- Controls -->
        <div class="flex gap-3">
          <button class="btn btn-primary btn-lg" id="btn-toggle-timer" style="padding: 12px 28px; font-size: 18px;">
            ${this.isRunning ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-reset-timer">
            🔄 Đặt lại
          </button>
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Chuông reo kết thúc báo hiệu hết giờ thảo luận</span>
      </div>
    `;

    const toggleBtn = this.viewportEl.querySelector('#btn-toggle-timer');
    const resetBtn = this.viewportEl.querySelector('#btn-reset-timer');
    const presetBtns = this.viewportEl.querySelectorAll('.preset-btn');
    const display = this.viewportEl.querySelector('#big-timer-display');

    toggleBtn.onclick = () => {
      this.isRunning = !this.isRunning;
      Sound.playClick();
      toggleBtn.innerHTML = this.isRunning ? '⏸ Tạm dừng' : '▶ Tiếp tục';

      if (this.isRunning) {
        this.runTimer();
      } else {
        this.stopTimer();
      }
    };

    resetBtn.onclick = () => {
      this.stopTimer();
      this.isRunning = false;
      this.remainingSeconds = this.totalSeconds;
      display.textContent = formatTime(this.remainingSeconds);
      display.style.color = 'var(--theme-primary)';
      toggleBtn.innerHTML = '▶ Bắt đầu';
    };

    presetBtns.forEach(btn => {
      btn.onclick = () => {
        Sound.playClick();
        this.stopTimer();
        this.isRunning = false;
        this.totalSeconds = parseInt(btn.getAttribute('data-time'), 10);
        this.remainingSeconds = this.totalSeconds;
        display.textContent = formatTime(this.remainingSeconds);
        display.style.color = 'var(--theme-primary)';
        toggleBtn.innerHTML = '▶ Bắt đầu';
      };
    });
  }

  runTimer() {
    this.stopTimer();
    const display = this.viewportEl.querySelector('#big-timer-display');

    this.timer = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        const m = Math.floor(this.remainingSeconds / 60);
        const s = this.remainingSeconds % 60;
        if (display) {
          display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          if (this.remainingSeconds <= 10) {
            display.style.color = '#B45454';
            Sound.playTick();
          }
        }
      } else {
        this.stopTimer();
        this.isRunning = false;
        Sound.playBell();
        if (display) {
          display.textContent = 'HẾT GIỜ! 🔔';
          display.style.color = '#B45454';
        }
        const toggleBtn = this.viewportEl.querySelector('#btn-toggle-timer');
        if (toggleBtn) toggleBtn.innerHTML = '▶ Bắt đầu lại';
      }
    }, 1000);
  }
}
