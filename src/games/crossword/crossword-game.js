/* ==========================================================================
   TeacherStudio Crossword Game - Educational Word Clue Grid
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { crosswordWordsFromContent, normText } from '../pairs-helper.js';
import { escHtml } from '../question-media.js';

export class CrosswordGame extends BaseGame {
  start() {
    // Doc tu khoa tu content GV (words hoac dap an dung), giong ban xuat.
    const derived = crosswordWordsFromContent(this.content, 8);
    this.words = derived.length > 0 ? derived : [
      { id: 1, clue: 'Thủ đô ngàn năm văn hiến của Việt Nam (5 chữ cái)', answer: 'HANOI' },
      { id: 2, clue: 'Màu cờ Tổ quốc Việt Nam (2 chữ cái)', answer: 'DO' },
      { id: 3, clue: 'Quốc hoa của Việt Nam (3 chữ cái)', answer: 'SEN' }
    ];

    this.solved = new Set();
    this.hinted = new Set();
    this.score = 0;
    this.state = 'playing';

    this.renderCrossword();
  }

  renderCrossword() {
    const pct = Math.round(this.solved.size / Math.max(1, this.words.length) * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Giải ô chữ vui</span>
        <span class="quiz-score">Đã giải: <strong>${this.solved.size}/${this.words.length}</strong> từ • Điểm <strong>${this.score}</strong> • 💡 <strong>${this.hinted.size}</strong></span>
      </div>

      <div class="game-body pair-body">
        <div class="quiz-progress" title="Tiến trình ${pct}%">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="pair-hint">
          Đọc gợi ý và nhập từ khóa bằng chữ in hoa không dấu • Gợi ý chỉ được nửa điểm
        </div>

        <div class="cw-list">
          ${this.words.map((item, idx) => `
            <div class="card" style="padding: 16px; border: 2px solid ${this.solved.has(item.id) ? '#4D7A5A' : 'var(--theme-border)'}; background: var(--theme-surface);">
              <div class="font-semibold" style="margin-bottom: 8px;">
                Hàng ${idx + 1}: ${escHtml(item.clue)}
              </div>
              <div class="flex items-center gap-3">
                <input type="text" class="input crossword-input" data-id="${item.id}"
                  maxlength="${item.answer.length}"
                  placeholder="${item.answer.length} ký tự"
                  style="text-transform: uppercase; font-weight: 700; letter-spacing: 4px; font-size: 18px; max-width: 220px;"
                  ${this.solved.has(item.id) ? `value="${escHtml(item.answer)}" disabled` : ''}>
                <button class="btn btn-primary btn-sm check-word-btn" data-id="${item.id}" ${this.solved.has(item.id) ? 'disabled' : ''}>
                  ${this.solved.has(item.id) ? '✓ Đã giải' : 'Kiểm tra'}
                </button>
                ${!this.solved.has(item.id) && !this.hinted.has(item.id) ? `
                  <button class="btn btn-secondary btn-sm hint-word-btn" data-id="${item.id}" title="Hiện chữ cái đầu (được nửa điểm)">
                    💡 Gợi ý
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Điểm ${this.score}đ • Đã gợi ý ${this.hinted.size} từ • Enter để kiểm tra nhanh</span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const checkBtns = this.viewportEl.querySelectorAll('.check-word-btn');
    const doCheck = (btn) => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const item = this.words.find(w => w.id === id);
      const input = this.viewportEl.querySelector(`.crossword-input[data-id="${id}"]`);
      if (!input || !item || btn.disabled) return;

      const val = normText(input.value);
      if (val === normText(item.answer) && val.length > 0) {
        Sound.playCorrect();
        this.solved.add(id);
        this.score += this.hinted.has(id) ? 10 : 20;
        btn.classList.add('correct');
        input.disabled = true;
        this.renderCrossword();

        if (this.solved.size >= this.words.length) {
          this.gameTimeout(() => this.finish(), 800);
        }
      } else {
        Sound.playWrong();
        input.classList.remove('quiz-shake');
        void input.offsetWidth;
        input.classList.add('quiz-shake');
        input.style.borderColor = '#B45454';
        this.gameTimeout(() => {
          try { input.style.borderColor = 'var(--theme-border)'; } catch (e) {}
        }, 600);
      }
    };
    checkBtns.forEach(btn => {
      btn.onclick = () => doCheck(btn);
    });
    this.viewportEl.querySelectorAll('.crossword-input').forEach(inp => {
      inp.onkeydown = (e) => {
        if (e.key === 'Enter') {
          const id = inp.getAttribute('data-id');
          const btn = this.viewportEl.querySelector(`.check-word-btn[data-id="${id}"]`);
          if (btn) doCheck(btn);
        }
        e.stopPropagation();
      };
    });

    this.viewportEl.querySelectorAll('.hint-word-btn').forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const item = this.words.find(w => w.id === id);
        const input = this.viewportEl.querySelector(`.crossword-input[data-id="${id}"]`);
        if (!input || !item || this.hinted.has(id)) return;
        Sound.playClick();
        this.hinted.add(id);
        input.value = item.answer.charAt(0) + '•'.repeat(Math.max(0, item.answer.length - 1));
        input.focus();
        input.setSelectionRange(1, 1);
        btn.disabled = true;
        btn.textContent = '💡 Đã gợi ý (-10đ)';
        const head = this.viewportEl.querySelector('.quiz-score');
        if (head) head.innerHTML = `Đã giải: <strong>${this.solved.size}/${this.words.length}</strong> từ • Điểm <strong>${this.score}</strong> • 💡 <strong>${this.hinted.size}</strong>`;
      };
    });
  }

  renderResultScreen() {
    const total = this.words.length || 1;
    const pct = Math.round(this.solved.size / total * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Giải ô chữ hoàn thành!</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${this.hinted.size === 0 ? '🏆' : '🎉'}</div>
          <h2 class="quiz-result-title">Giải ${this.solved.size}/${total} từ (${pct}%)</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">💡 Gợi ý <strong>${this.hinted.size}</strong></span>
          </div>
          <div class="quiz-hint">${this.hinted.size === 0 ? 'Không cần gợi ý nào — quá giỏi! 🏆' : 'Gợi ý chỉ được nửa điểm, lần sau thử không gợi ý nhé!'}</div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Chơi lại từ đầu</button>
      </div>
      <div class="game-footer"><span class="quiz-hint">TeacherStudio • ${this.score} điểm</span></div>
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
