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
    this.startAt = Date.now();
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
    if (this.startAt == null) this.startAt = Date.now();
    const pct = Math.round(this.masteredSet.size / Math.max(1, total) * 100);

    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Thẻ ${currentNum} / ${total}</span>
        <span class="quiz-score">Đã nhớ: <strong style="color: var(--theme-primary);">${this.masteredSet.size}</strong>/${total} • Điểm <strong>${this.score}</strong></span>
      </div>

      <div class="game-body fc-body">
        <div class="quiz-progress" title="Tiến trình ghi nhớ ${pct}%">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="fc-dots" title="Vị trí thẻ">
          ${this.cards.map((c, i) => `<span class="fc-dot ${i === this.currentCardIndex ? 'cur' : ''} ${this.masteredSet.has(c.id) ? 'done' : ''}"></span>`).join('')}
        </div>

      <div class="fc-wrap">
        <div id="flashcard-container" class="fc-container">
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
      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Space lật • ←/→ chuyển thẻ</span>
        <div class="flex items-center gap-2">
          <button class="btn btn-secondary btn-sm" id="btn-unknown" title="Để lại thẻ này học sau">📖 Chưa nhớ</button>
          <button class="btn btn-success" id="btn-mastered">✓ Đã nhớ (+10đ)</button>
        </div>
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

    const unknownBtn = this.viewportEl.querySelector('#btn-unknown');
    if (unknownBtn) {
      unknownBtn.onclick = () => {
        Sound.playClick();
        if (this.currentCardIndex < this.cards.length - 1) {
          this.currentCardIndex++;
          this.renderCard();
        } else {
          this.finish();
        }
      };
    }
  }

  renderResultScreen() {
    this.unbindKey();
    const total = this.cards.length || 1;
    const done = this.masteredSet.size;
    const acc = Math.round(done / total * 100);
    const secs = this.startAt ? Math.max(1, Math.round((Date.now() - this.startAt) / 1000)) : 0;
    const rest = this.cards.filter(c => !this.masteredSet.has(c.id));
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">${escHtml(this.project.name || 'Kết quả')}</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${acc >= 80 ? '🏆' : acc >= 50 ? '🎉' : '📖'}</div>
          <h2 class="quiz-result-title">Đã nhớ ${done}/${total} thẻ (${acc}%)</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">⏱️ <strong>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</strong></span>
            <span class="quiz-stat">📖 Còn <strong>${rest.length}</strong> thẻ</span>
          </div>
          ${rest.length ? `<div class="quiz-hint" style="margin-bottom:8px;">Chưa nhớ: ${rest.slice(0, 5).map(c => escHtml(c.front)).join(' • ')}${rest.length > 5 ? ` (+${rest.length - 5})` : ''}</div>` : '<div class="quiz-grade" style="color:#15803D;">Tuyệt vời, nhớ hết bộ thẻ! 🎉</div>'}
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Học lại từ đầu</button>
          ${rest.length ? '<button class="btn btn-secondary" id="btn-retry-rest">📖 Chỉ học thẻ chưa nhớ</button>' : ''}
        </div>
      </div>
      <div class="game-footer"><span class="quiz-hint">TeacherStudio • ${done}/${total} thẻ đã nhớ</span></div>
    `;
    const rb = this.viewportEl.querySelector('#btn-restart-game');
    if (rb) rb.onclick = () => { this.masteredSet = new Set(); this.score = 0; this.currentCardIndex = 0; this.startAt = Date.now(); this.start(); };
    const rr = this.viewportEl.querySelector('#btn-retry-rest');
    if (rr) rr.onclick = () => {
      const ids = new Set(rest.map(c => c.id));
      this.cards = this.cards.filter(c => ids.has(c.id));
      this.masteredSet = new Set();
      this.score = 0; this.currentCardIndex = 0; this.startAt = Date.now();
      this.state = 'playing'; this.renderCard();
    };
  }
}
