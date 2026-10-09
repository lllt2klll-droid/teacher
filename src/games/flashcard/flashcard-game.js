/* ==========================================================================
   TeacherStudio Flashcard Game - Interactive 3D Memorization Cards
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { escHtml } from '../question-media.js';

export class FlashcardGame extends BaseGame {
  start() {
    this.cards = (this.content?.questions || []).map((q, i) => ({
      id: i,
      front: q.front || q.question || ('Thẻ ' + (i + 1)),
      back: q.back || (q.answers && q.answers[q.correctAnswer]) || q.explanation || 'Đáp án',
      image: q.image || ''
    }));
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.masteredSet = new Set();
    this.state = 'playing';
    // Phim Space lat the, mui ten chuyen the (tu don khi destroy nho BaseGame)
    this.bindKey((e) => {
      if (this.state !== 'playing') return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === ' ') {
        const b = this.viewportEl ? this.viewportEl.querySelector('#btn-flip-card') : null;
        if (b) { e.preventDefault(); b.click(); }
      } else if (e.key === 'ArrowRight') {
        const n = this.viewportEl ? this.viewportEl.querySelector('#btn-next-card') : null;
        if (n) n.click();
      } else if (e.key === 'ArrowLeft') {
        const p = this.viewportEl ? this.viewportEl.querySelector('#btn-prev-card') : null;
        if (p) p.click();
      }
    });
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
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã ghi nhớ: <strong style="color: var(--theme-primary);">${this.masteredSet.size}</strong>/${this.cards.length} thẻ</span>
      </div>

      <div class="game-body" style="max-width: 500px; margin: 0 auto; width: 100%; text-align: center;">
        <div id="flashcard-container" style="perspective: 1000px; width: 100%; height: 260px; cursor: pointer; user-select: none;">
          <div id="flashcard-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; box-shadow: var(--shadow-md); border-radius: 16px; border: 2px solid var(--theme-border);">
            
            <!-- Front -->
            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background-color: var(--theme-surface); border-radius: 16px; overflow-y: auto;">
              <span class="badge badge-primary" style="margin-bottom: 12px;">Mặt trước: Thuật ngữ / Câu hỏi</span>
              ${card.image ? `<img src="${escHtml(card.image)}" alt="Minh họa" style="max-width: 100%; max-height: 110px; border-radius: 8px; margin-bottom: 8px; object-fit: contain; background: #fff;">` : ''}
              <div style="font-size: 20px; font-weight: 600; color: var(--theme-text);">${escHtml(card.front)}</div>
              <span style="margin-top: 16px; font-size: 12px; color: var(--theme-text-subtle);">👆 Nhấp để lật thẻ</span>
            </div>

            <!-- Back -->
            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background-color: rgba(63, 95, 85, 0.08); border-radius: 16px;">
              <span class="badge badge-success" style="margin-bottom: 12px;">Mặt sau: Đáp án / Giải thích</span>
              <div style="font-size: 20px; font-weight: 600; color: var(--theme-primary);">${escHtml(card.back)}</div>
              <span style="margin-top: 16px; font-size: 12px; color: var(--theme-text-subtle);">👆 Nhấp để lật lại</span>
            </div>

          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="btn-prev-card" ${this.currentCardIndex === 0 ? 'disabled' : ''}>← Trước</button>
          <button class="btn btn-primary" id="btn-flip-card">🔄 Lật thẻ</button>
          <button class="btn btn-secondary" id="btn-next-card">Sau →</button>
          <button class="btn btn-secondary btn-sm" id="btn-shuffle-cards" title="Xáo trộn thứ tự thẻ">🎲 Xáo</button>
          ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${escHtml(card.front + '. ' + card.back)}" title="Đọc to thẻ này">🔊 Đọc</button>` : ''}
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
    bindSpeakButtons(this.viewportEl);

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
      // Chi cong diem 1 lan cho moi the (dùng id thẻ, không dùng index)
      const cid = this.cards[this.currentCardIndex].id;
      if (!this.masteredSet.has(cid)) {
        Sound.playCorrect();
        this.masteredSet.add(cid);
        this.score += 10;
      }
      nextBtn.click();
    };

    const shuffleBtn = this.viewportEl.querySelector('#btn-shuffle-cards');
    if (shuffleBtn) {
      shuffleBtn.onclick = () => {
        Sound.playClick();
        // Giữ nguyên masteredSet theo id nên xáo không sai điểm
        const curId = this.cards[this.currentCardIndex].id;
        for (let i = this.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const t = this.cards[i]; this.cards[i] = this.cards[j]; this.cards[j] = t;
        }
        this.currentCardIndex = Math.max(0, this.cards.findIndex(c => c.id === curId));
        this.renderCard();
      };
    }
  }
}
