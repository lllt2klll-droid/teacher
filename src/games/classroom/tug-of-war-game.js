/* ==========================================================================
   TeacherStudio Tug of War Game - Team Competition Game (Blue vs Red)
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, teacherBadgeHtml, escHtml } from '../question-media.js';

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
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Kéo co đồng đội</span>
        <span class="quiz-score">Câu ${Math.min(this.currentQIndex + 1, this.questions.length)}/${this.questions.length} • Đích ${this.goal} • Điểm <strong>${this.score}</strong></span>
        <span class="tug-score"><span class="tug-blue">🔵 ${this.blueScore}</span> - <span class="tug-red">${this.redScore} 🔴</span></span>
        <span class="badge tug-turn ${this.currentTeam}" style="background-color: ${teamColor};">LƯỢT: ${teamName}</span>
      </div>

      <div class="game-body tug-body">
        <div class="tug-meter" title="Dây đang lệch ${this.ropePosition}/${this.goal}">
          <span class="tug-flag left">🏁 XANH</span>
          <div class="tug-track">
            <div class="tug-center"></div>
            <div class="tug-rope"></div>
            <div id="rope-knot" class="tug-knot" style="left: calc(50% + ${Math.round(this.ropePosition * 150 / this.goal)}px);">🎀</div>
          </div>
          <span class="tug-flag right">ĐỎ 🏁</span>
        </div>

        <!-- Question Box -->
        <div style="width: 100%; background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 14px; color: ${teamColor}; font-weight: 700; margin-bottom: 8px;">${teamName} chuẩn bị trả lời:</div>
          ${questionImageHtml(q, 140)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          <div style="display: flex; align-items: flex-start; justify-content: center; gap: 8px; margin-bottom: 20px;">
            <div style="font-size: 20px; font-weight: 600; flex: 1;">${escHtml(q.question)}</div>
            ${this.options.readAloud !== false ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${escHtml(q.question)}" title="Đọc to câu hỏi">🔊</button>` : ''}
          </div>

          <div class="gv-grid-2" style="gap: 12px;">
            ${(q.answers || []).map((ans, idx) => `
              <button class="game-option-btn tug-opt-btn" data-index="${idx}" style="margin-bottom: 0;">
                <span class="game-option-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${escHtml(ans)}</span>
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

        this.gameTimeout(() => { this._locked = false; this.renderTurn(); }, 1000);
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
        <span class="quiz-score">${scoreLine} • Tổng <strong>${this.score}</strong> điểm</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${winner.includes('HÒA') ? '🤝' : '🏆'}</div>
          <h2 class="quiz-result-title">CHIẾN THẮNG: ${winner}</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat tug-blue">🔵 Xanh <strong>${this.blueScore}</strong></span>
            <span class="quiz-stat tug-red">🔴 Đỏ <strong>${this.redScore}</strong></span>
            <span class="quiz-stat">🧶 Dây <strong>${this.ropePosition}</strong>/${this.goal}</span>
          </div>
          <p class="quiz-hint">Hai đội đã thi đấu rất xuất sắc và đầy tinh thần đồng đội!</p>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-tug">🔄 Thi đấu hiệp mới</button>
      </div>
      <div class="game-footer">
        <span class="quiz-hint">TeacherStudio • ${scoreLine}</span>
      </div>
    `;

    const restartBtn = this.viewportEl.querySelector('#btn-restart-tug');
    if (restartBtn) restartBtn.onclick = () => this.start();
  }

  restart() {
    this.start();
  }
}
