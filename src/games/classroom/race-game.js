/* ==========================================================================
   TeacherStudio Race Game - Animal / Car Racing Track Classroom Activity
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, teacherBadgeHtml, escHtml } from '../question-media.js';

export class RaceGame extends BaseGame {
  start() {
    this.questions = (this.content?.questions || []).length > 0 ? this.content.questions : [
      { question: 'Màu cờ Tổ quốc Việt Nam?', answers: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'], correctAnswer: 0 },
      { question: '7 + 5 = ?', answers: ['11', '12', '13', '10'], correctAnswer: 1 },
      { question: 'Con vật nào đẻ trứng?', answers: ['Gà', 'Chó', 'Mèo', 'Bò'], correctAnswer: 0 },
      { question: 'Một tuần có mấy ngày?', answers: ['5', '6', '7', '8'], correctAnswer: 2 }
    ];
    this.currentQIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.startTime = Date.now();
    // Tien % theo tong so cau: dung het = ve dich (khong con +25% cung)
    this.step = 100 / this.questions.length;
    this.playerProgress = 0; // 0 to 100%
    this.state = 'playing';

    this.renderTrack();
  }

  elapsedStr() {
    const secs = Math.max(0, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  }

  renderTrack() {
    const q = this.questions[this.currentQIndex];
    if (!q || this.playerProgress >= 100) {
      this.finish();
      return;
    }
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Đua xe tốc độ</span>
        <span class="quiz-score">Đúng ${this.correctCount}/${this.questions.length} • <strong>${Math.min(100, Math.floor(this.playerProgress))}%</strong> • ⏱️ <strong>${this.elapsedStr()}</strong></span>
      </div>

      <div class="game-body race-body">
        <div class="quiz-progress" title="Quãng đường ${Math.min(100, Math.floor(this.playerProgress))}%">
          <div class="quiz-progress-fill" style="width: ${Math.min(100, this.playerProgress)}%;"></div>
        </div>

        <!-- Race Track -->
        <div class="race-track">
          <!-- Track dashed line -->
          <div class="race-lane"></div>
          <!-- Finish Line -->
          <div class="race-finish"></div>
          
          <!-- Race Car -->
          <div id="race-car" class="race-car" style="left: calc(${Math.min(90, this.playerProgress)}%);">
            🏎️
          </div>
        </div>

        <!-- Question Section -->
        <div class="quiz-card race-quiz-card">
          <div class="quiz-hint" style="margin-bottom:6px;">Trả lời đúng để xe tăng tốc về đích:</div>
          ${questionImageHtml(q, 140)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          <div style="display: flex; align-items: flex-start; justify-content: center; gap: 8px; margin-bottom: 20px;">
            <div style="font-size: 18px; font-weight: 600; flex: 1;">${escHtml(q.question)}</div>
            ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${escHtml(q.question)}" title="Đọc to câu hỏi">🔊</button>` : ''}
          </div>

          <div class="gv-grid-2" style="gap: 12px;">
            ${(q.answers || []).map((ans, idx) => `
              <button class="game-option-btn race-opt-btn" data-index="${idx}">
                <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${escHtml(ans)}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Trả lời đúng mọi câu để xe về đích 100% • Sai không bị trừ đường</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.race-opt-btn');
    bindSpeakButtons(this.viewportEl);
    this._locked = false;
    optBtns.forEach(btn => {
      btn.onclick = () => {
        if (this._locked) return;
        this._locked = true;
        optBtns.forEach(b => { b.disabled = true; });
        const choice = parseInt(btn.getAttribute('data-index'), 10);
        if (choice === q.correctAnswer) {
          Sound.playCorrect();
          btn.classList.add('correct');
          this.correctCount++;
          this.playerProgress = Math.min(100, this.playerProgress + this.step);
          this.score += 20;
        } else {
          Sound.playWrong();
          btn.classList.add('incorrect');
        }

        this.currentQIndex++;
        this.gameTimeout(() => { this._locked = false; this.renderTrack(); }, 900);
      };
    });
  }

  renderResultScreen() {
    const secs = Math.max(1, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    const total = this.questions.length || 1;
    const acc = Math.round(this.correctCount / total * 100);
    const mm = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    const grade = acc >= 90 ? 'Vô địch! 🏆' : acc >= 75 ? 'Tuyệt vời! 🎉' : acc >= 50 ? 'Về đích! 💪' : 'Cố lên, đua lại nhé! 🌱';
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Về đích! 🏁</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">🏁</div>
          <h2 class="quiz-result-title">Đúng ${this.correctCount}/${total} câu (${acc}%)</h2>
          <div class="quiz-grade">${grade}</div>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">⏱️ <strong>${mm}:${ss}</strong></span>
            <span class="quiz-stat">🏎️ <strong>${Math.min(100, Math.floor(this.playerProgress))}%</strong> đường</span>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">
          🔄 Đua lại từ đầu
        </button>
      </div>
      <div class="game-footer">
        <span class="quiz-hint">TeacherStudio • ${acc}% chính xác • ${mm}:${ss}</span>
      </div>
    `;

    const restartBtn = this.viewportEl.querySelector('#btn-restart-game');
    if (restartBtn) {
      restartBtn.onclick = () => this.restart();
    }
  }
}
