/* ==========================================================================
   TeacherStudio Race Game - Animal / Car Racing Track Classroom Activity
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, teacherBadgeHtml } from '../question-media.js';

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

  renderTrack() {
    const q = this.questions[this.currentQIndex];
    if (!q || this.playerProgress >= 100) {
      this.finish();
      return;
    }
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Đua xe tốc độ</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đúng ${this.correctCount}/${this.questions.length} câu • Quãng đường: <strong>${Math.min(100, Math.floor(this.playerProgress))}%</strong></span>
      </div>

      <div class="game-body" style="width: 100%; max-width: 800px; margin: 0 auto;">
        
        <!-- Race Track -->
        <div style="width: 100%; height: 80px; background: #334155; border-radius: 12px; position: relative; overflow: hidden; margin-bottom: 24px; border: 3px solid #1E293B;">
          <!-- Track dashed line -->
          <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; border-top: 2px dashed #CBD5E1;"></div>
          <!-- Finish Line -->
          <div style="position: absolute; right: 12px; top: 0; bottom: 0; width: 14px; background: repeating-linear-gradient(45deg, #000, #000 6px, #FFF 6px, #FFF 12px);"></div>
          
          <!-- Race Car -->
          <div id="race-car" style="position: absolute; left: calc(${Math.min(90, this.playerProgress)}%); top: 50%; transform: translateY(-50%); font-size: 32px; transition: left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
            🏎️
          </div>
        </div>

        <!-- Question Section -->
        <div style="background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 14px; color: var(--theme-text-subtle); margin-bottom: 6px;">Trả lời đúng để xe tăng tốc về đích:</div>
          ${questionImageHtml(q, 140)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          <div style="display: flex; align-items: flex-start; justify-content: center; gap: 8px; margin-bottom: 20px;">
            <div style="font-size: 18px; font-weight: 600; flex: 1;">${q.question}</div>
            ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${q.question.replace(/"/g, '&quot;')}" title="Đọc to câu hỏi">🔊</button>` : ''}
          </div>

          <div class="gv-grid-2" style="gap: 12px;">
            ${(q.answers || []).map((ans, idx) => `
              <button class="game-option-btn race-opt-btn" data-index="${idx}">
                <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${ans}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Trả lời đúng mọi câu để xe về đích 100%</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.race-opt-btn');
    bindSpeakButtons(this.viewportEl);
    optBtns.forEach(btn => {
      btn.onclick = () => {
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
        setTimeout(() => this.renderTrack(), 900);
      };
    });
  }

  renderResultScreen() {
    const secs = Math.max(1, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    const total = this.questions.length || 1;
    const acc = Math.round(this.correctCount / total * 100);
    const mm = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Về đích! 🏁</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body text-center">
        <div style="font-size: 48px; margin-bottom: 12px;">🏁</div>
        <h2 style="font-size: 26px; margin-bottom: 8px;">Đúng ${this.correctCount}/${total} câu (${acc}%)</h2>
        <p style="font-size: 16px; color: var(--theme-text-subtle); margin-bottom: 24px;">
          Thời gian: <strong>${mm}:${ss}</strong> • Điểm số: <strong style="color: var(--theme-primary); font-size: 24px;">${this.score}</strong> điểm
        </p>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">
          🔄 Đua lại từ đầu
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
