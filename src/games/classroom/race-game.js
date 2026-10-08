/* ==========================================================================
   TeacherStudio Race Game - Animal / Car Racing Track Classroom Activity
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class RaceGame extends BaseGame {
  start() {
    this.questions = this.content?.questions || [];
    this.currentQIndex = 0;
    this.score = 0;
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
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Quãng đường: <strong>${Math.min(100, this.playerProgress)}%</strong></span>
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
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">${q.question}</div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Mỗi câu trả lời đúng tăng tốc tiến 25% quãng đường</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.race-opt-btn');
    optBtns.forEach(btn => {
      btn.onclick = () => {
        const choice = parseInt(btn.getAttribute('data-index'), 10);
        if (choice === q.correctAnswer) {
          Sound.playCorrect();
          btn.classList.add('correct');
          this.playerProgress += 25;
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
}
