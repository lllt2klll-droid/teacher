/* ==========================================================================
   TeacherStudio Quiz Game - Interactive Multiple Choice Quiz
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, questionTextRow, teacherBadgeHtml } from '../question-media.js';

export class QuizGame extends BaseGame {
  start() {
    this.questions = this.content?.questions || [];
    if (this.options.shuffleQuestions) {
      this.questions = [...this.questions].sort(() => Math.random() - 0.5);
    }
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.state = 'playing';
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    this.stopTimer();
    this.unbindKey();
    const q = this.questions[this.currentQuestionIndex];
    if (!q) {
      this.finish();
      return;
    }
    this._locked = false;

    const totalQ = this.questions.length;
    const qNum = this.currentQuestionIndex + 1;
    this.timeLeft = q.timeLimit || this.options.timerSeconds || 30;

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary">Câu ${qNum} / ${totalQ}</span>
          <span style="font-size: 13px; color: var(--theme-text-subtle);">Điểm: <strong>${this.score}</strong></span>
        </div>
        ${this.options.timerEnabled !== false ? `
          <div class="flex items-center gap-1 font-semibold" id="quiz-timer" style="color: var(--theme-primary); font-size: 15px;">
            ⏱ <span id="timer-val">${this.timeLeft}</span>s
          </div>
        ` : ''}
      </div>

      <div class="game-body" style="max-width: 680px; margin: 0 auto; width: 100%;">
        ${questionImageHtml(q)}
        ${teacherBadgeHtml(q, this.options.teacherMode)}
        ${questionTextRow(q, 20, this.options.readAloud !== false)}

        <div class="game-options-list" style="width: 100%;">
          ${(q.answers || []).map((ans, idx) => `
            <button class="game-option-btn" data-index="${idx}">
              <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
              <span>${ans}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-explanation-box" style="display: none; margin-top: 16px; padding: 12px; background: rgba(0,0,0,0.04); border-radius: 8px; width: 100%; text-align: left; font-size: 14px;">
          <strong>Giải thích:</strong> <span id="quiz-explanation-text"></span>
        </div>
      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Phím tắt: Bấm phím 1, 2, 3, 4 trên bàn phím để chọn</span>
        <button class="btn btn-secondary btn-sm" id="btn-skip-q">Bỏ qua →</button>
      </div>
    `;

    // Bind click handlers
    const optionBtns = this.viewportEl.querySelectorAll('.game-option-btn');
    bindSpeakButtons(this.viewportEl);
    this.bindKeyboard(q, optionBtns.length);
    optionBtns.forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        this.handleAnswer(idx, q);
      };
    });

    const skipBtn = this.viewportEl.querySelector('#btn-skip-q');
    if (skipBtn) {
      skipBtn.onclick = () => {
        this.currentQuestionIndex++;
        this.renderCurrentQuestion();
      };
    }

    // Start question timer
    if (this.options.timerEnabled !== false) {
      this.timer = setInterval(() => {
        this.timeLeft--;
        const valEl = this.viewportEl.querySelector('#timer-val');
        if (valEl) valEl.textContent = this.timeLeft;

        if (this.timeLeft <= 5 && this.timeLeft > 0) {
          Sound.playTick();
        }

        if (this.timeLeft <= 0) {
          this.stopTimer();
          Sound.playWrong();
          this.handleAnswer(-1, q); // Timeout
        }
      }, 1000);
    }
  }

  bindKeyboard(q, optionCount) {
    this.bindKey((e) => {
      if (this.state !== 'playing' || this._locked) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = map[String(e.key).toLowerCase()];
      if (idx !== undefined && idx < optionCount) {
        this.handleAnswer(idx, q);
      }
    });
  }

  handleAnswer(selectedIndex, q) {
    if (this._locked) return;
    this._locked = true;
    this.stopTimer();
    const isCorrect = selectedIndex === q.correctAnswer;
    const optionBtns = this.viewportEl.querySelectorAll('.game-option-btn');
    
    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });

    if (isCorrect) {
      Sound.playCorrect();
      this.score += q.points || 10;
    } else {
      Sound.playWrong();
    }

    // Show explanation if enabled
    if (this.options.showExplanation && q.explanation) {
      const expBox = this.viewportEl.querySelector('#quiz-explanation-box');
      const expText = this.viewportEl.querySelector('#quiz-explanation-text');
      if (expBox && expText) {
        expText.textContent = q.explanation;
        expBox.style.display = 'block';
      }
    }

    // Move to next question after short delay
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }, this.options.showExplanation && q.explanation ? 2400 : 1200);
  }
}
