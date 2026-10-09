/* ==========================================================================
   TeacherStudio Tug of War Game - Team Competition Game (Blue vs Red)
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, teacherBadgeHtml } from '../question-media.js';

export class TugOfWarGame extends BaseGame {
  start() {
    this.questions = this.content?.questions || [];
    if (this.questions.length === 0) {
      this.questions = [
        { question: '12 x 5 = ?', answers: ['50', '60', '70', '55'], correctAnswer: 1 },
        { question: 'Số nguyên tố nhỏ nhất là số nào?', answers: ['1', '2', '3', '0'], correctAnswer: 1 },
        { question: 'Có bao nhiêu tháng có 31 ngày trong năm?', answers: ['6 tháng', '7 tháng', '8 tháng', '5 tháng'], correctAnswer: 1 }
      ];
    }

    this.currentQIndex = 0;
    this.ropePosition = 0; // -goal (Blue wins) to +goal (Red wins)
    this.goal = (this.options.tugGoal > 0) ? this.options.tugGoal : 50;
    this.pullStep = Math.max(5, Math.round(this.goal / 2.5));
    this.currentTeam = 'blue'; // 'blue' or 'red'
    this.blueScore = 0;
    this.redScore = 0;
    this.state = 'playing';

    this.renderTurn();
  }

  renderTurn() {
    const q = this.questions[this.currentQIndex];
    if (!q || Math.abs(this.ropePosition) >= this.goal) {
      this.finishCompetition();
      return;
    }

    const teamName = this.currentTeam === 'blue' ? 'ĐỘI XANH' : 'ĐỘI ĐỎ';
    const teamColor = this.currentTeam === 'blue' ? '#2563EB' : '#DC2626';

    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Kéo co đồng đội</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Câu ${Math.min(this.currentQIndex + 1, this.questions.length)}/${this.questions.length} • Đích ${this.goal}</span>
        <span style="font-size: 13px; font-weight: 700;"><span style="color: #2563EB;">🔵 ${this.blueScore}</span> - <span style="color: #DC2626;">${this.redScore} 🔴</span></span>
        <span class="badge" style="background-color: ${teamColor}; color: #FFF; font-weight: 700;">LƯỢT CỦA: ${teamName}</span>
      </div>

      <div class="game-body" style="width: 100%; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
        
        <!-- Tug of War Visual Track -->
        <div style="width: 100%; height: 90px; background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 16px; position: relative; overflow: hidden; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
          <!-- Center mark -->
          <div style="position: absolute; width: 2px; height: 100%; background: #94A3B8; left: 50%;"></div>
          <!-- Left team goal -->
          <div style="position: absolute; left: 16px; font-weight: 700; color: #2563EB; font-size: 14px;">🏁 ĐỘI XANH</div>
          <!-- Right team goal -->
          <div style="position: absolute; right: 16px; font-weight: 700; color: #DC2626; font-size: 14px;">ĐỘI ĐỎ 🏁</div>

          <!-- Rope and knot -->
          <div style="position: absolute; width: 70%; height: 8px; background: #B45309; border-radius: 4px; left: 15%;"></div>
          <!-- Knot ribbon indicator -->
          <div id="rope-knot" style="position: absolute; left: calc(50% + ${Math.round(this.ropePosition * 150 / this.goal)}px); width: 28px; height: 28px; background: #FBBF24; border: 3px solid #78350F; border-radius: 50%; transform: translateX(-50%); transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; font-size: 12px;">
            🎀
          </div>
        </div>

        <!-- Question Box -->
        <div style="width: 100%; background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 14px; color: ${teamColor}; font-weight: 700; margin-bottom: 8px;">${teamName} chuẩn bị trả lời:</div>
          ${questionImageHtml(q, 140)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          <div style="display: flex; align-items: flex-start; justify-content: center; gap: 8px; margin-bottom: 20px;">
            <div style="font-size: 20px; font-weight: 600; flex: 1;">${q.question}</div>
            ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${q.question.replace(/"/g, '&quot;')}" title="Đọc to câu hỏi">🔊</button>` : ''}
          </div>

          <div class="gv-grid-2" style="gap: 12px;">
            ${(q.answers || []).map((ans, idx) => `
              <button class="game-option-btn tug-opt-btn" data-index="${idx}" style="margin-bottom: 0;">
                <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${ans}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Trả lời đúng kéo dây về phía đội mình • Hết câu thì đội nhiều điểm hơn thắng</span>
      </div>
    `;

    const optBtns = this.viewportEl.querySelectorAll('.tug-opt-btn');
    bindSpeakButtons(this.viewportEl);
    optBtns.forEach(btn => {
      btn.onclick = () => {
        const choice = parseInt(btn.getAttribute('data-index'), 10);
        if (choice === q.correctAnswer) {
          Sound.playCorrect();
          btn.classList.add('correct');
          // Pull rope towards current team + team point
          if (this.currentTeam === 'blue') {
            this.ropePosition -= this.pullStep;
            this.blueScore++;
          } else {
            this.ropePosition += this.pullStep;
            this.redScore++;
          }
          this.score += 10;
        } else {
          Sound.playWrong();
          btn.classList.add('incorrect');
        }

        // Switch turn
        this.currentTeam = this.currentTeam === 'blue' ? 'red' : 'blue';
        this.currentQIndex++;

        setTimeout(() => this.renderTurn(), 1000);
      };
    });
  }

  finishCompetition() {
    this.state = 'finished';
    Sound.playCheer();
    // Phan thang: day cham dich truoc; het cau thi xet day, roi diem doi
    let winner;
    if (this.ropePosition < 0) winner = 'ĐỘI XANH 🔵';
    else if (this.ropePosition > 0) winner = 'ĐỘI ĐỎ 🔴';
    else if (this.blueScore > this.redScore) winner = 'ĐỘI XANH 🔵 (hơn điểm)';
    else if (this.redScore > this.blueScore) winner = 'ĐỘI ĐỎ 🔴 (hơn điểm)';
    else winner = 'HÒA NHAU 🤝';
    const scoreLine = `Tỉ số chung cuộc: Xanh ${this.blueScore} - ${this.redScore} Đỏ`;
    
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-success">Kéo co hoàn tất!</span>
      </div>
      <div class="game-body text-center">
        <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
        <h2 style="font-size: 28px; margin-bottom: 12px;">CHIẾN THẮNG: ${winner}</h2>
        <p style="color: var(--theme-text-subtle); margin-bottom: 8px;">${scoreLine}</p>
        <p style="color: var(--theme-text-subtle); margin-bottom: 24px;">Hai đội đã thi đấu rất xuất sắc và đầy tinh thần đồng đội!</p>
        <button class="btn btn-primary btn-lg" id="btn-restart-tug">🔄 Thi đấu hiệp mới</button>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio</span>
      </div>
    `;

    const restartBtn = this.viewportEl.querySelector('#btn-restart-tug');
    if (restartBtn) restartBtn.onclick = () => this.start();
  }

  restart() {
    this.start();
  }
}
