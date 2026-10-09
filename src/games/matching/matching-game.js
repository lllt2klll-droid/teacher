/* ==========================================================================
   TeacherStudio Matching Game - Two-Column Pair Matching
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class MatchingGame extends BaseGame {
  start() {
    const rawQuestions = this.content?.questions || [];
    this.pairs = rawQuestions.slice(0, 6).map((q, idx) => ({
      id: idx,
      left: q.question,
      right: (q.answers && q.answers[q.correctAnswer]) || q.explanation || 'Ý nghĩa ' + (idx + 1)
    }));

    if (this.pairs.length === 0) {
      this.pairs = [
        { id: 0, left: 'Hình vuông', right: '4 cạnh bằng nhau, 4 góc vuông' },
        { id: 1, left: 'Hình tam giác', right: '3 cạnh và 3 đỉnh' },
        { id: 2, left: 'Hình tròn', right: 'Tất cả các điểm cách đều tâm' }
      ];
    }

    this.leftItems = [...this.pairs].sort(() => Math.random() - 0.5);
    this.rightItems = [...this.pairs].sort(() => Math.random() - 0.5);

    this.selectedLeft = null;
    this.selectedRight = null;
    this.matchedIds = new Set();
    this.score = 0;
    this.state = 'playing';

    this.renderBoard();
  }

  renderBoard() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Ghép đôi tương ứng</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã ghép: <strong>${this.matchedIds.size} / ${this.pairs.length}</strong></span>
      </div>

      <div class="game-body" style="max-width: 760px; margin: 0 auto; width: 100%;">
        <div style="font-size: 16px; text-align: center; margin-bottom: 20px; color: var(--theme-text-subtle);">
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
                ${item.left}
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
                ${item.right}
              </button>
            `).join('')}
          </div>

        </div>
      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Điểm tích lũy: ${this.score}đ</span>
      </div>
    `;

    this.bindEvents();
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

    if (this.selectedLeft === this.selectedRight) {
      // Match found!
      Sound.playCorrect();
      this.matchedIds.add(this.selectedLeft);
      this.score += 10;
      this.selectedLeft = null;
      this.selectedRight = null;

      if (this.matchedIds.size >= this.pairs.length) {
        setTimeout(() => this.finish(), 800);
      } else {
        this.renderBoard();
      }
    } else {
      // Incorrect
      Sound.playWrong();
      const lBtn = this.viewportEl.querySelector(`.left-btn[data-id="${this.selectedLeft}"]`);
      const rBtn = this.viewportEl.querySelector(`.right-btn[data-id="${this.selectedRight}"]`);
      if (lBtn) lBtn.style.borderColor = '#B45454';
      if (rBtn) rBtn.style.borderColor = '#B45454';

      setTimeout(() => {
        this.selectedLeft = null;
        this.selectedRight = null;
        if (lBtn) lBtn.style.borderColor = 'var(--theme-border)';
        if (rBtn) rBtn.style.borderColor = 'var(--theme-border)';
      }, 700);
    }
  }
}
