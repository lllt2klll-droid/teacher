/* ==========================================================================
   TeacherStudio Classroom Timer - Visual Teaching Clock with Bell Chime
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class TimerGame extends BaseGame {
  start() {
    this.totalSeconds = this.options.timerSeconds || 180; // Default 3 mins
    this.remainingSeconds = this.totalSeconds;
    this.elapsedSeconds = 0;
    this.mode = 'down'; // 'down' | 'up'
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
    const pct = this.mode === 'up' ? 0 : Math.round(this.remainingSeconds / Math.max(1, this.totalSeconds) * 100);

    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Đồng hồ lớp học</span>
        <span class="quiz-score">${this.project.name || 'Thời gian thảo luận'} • <strong>${this.mode === 'down' ? 'Đếm ngược' : 'Đếm lên'}</strong></span>
      </div>

      <div class="game-body timer-body">
        <div class="timer-ring-wrap">
          <svg viewBox="0 0 120 120" width="150" height="150" class="timer-ring">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="10"/>
            <circle id="timer-ring-fg" cx="60" cy="60" r="52" fill="none" stroke="var(--theme-primary)" stroke-width="10"
              stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="${326.7 * (1 - pct / 100)}" transform="rotate(-90 60 60)"/>
          </svg>
          <div id="big-timer-display" class="timer-digits">${this.mode === 'up' ? formatTime(this.elapsedSeconds) : formatTime(this.remainingSeconds)}</div>
        </div>
        ${this.mode === 'down' ? `<div class="quiz-progress" style="max-width:320px;" title="${pct}%"><div class="quiz-progress-fill" id="timer-bar" style="width:${pct}%;"></div></div>` : '<div class="quiz-hint">Đếm lên không giới hạn — bấm Dừng để chốt giờ</div>'}

        <!-- Presets -->
        <div class="timer-presets">
          <button class="btn btn-secondary btn-sm preset-btn ${this.totalSeconds === 60 ? 'active' : ''}" data-time="60">1 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn ${this.totalSeconds === 120 ? 'active' : ''}" data-time="120">2 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn ${this.totalSeconds === 180 ? 'active' : ''}" data-time="180">3 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn ${this.totalSeconds === 300 ? 'active' : ''}" data-time="300">5 phút</button>
          <button class="btn btn-secondary btn-sm preset-btn ${this.totalSeconds === 600 ? 'active' : ''}" data-time="600">10 phút</button>
        </div>

        <!-- Custom minutes + mode -->
        <div class="flex gap-2" style="margin-bottom: 20px; flex-wrap: wrap; justify-content: center; align-items: center;">
          <input type="number" class="input" id="inp-custom-min" min="1" max="120" value="${Math.round(this.totalSeconds / 60)}" style="width: 90px;" title="Số phút tùy chỉnh">
          <button class="btn btn-secondary btn-sm" id="btn-custom-min">Đặt phút</button>
          <button class="btn btn-secondary btn-sm" id="btn-timer-mode" title="Đổi đếm ngược / đếm lên">${this.mode === 'down' ? '⏳ Đếm ngược' : '⏱️ Đếm lên'}</button>
        </div>

        <!-- Controls -->
        <div class="flex gap-3" style="flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-primary btn-lg timer-toggle" id="btn-toggle-timer">
            ${this.isRunning ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-plus30" title="Cộng thêm 30 giây khi thảo luận lố giờ">
            +30s
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-reset-timer">
            🔄 Đặt lại
          </button>
        </div>
        <div class="quiz-hint" id="timer-status" style="margin-top:10px;">${this.isRunning ? 'Đang chạy...' : 'Sẵn sàng — bấm Bắt đầu'}</div>

      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Chuông reo 3 lần khi hết giờ • F toàn màn hình</span>
      </div>
    `;

    const toggleBtn = this.viewportEl.querySelector('#btn-toggle-timer');
    const resetBtn = this.viewportEl.querySelector('#btn-reset-timer');
    const plusBtn = this.viewportEl.querySelector('#btn-plus30');
    if (plusBtn) {
      plusBtn.onclick = () => {
        Sound.playClick();
        this.totalSeconds += 30;
        if (this.mode === 'down') this.remainingSeconds += 30;
        const d = this.viewportEl.querySelector('#big-timer-display');
        if (d && this.mode === 'down') {
          const m = Math.floor(this.remainingSeconds / 60);
          const s = this.remainingSeconds % 60;
          d.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          d.style.color = 'var(--theme-primary)';
        }
        this.paintClock(d);
      };
    }
    const presetBtns = this.viewportEl.querySelectorAll('.preset-btn');
    const display = this.viewportEl.querySelector('#big-timer-display');
    const customInp = this.viewportEl.querySelector('#inp-custom-min');
    const customBtn = this.viewportEl.querySelector('#btn-custom-min');
    const modeBtn = this.viewportEl.querySelector('#btn-timer-mode');

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
      this.elapsedSeconds = 0;
      display.textContent = formatTime(this.mode === 'up' ? 0 : this.remainingSeconds);
      display.style.color = 'var(--theme-primary)';
      toggleBtn.innerHTML = '▶ Bắt đầu';
    };

    if (customBtn) {
      customBtn.onclick = () => {
        Sound.playClick();
        const mins = Math.min(120, Math.max(1, parseInt(customInp.value, 10) || 3));
        this.stopTimer();
        this.isRunning = false;
        this.totalSeconds = mins * 60;
        this.remainingSeconds = this.totalSeconds;
        this.elapsedSeconds = 0;
        display.textContent = formatTime(this.mode === 'up' ? 0 : this.remainingSeconds);
        display.style.color = 'var(--theme-primary)';
        toggleBtn.innerHTML = '▶ Bắt đầu';
      };
    }

    if (modeBtn) {
      modeBtn.onclick = () => {
        Sound.playClick();
        this.stopTimer();
        this.isRunning = false;
        this.mode = this.mode === 'down' ? 'up' : 'down';
        this.remainingSeconds = this.totalSeconds;
        this.elapsedSeconds = 0;
        modeBtn.textContent = this.mode === 'down' ? '⏳ Đếm ngược' : '⏱️ Đếm lên';
        display.textContent = formatTime(this.mode === 'up' ? 0 : this.remainingSeconds);
        display.style.color = 'var(--theme-primary)';
        toggleBtn.innerHTML = '▶ Bắt đầu';
      };
    }

    presetBtns.forEach(btn => {
      btn.onclick = () => {
        Sound.playClick();
        this.stopTimer();
        this.isRunning = false;
        this.totalSeconds = parseInt(btn.getAttribute('data-time'), 10);
        this.remainingSeconds = this.totalSeconds;
        this.elapsedSeconds = 0;
        display.textContent = formatTime(this.mode === 'up' ? 0 : this.remainingSeconds);
        display.style.color = 'var(--theme-primary)';
        toggleBtn.innerHTML = '▶ Bắt đầu';
      };
    });
  }

  paintClock(display) {
    const ring = this.viewportEl.querySelector('#timer-ring-fg');
    const bar = this.viewportEl.querySelector('#timer-bar');
    if (this.mode === 'up') {
      if (ring) { ring.style.strokeDashoffset = '0'; ring.style.stroke = 'var(--theme-primary)'; }
      return;
    }
    const pct = this.remainingSeconds / Math.max(1, this.totalSeconds);
    if (ring) {
      ring.style.strokeDashoffset = String(326.7 * (1 - pct));
      ring.style.stroke = this.remainingSeconds <= 10 ? '#B45454' : 'var(--theme-primary)';
    }
    if (bar) bar.style.width = Math.round(pct * 100) + '%';
    if (display) display.classList.toggle('is-low', this.remainingSeconds <= 10);
  }

  runTimer() {
    this.stopTimer();
    const display = this.viewportEl.querySelector('#big-timer-display');
    const status = this.viewportEl.querySelector('#timer-status');
    if (status) status.textContent = 'Đang chạy... bấm Tạm dừng để nghỉ';

    this.timer = setInterval(() => {
      if (this.mode === 'up') {
        this.elapsedSeconds++;
        const m = Math.floor(this.elapsedSeconds / 60);
        const s = this.elapsedSeconds % 60;
        if (display) {
          display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return;
      }
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        const m = Math.floor(this.remainingSeconds / 60);
        const s = this.remainingSeconds % 60;
        if (display) {
          display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          if (this.remainingSeconds <= 10) {
            display.style.color = '#B45454';
            // 10s cuối tick to dần + rung nhẹ để cả lớp cảm nhận
            Sound.playTick();
            if (this.remainingSeconds <= 5) Sound.playTick();
            display.classList.remove('quiz-urgent');
            void display.offsetWidth;
            display.classList.add('quiz-urgent');
          }
        }
        this.paintClock(display);
      } else {
        this.stopTimer();
        this.isRunning = false;
        // Chuong reo 3 lan cho ca lop nghe ro
        Sound.playBell();
        this.gameTimeout(() => Sound.playBell(), 900);
        this.gameTimeout(() => Sound.playBell(), 1800);
        if (display) {
          display.textContent = 'HẾT GIỜ! 🔔';
          display.style.color = '#B45454';
          display.classList.add('is-done');
        }
        if (status) status.textContent = 'Hết giờ! Bấm Bắt đầu lại để chạy tiếp.';
        const toggleBtn = this.viewportEl.querySelector('#btn-toggle-timer');
        // Reset sẵn để bấm "Bắt đầu lại" chạy đúng, không phải bấm Đặt lại
        this.remainingSeconds = this.totalSeconds;
        this.elapsedSeconds = 0;
        if (toggleBtn) toggleBtn.innerHTML = '▶ Bắt đầu lại';
      }
    }, 1000);
  }
}
