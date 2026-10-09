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

    // Chốt số mảnh về lưới kín không ô trống: 4 (2x2), 6 (3x2), 9 (3x3)
    // Tránh totalTiles = 5,7,8 gây thừa slot grid
    const want = Math.max(4, Math.min(9, this.questions.length));
    this.totalTiles = (want <= 4) ? 4 : (want <= 6) ? 6 : 9;
    // Nếu chỉ có 1-3 câu: lặp lại câu hỏi để đủ mảnh, tránh finish sớm / q undefined
    while (this.questions.length < this.totalTiles) {
      this.questions = this.questions.concat(this.questions.slice(0, this.totalTiles - this.questions.length));
    }
    this.questions = this.questions.slice(0, this.totalTiles);
    // Luoi dong theo so cau: 4 -> 2x2, 6 -> 3x2, 9 -> 3x3
    this.gridCols = Math.ceil(Math.sqrt(this.totalTiles));
    this.gridRows = Math.ceil(this.totalTiles / this.gridCols);
    // Anh nen bi mat: content.coverImage (se co cho tai o Dot 3), tam dung gradient
    const rawCover = (this.content && this.content.coverImage) || '';
    this.coverImage = (/^data:image\//i.test(rawCover) || /^https?:\/\//i.test(rawCover)) ? rawCover : '';
    this.revealedTiles = new Set();
    this.currentQIndex = 0;
    this.attempts = 0;
    this._locked = false;
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
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Mảnh ghép bí mật</span>
        <span class="quiz-score">Đã mở: <strong>${this.revealedTiles.size}/${this.totalTiles}</strong> mảnh • Điểm <strong>${this.score}</strong></span>
      </div>

      <div class="game-body">
        <div class="quiz-progress" style="max-width:840px;" title="Tiến trình ${Math.round(this.revealedTiles.size / this.totalTiles * 100)}%">
          <div class="quiz-progress-fill" style="width: ${Math.round(this.revealedTiles.size / this.totalTiles * 100)}%;"></div>
        </div>
        <div class="jigsaw-layout">
        
        <!-- Puzzle Grid with mystery background image -->
        <div style="position: relative; width: min(300px, 100%); aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-md); flex-shrink: 0; ${this.coverImage ? '' : 'background: linear-gradient(135deg, #1E3A8A, #3B82F6, #10B981);'}">

          <!-- Underlying secret visual -->
          ${this.coverImage
            ? `<img src="${escHtml(this.coverImage)}" alt="Tranh bí mật" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FFF; text-align: center; padding: 20px;">
            <div style="font-size: 64px; margin-bottom: 8px;">🌟</div>
            <div style="font-size: 18px; font-weight: 700;">HỌC TẬP TỐT</div>
            <div style="font-size: 14px; opacity: 0.9;">Bức tranh bí mật đã được giải mã!</div>
          </div>`}

          <!-- Covering Tiles Grid -->
          <div id="jigsaw-tiles-grid" style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(${this.gridCols}, 1fr); grid-template-rows: repeat(${this.gridRows}, 1fr); gap: 2px;">
            ${Array.from({ length: this.totalTiles }).map((_, i) => `
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
                <span>${escHtml(ans)}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Trả lời đúng để lật mở ô tranh • Lượt thử: ${this.attempts} • Câu ${Math.min(this.currentQIndex + 1, this.totalTiles)}/${this.totalTiles}</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.jigsaw-opt-btn');
    bindSpeakButtons(this.viewportEl);
    optBtns.forEach(btn => {
      btn.onclick = () => {
        if (this._locked) return;
        const choice = parseInt(btn.getAttribute('data-index'), 10);
        this.attempts++;
        if (choice === q.correctAnswer) {
          this._locked = true;
          Sound.playCorrect();
          btn.classList.add('correct');
          optBtns.forEach(b => { b.disabled = true; });
          this.revealedTiles.add(this.revealedTiles.size); // Reveal next tile
          this.score += 15;
          this.gameTimeout(() => {
            this._locked = false;
            this.currentQIndex++;
            this.renderBoard();
          }, 800);
        } else {
          Sound.playWrong();
          btn.classList.add('incorrect', 'quiz-shake');
          const footerNote = this.viewportEl.querySelector('.game-footer span');
          if (footerNote) footerNote.textContent = `Chưa đúng, thử lại nhé! • Lượt thử: ${this.attempts}`;
          this.gameTimeout(() => { try { btn.classList.remove('incorrect', 'quiz-shake'); } catch (e) {} }, 600);
        }
      };
    });
  }

  renderResultScreen() {
    const accuracy = this.attempts ? Math.round(this.totalTiles / this.attempts * 100) : 100;
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Đã mở hết bức tranh bí mật!</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">🖼️</div>
          <h2 class="quiz-result-title">Mở ${this.revealedTiles.size}/${this.totalTiles} mảnh</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">🎯 Hiệu suất <strong>${Math.min(100, accuracy)}%</strong></span>
            <span class="quiz-stat">🔁 Lượt thử <strong>${this.attempts}</strong></span>
          </div>
          <div class="quiz-hint">${this.attempts <= this.totalTiles ? 'Hoàn hảo, đúng hết ngay lần đầu! 🏆' : 'Càng ít lượt thử càng giỏi!'}</div>
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
