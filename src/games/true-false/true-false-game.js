/* ==========================================================================
   TeacherStudio True/False Game - Quick Binary Choice
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, questionTextRow, teacherBadgeHtml } from '../question-media.js';

export class TrueFalseGame extends BaseGame {
  start() {
    this.questions = this.content?.questions || [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.state = 'playing';
    this.bindKeyboard();
    this.renderCurrentQuestion();
  }

  bindKeyboard() {
    this.keyHandler = (e) => {
      if (this.state !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === '1') {
        this.selectAnswer(0);
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        this.selectAnswer(1);
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  renderCurrentQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q) {
      this.finish();
      return;
    }

    const totalQ = this.questions.length;
    const qNum = this.currentQuestionIndex + 1;

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Mệnh đề ${qNum} / ${totalQ}</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Điểm: <strong>${this.score}</strong></span>
      </div>

      <div class="game-body" style="max-width: 600px; margin: 0 auto; width: 100%; text-align: center;">
        ${questionImageHtml(q)}
        ${teacherBadgeHtml(q, this.options.teacherMode)}
        ${questionTextRow(q, 22, this.options.readAloud !== false)}

        <div class="gv-grid-2">
          <button class="btn tf-btn" id="btn-true" style="padding: 32px 20px; font-size: 24px; font-weight: 700; border-radius: 16px; border: 3px solid #4D7A5A; background-color: rgba(77, 122, 90, 0.1); color: #2D5838;">
            ✓ ĐÚNG
            <div style="font-size: 13px; font-weight: 400; opacity: 0.8; margin-top: 4px;">(Phím 1 hoặc ←)</div>
          </button>

          <button class="btn tf-btn" id="btn-false" style="padding: 32px 20px; font-size: 24px; font-weight: 700; border-radius: 16px; border: 3px solid #B45454; background-color: rgba(180, 84, 84, 0.1); color: #872828;">
            ✗ SAI
            <div style="font-size: 13px; font-weight: 400; opacity: 0.8; margin-top: 4px;">(Phím 2 hoặc →)</div>
          </button>
        </div>
      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Bấm trực tiếp hoặc dùng phím mũi tên ← →</span>
      </div>
    `;

    const btnTrue = this.viewportEl.querySelector('#btn-true');
    const btnFalse = this.viewportEl.querySelector('#btn-false');

    btnTrue.onclick = () => this.selectAnswer(0);
    btnFalse.onclick = () => this.selectAnswer(1);
    bindSpeakButtons(this.viewportEl);
  }

  selectAnswer(choice) {
    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    // 0 is True, 1 is False
    const isCorrect = choice === (q.correctAnswer || 0);

    const btnTrue = this.viewportEl.querySelector('#btn-true');
    const btnFalse = this.viewportEl.querySelector('#btn-false');

    if (btnTrue) btnTrue.disabled = true;
    if (btnFalse) btnFalse.disabled = true;

    if (isCorrect) {
      Sound.playCorrect();
      this.score += q.points || 10;
      if (choice === 0) btnTrue.style.backgroundColor = '#4D7A5A';
      else btnFalse.style.backgroundColor = '#4D7A5A';
    } else {
      Sound.playWrong();
      if (choice === 0) btnTrue.style.backgroundColor = '#B45454';
      else btnFalse.style.backgroundColor = '#B45454';
    }

    setTimeout(() => {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }, 1100);
  }

  destroy() {
    super.destroy();
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
  }
}
