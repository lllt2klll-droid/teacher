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
    this.picks = [];
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
        <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.08); border-radius: 3px; margin-bottom: 16px;" title="Tiến trình ${qNum}/${totalQ}">
          <div style="height: 100%; width: ${Math.round((qNum - 1) / totalQ * 100)}%; background: var(--theme-primary); border-radius: 3px; transition: width 0.3s;"></div>
        </div>
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
    this.picks.push({ question: q.question, picked: selectedIndex, correct: q.correctAnswer, answers: q.answers || [], ok: isCorrect, explanation: q.explanation || '' });
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

  renderResultScreen() {
    const totalQ = this.questions.length || 1;
    const okCount = this.picks.filter(p => p.ok).length;
    const acc = Math.round(okCount / totalQ * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">${this.project.name || 'Kết quả'}</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body" style="max-width: 640px; margin: 0 auto; width: 100%;">
        <div class="text-center" style="margin-bottom: 16px;">
          <div style="font-size: 48px;">🎉</div>
          <h2 style="font-size: 24px; margin-bottom: 4px;">Đúng ${okCount}/${totalQ} câu (${acc}%)</h2>
          <p style="font-size: 16px; color: var(--theme-text-subtle);">
            Điểm số: <strong style="color: var(--theme-primary); font-size: 22px;">${this.score}</strong> điểm
          </p>
        </div>
        <div style="width: 100%; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          ${(this.picks || []).map((p, i) => `
            <div style="padding: 10px 14px; border: 1px solid var(--theme-border); border-radius: 8px; background: var(--theme-surface); font-size: 14px; text-align: left;">
              <div style="font-weight: 600; margin-bottom: 4px;">${i + 1}. ${p.question} ${p.ok ? '✓' : '✗'}</div>
              <div style="color: ${p.ok ? '#2D5838' : '#872828'};">
                Trả lời: ${p.picked >= 0 ? (p.answers[p.picked] ?? '?') : 'Hết giờ'} • Đáp án: ${p.answers[p.correct] ?? '?'}
              </div>
              ${p.explanation ? `<div style="color: var(--theme-text-subtle); margin-top: 4px;">Giải thích: ${p.explanation}</div>` : ''}
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">
          🔄 Chơi lại từ đầu
        </button>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio</span>
      </div>
    `;

    const restartBtn = this.viewportEl.querySelector('#btn-restart-game');
    if (restartBtn) {
      restartBtn.onclick = () => this.restart();
    }
  }
}
