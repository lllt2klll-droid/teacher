/* ==========================================================================
   TeacherStudio Jigsaw Puzzle Reveal - Mystery Image Tile Game
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, teacherBadgeHtml, escHtml } from '../question-media.js';

export class JigsawGame extends BaseGame {
  start() {
    this.questions = this.content?.questions || [];
    if (this.questions.length === 0) {
      this.questions = [
        { question: 'Mặt trời mọc ở hướng nào?', answers: ['Đông', 'Tây', 'Nam', 'Bắc'], correctAnswer: 0 },
        { question: 'Thủ đô của Việt Nam là gì?', answers: ['Hà Nội', 'Huế', 'Đà Nẵng', 'TP.HCM'], correctAnswer: 0 },
        { question: 'Số liền sau của 99 là?', answers: ['100', '98', '101', '90'], correctAnswer: 0 },
        { question: 'Một tuần có bao nhiêu ngày?', answers: ['7 ngày', '5 ngày', '6 ngày', '8 ngày'], correctAnswer: 0 }
      ];
    }

    this.totalTiles = Math.max(4, this.questions.length);
    this.revealedTiles = new Set();
    this.currentQIndex = 0;
    this.state = 'playing';

    this.renderBoard();
  }

  renderBoard() {
    const q = this.questions[this.currentQIndex];
    if (!q || this.revealedTiles.size >= this.totalTiles) {
      this.finish();
      return;
    }

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Mảnh ghép bí mật</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã mở: <strong>${this.revealedTiles.size} / ${this.totalTiles}</strong> mảnh</span>
      </div>

      <div class="game-body gv-side-2" style="display: flex; gap: 24px; align-items: center; justify-content: center; width: 100%; max-width: 840px;">
        
        <!-- Puzzle Grid with mystery background image -->
        <div style="position: relative; width: min(300px, 100%); aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-md); flex-shrink: 0; background: linear-gradient(135deg, #1E3A8A, #3B82F6, #10B981);">
          
          <!-- Underlying secret visual -->
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FFF; text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 8px;">🌟</div>
            <div style="font-size: 18px; font-weight: 700;">HỌC TẬP TỐT</div>
            <div style="font-size: 14px; opacity: 0.9;">Bức tranh bí mật đã được giải mã!</div>
          </div>

          <!-- Covering Tiles Grid (2x2 or 3x3) -->
          <div id="jigsaw-tiles-grid" style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 2px;">
            ${Array.from({ length: 4 }).map((_, i) => `
              <div class="jigsaw-tile" data-index="${i}" style="background-color: var(--theme-surface); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--theme-text); transition: all 0.4s ease; border: 1px solid var(--theme-border); ${this.revealedTiles.has(i) ? 'opacity: 0; pointer-events: none; transform: scale(0.8);' : 'opacity: 1;'}">
                ${i + 1}
              </div>
            `).join('')}
          </div>

        </div>

        <!-- Question side -->
        <div style="flex: 1; background: var(--theme-surface); padding: 20px; border-radius: 12px; border: 1px solid var(--theme-border);">
          <div style="font-size: 14px; color: var(--theme-text-subtle); margin-bottom: 6px;">Câu hỏi để mở mảnh ghép tiếp theo:</div>
          ${questionImageHtml(q, 140)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px;">
            <div style="font-size: 18px; font-weight: 600; flex: 1;">${escHtml(q.question)}</div>
            ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${escHtml(q.question)}" title="Đọc to câu hỏi">🔊</button>` : ''}
          </div>

          <div class="flex flex-col gap-2">
            ${(q.answers || []).map((ans, idx) => `
              <button class="game-option-btn jigsaw-opt-btn" data-index="${idx}" style="padding: 10px 14px; margin-bottom: 4px;">
                <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${ans}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Trả lời đúng câu hỏi để lật mở ô tranh tương ứng</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.jigsaw-opt-btn');
    bindSpeakButtons(this.viewportEl);
    optBtns.forEach(btn => {
      btn.onclick = () => {
        const choice = parseInt(btn.getAttribute('data-index'), 10);
        if (choice === q.correctAnswer) {
          Sound.playCorrect();
          btn.classList.add('correct');
          this.revealedTiles.add(this.revealedTiles.size); // Reveal next tile
          this.score += 15;
          setTimeout(() => {
            this.currentQIndex++;
            this.renderBoard();
          }, 800);
        } else {
          Sound.playWrong();
          btn.classList.add('incorrect');
          setTimeout(() => btn.classList.remove('incorrect'), 600);
        }
      };
    });
  }
}
