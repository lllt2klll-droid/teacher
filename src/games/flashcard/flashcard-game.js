/* ==========================================================================
   TeacherStudio Flashcard Game - Interactive 3D Memorization Cards
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class FlashcardGame extends BaseGame {
  start() {
    this.cards = (this.content?.questions || []).map(q => ({
      front: q.front || q.question,
      back: q.back || (q.answers && q.answers[q.correctAnswer]) || q.explanation || 'Đáp án'
    }));
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.masteredCount = 0;
    this.state = 'playing';
    this.renderCard();
  }

  renderCard() {
    const card = this.cards[this.currentCardIndex];
    if (!card) {
      this.finish();
      return;
    }

    const total = this.cards.length;
    const currentNum = this.currentCardIndex + 1;
    this.isFlipped = false;

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Thẻ ${currentNum} / ${total}</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã ghi nhớ: <strong style="color: var(--theme-primary);">${this.masteredCount}</strong> thẻ</span>
      </div>

      <div class="game-body" style="max-width: 500px; margin: 0 auto; width: 100%; text-align: center;">
        <div id="flashcard-container" style="perspective: 1000px; width: 100%; height: 260px; cursor: pointer; user-select: none;">
          <div id="flashcard-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; box-shadow: var(--shadow-md); border-radius: 16px; border: 2px solid var(--theme-border);">
            
            <!-- Front -->
            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background-color: var(--theme-surface); border-radius: 16px;">
              <span class="badge badge-primary" style="margin-bottom: 12px;">Mặt trước: Thuật ngữ / Câu hỏi</span>
              <div style="font-size: 20px; font-weight: 600; color: var(--theme-text);">${card.front}</div>
              <span style="margin-top: 16px; font-size: 12px; color: var(--theme-text-subtle);">👆 Nhấp để lật thẻ</span>
            </div>

            <!-- Back -->
            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background-color: rgba(63, 95, 85, 0.08); border-radius: 16px;">
              <span class="badge badge-success" style="margin-bottom: 12px;">Mặt sau: Đáp án / Giải thích</span>
              <div style="font-size: 20px; font-weight: 600; color: var(--theme-primary);">${card.back}</div>
              <span style="margin-top: 16px; font-size: 12px; color: var(--theme-text-subtle);">👆 Nhấp để lật lại</span>
            </div>

          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
          <button class="btn btn-secondary" id="btn-prev-card" ${this.currentCardIndex === 0 ? 'disabled' : ''}>← Trước</button>
          <button class="btn btn-primary" id="btn-flip-card">🔄 Lật thẻ</button>
          <button class="btn btn-secondary" id="btn-next-card">Sau →</button>
        </div>
      </div>

      <div class="game-footer">
        <button class="btn btn-success btn-sm" id="btn-mastered">✓ Đã nhớ thẻ này (+10đ)</button>
      </div>
    `;

    const container = this.viewportEl.querySelector('#flashcard-container');
    const inner = this.viewportEl.querySelector('#flashcard-inner');
    const flipBtn = this.viewportEl.querySelector('#btn-flip-card');
    const prevBtn = this.viewportEl.querySelector('#btn-prev-card');
    const nextBtn = this.viewportEl.querySelector('#btn-next-card');
    const masteredBtn = this.viewportEl.querySelector('#btn-mastered');

    const toggleFlip = () => {
      this.isFlipped = !this.isFlipped;
      inner.style.transform = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      Sound.playClick();
    };

    container.onclick = toggleFlip;
    flipBtn.onclick = toggleFlip;

    prevBtn.onclick = () => {
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.renderCard();
      }
    };

    nextBtn.onclick = () => {
      if (this.currentCardIndex < this.cards.length - 1) {
        this.currentCardIndex++;
        this.renderCard();
      } else {
        this.finish();
      }
    };

    masteredBtn.onclick = () => {
      Sound.playCorrect();
      this.masteredCount++;
      this.score += 10;
      nextBtn.click();
    };
  }
}
