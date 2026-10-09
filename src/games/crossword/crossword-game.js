/* ==========================================================================
   TeacherStudio Crossword Game - Educational Word Clue Grid
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { crosswordWordsFromContent, normText } from '../pairs-helper.js';

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
    this.score = 0;
    this.state = 'playing';

    this.renderCrossword();
  }

  renderCrossword() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Giải ô chữ vui</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã giải: <strong>${this.solved.size} / ${this.words.length}</strong> từ</span>
      </div>

      <div class="game-body" style="width: 100%; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        
        <div style="font-size: 15px; color: var(--theme-text-subtle); text-align: center;">
          Đọc gợi ý và nhập từ khóa bằng chữ in hoa không dấu:
        </div>

        <div class="flex flex-col gap-4">
          ${this.words.map((item, idx) => `
            <div class="card" style="padding: 16px; border: 2px solid ${this.solved.has(item.id) ? '#4D7A5A' : 'var(--theme-border)'}; background: var(--theme-surface);">
              <div class="font-semibold" style="margin-bottom: 8px;">
                Hàng ${idx + 1}: ${item.clue}
              </div>
              <div class="flex items-center gap-3">
                <input type="text" class="input crossword-input" data-id="${item.id}"
                  maxlength="${item.answer.length + 4}"
                  placeholder="${item.answer.length} ký tự"
                  style="text-transform: uppercase; font-weight: 700; letter-spacing: 4px; font-size: 18px; max-width: 220px;"
                  ${this.solved.has(item.id) ? `value="${item.answer}" disabled` : ''}>
                <button class="btn btn-primary btn-sm check-word-btn" data-id="${item.id}" ${this.solved.has(item.id) ? 'disabled' : ''}>
                  ${this.solved.has(item.id) ? '✓ Đã giải' : 'Kiểm tra'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Điểm tích lũy: ${this.score}đ</span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const checkBtns = this.viewportEl.querySelectorAll('.check-word-btn');
    checkBtns.forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const item = this.words.find(w => w.id === id);
        const input = this.viewportEl.querySelector(`.crossword-input[data-id="${id}"]`);
        if (!input || !item) return;

        const val = normText(input.value);
        if (val === normText(item.answer) && val.length > 0) {
          Sound.playCorrect();
          this.solved.add(id);
          this.score += 20;
          this.renderCrossword();

          if (this.solved.size >= this.words.length) {
            setTimeout(() => this.finish(), 800);
          }
        } else {
          Sound.playWrong();
          input.style.borderColor = '#B45454';
          setTimeout(() => {
            input.style.borderColor = 'var(--theme-border)';
          }, 600);
        }
      };
    });
  }
}
