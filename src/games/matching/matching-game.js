/* ==========================================================================
   TeacherStudio Matching Game - Two-Column Pair Matching
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { escHtml } from '../question-media.js';

function shuffleArr(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export class MatchingGame extends BaseGame {
  start() {
    const rawQuestions = this.content?.questions || [];
    this.pairs = rawQuestions.slice(0, 6).map((q, idx) => ({
      id: idx,
      left: q.question || ('Mục ' + (idx + 1)),
      right: (q.answers && q.answers[q.correctAnswer]) || q.explanation || 'Ý nghĩa ' + (idx + 1)
    }));

    if (this.pairs.length === 0) {
      this.pairs = [
        { id: 0, left: 'Hình vuông', right: '4 cạnh bằng nhau, 4 góc vuông' },
        { id: 1, left: 'Hình tam giác', right: '3 cạnh và 3 đỉnh' },
        { id: 2, left: 'Hình tròn', right: 'Tất cả các điểm cách đều tâm' }
      ];
    }

    this.leftItems = shuffleArr(this.pairs);
    this.rightItems = shuffleArr(this.pairs);

    this.selectedLeft = null;
    this.selectedRight = null;
    this.matchedIds = new Set();
    this.attempts = 0;
    this.mistakes = 0;
    this.score = 0;
    this._checking = false;
    this.startAt = Date.now();
    this.state = 'playing';

    this.renderBoard();
  }

  elapsed() {
    return this.startAt ? Math.max(1, Math.round((Date.now() - this.startAt) / 1000)) : 0;
  }

  renderBoard() {
    const pct = Math.round(this.matchedIds.size / Math.max(1, this.pairs.length) * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Ghép đôi tương ứng</span>
        <span class="quiz-score">Đã ghép: <strong>${this.matchedIds.size}/${this.pairs.length}</strong> • Điểm <strong>${this.score}</strong> • Sai <strong>${this.mistakes}</strong></span>
      </div>

      <div class="game-body pair-body">
        <div class="quiz-progress" title="Tiến trình ${pct}%">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="pair-hint">
          Nhấp chọn một mục ở Cột A, sau đó chọn mục tương ứng ở Cột B
        </div>

        <div class="gv-grid-2">
          
          <!-- Column A -->
          <div class="flex flex-col gap-2" id="col-left">
            <div class="font-semibold text-center" style="margin-bottom: 8px;">CỘT A</div>
            ${this.leftItems.map(item => `
              <button class="matching-btn left-btn ${this.matchedIds.has(item.id) ? 'matched' : ''}" 
                data-id="${item.id}" 
                style="padding: 14px 16px; border: 2px solid var(--theme-border); border-radius: 10px; background: var(--theme-surface); text-align: left; cursor: pointer; transition: all 0.2s;"
                ${this.matchedIds.has(item.id) ? 'disabled' : ''}>
                ${escHtml(item.left)}
              </button>
            `).join('')}
          </div>

          <!-- Column B -->
          <div class="flex flex-col gap-2" id="col-right">
            <div class="font-semibold text-center" style="margin-bottom: 8px;">CỘT B</div>
            ${this.rightItems.map(item => `
              <button class="matching-btn right-btn ${this.matchedIds.has(item.id) ? 'matched' : ''}" 
                data-id="${item.id}" 
                style="padding: 14px 16px; border: 2px solid var(--theme-border); border-radius: 10px; background: var(--theme-surface); text-align: left; cursor: pointer; transition: all 0.2s;"
                ${this.matchedIds.has(item.id) ? 'disabled' : ''}>
                ${escHtml(item.right)}
              </button>
            `).join('')}
          </div>

        </div>
      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Điểm ${this.score}đ • Thử ${this.attempts} • Sai ${this.mistakes} • ⏱️ ${this.elapsed()}s</span>
        <button class="btn btn-secondary btn-sm" id="btn-reshuffle-match">🎲 Xáo lại</button>
      </div>
    `;

    this.bindEvents();
    const reshuffleBtn = this.viewportEl.querySelector('#btn-reshuffle-match');
    if (reshuffleBtn) {
      reshuffleBtn.onclick = () => {
        if (this._checking) return;
        Sound.playClick();
        this.leftItems = shuffleArr(this.leftItems);
        this.rightItems = shuffleArr(this.rightItems);
        this.selectedLeft = null;
        this.selectedRight = null;
        this.renderBoard();
      };
    }
  }

  bindEvents() {
    const leftBtns = this.viewportEl.querySelectorAll('.left-btn');
    const rightBtns = this.viewportEl.querySelectorAll('.right-btn');

    leftBtns.forEach(btn => {
      btn.onclick = () => {
        Sound.playClick();
        leftBtns.forEach(b => b.style.borderColor = 'var(--theme-border)');
        btn.style.borderColor = 'var(--theme-primary)';
        this.selectedLeft = parseInt(btn.getAttribute('data-id'), 10);
        this.checkMatch();
      };
    });

    rightBtns.forEach(btn => {
      btn.onclick = () => {
        Sound.playClick();
        rightBtns.forEach(b => b.style.borderColor = 'var(--theme-border)');
        btn.style.borderColor = 'var(--theme-primary)';
        this.selectedRight = parseInt(btn.getAttribute('data-id'), 10);
        this.checkMatch();
      };
    });
  }

  checkMatch() {
    if (this.selectedLeft === null || this.selectedRight === null) return;
    if (this._checking) return;
    this.attempts++;

    if (this.selectedLeft === this.selectedRight) {
      // Match found!
      Sound.playCorrect();
      this.matchedIds.add(this.selectedLeft);
      this.score += 10;
      this.selectedLeft = null;
      this.selectedRight = null;

      if (this.matchedIds.size >= this.pairs.length) {
        this.gameTimeout(() => this.finish(), 800);
      } else {
        this.renderBoard();
      }
    } else {
      // Incorrect - khóa input trong lúc feedback
      this._checking = true;
      Sound.playWrong();
      this.mistakes++;
      const lBtn = this.viewportEl.querySelector(`.left-btn[data-id="${this.selectedLeft}"]`);
      const rBtn = this.viewportEl.querySelector(`.right-btn[data-id="${this.selectedRight}"]`);
      if (lBtn) { lBtn.style.borderColor = '#B45454'; lBtn.disabled = true; }
      if (rBtn) { rBtn.style.borderColor = '#B45454'; rBtn.disabled = true; }

      this.gameTimeout(() => {
        this._checking = false;
        this.selectedLeft = null;
        this.selectedRight = null;
        this.renderBoard();
      }, 700);
    }
  }

  renderResultScreen() {
    const total = this.pairs.length || 1;
    const acc = Math.round((total - this.mistakes / Math.max(1, this.attempts) * total / 1) || 0);
    const secs = this.elapsed();
    const accuracy = this.attempts ? Math.round(this.matchedIds.size / this.attempts * 100) : 100;
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Ghép đôi hoàn thành!</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${this.mistakes === 0 ? '🏆' : this.mistakes <= 2 ? '🎉' : '💪'}</div>
          <h2 class="quiz-result-title">Ghép đúng ${this.matchedIds.size}/${total} cặp</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">🎯 Chính xác <strong>${accuracy}%</strong></span>
            <span class="quiz-stat">❌ Sai <strong>${this.mistakes}</strong></span>
            <span class="quiz-stat">⏱️ <strong>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</strong></span>
          </div>
          <div class="quiz-hint">${this.mistakes === 0 ? 'Hoàn hảo, không sai lần nào! 🏆' : 'Thử ' + this.attempts + ' lượt • Càng ít sai càng giỏi!'}</div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Chơi lại từ đầu</button>
      </div>
      <div class="game-footer"><span class="quiz-hint">TeacherStudio • ${this.score} điểm • ${accuracy}% chính xác</span></div>
    `;
    const rb = this.viewportEl.querySelector('#btn-restart-game');
    if (rb) rb.onclick = () => this.restart();
  }

  restart() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.start();
  }
}
