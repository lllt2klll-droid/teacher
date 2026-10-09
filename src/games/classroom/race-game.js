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
    this.playerProgress = 0; // 0 to 100% (giữ tương thích: = max 2 đội)
    this.blueProgress = 0;
    this.redProgress = 0;
    this.currentTeam = 'blue';
    this.blueScore = 0;
    this.redScore = 0;
    this.state = 'playing';

    this.renderTrack();
  }

  elapsedStr() {
    const secs = Math.max(0, Math.round((Date.now() - (this.startTime || Date.now())) / 1000));
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  }

  renderTrack() {
    const q = this.questions[this.currentQIndex];
    this.playerProgress = Math.max(this.blueProgress, this.redProgress);
    if (!q || this.blueProgress >= 100 || this.redProgress >= 100) {
      this.finish();
      return;
    }
    const teamName = this.currentTeam === 'blue' ? 'ĐỘI XANH' : 'ĐỘI ĐỎ';
    const teamColor = this.currentTeam === 'blue' ? '#2563EB' : '#DC2626';
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Đua xe tốc độ</span>
        <span class="quiz-score">🔵 ${Math.floor(this.blueProgress)}% • 🔴 ${Math.floor(this.redProgress)}% • ⏱️ <strong>${this.elapsedStr()}</strong></span>
        <span class="badge" style="background:${teamColor};color:#fff;">Lượt: ${teamName}</span>
      </div>

      <div class="game-body race-body">
        <div style="font-size: 20px; font-weight: 800; color: ${teamColor}; margin-bottom: 6px;">👉 ${teamName} TRẢ LỜI (Câu ${Math.min(this.currentQIndex + 1, this.questions.length)}/${this.questions.length})</div>
        <div class="quiz-progress" title="Xanh ${Math.floor(this.blueProgress)}% — Đỏ ${Math.floor(this.redProgress)}%">
          <div class="quiz-progress-fill" style="width: ${Math.min(100, this.playerProgress)}%;"></div>
        </div>

        <!-- Race Track: 2 xe thi đua đồng đội -->
        <div class="race-track" style="margin-bottom: 8px;">
          <div class="race-lane"></div>
          <div class="race-finish"></div>
          <div id="race-car-blue" class="race-car" title="Đội Xanh" style="left: calc(${Math.min(90, this.blueProgress)}%); top: 6px; transition: left 0.6s ease;">
            🔵🏎️
          </div>
        </div>
        <div class="race-track">
          <div class="race-lane"></div>
          <div class="race-finish"></div>
          <div id="race-car-red" class="race-car" title="Đội Đỏ" style="left: calc(${Math.min(90, this.redProgress)}%); top: 6px; transition: left 0.6s ease;">
            🔴🏎️
          </div>
        </div>

        <!-- Question Section -->
        <div class="quiz-card race-quiz-card" id="race-quiz-card">
          <div class="quiz-hint" style="margin-bottom:6px;">${teamName} trả lời đúng để xe đội mình tăng tốc về đích:</div>
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
        <span class="quiz-hint">Đúng +${Math.round(this.step)}% đường cho đội mình • Sai xe khựng lại, đổi lượt</span>
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
        const team = this.currentTeam;
        if (choice === q.correctAnswer) {
          Sound.playCorrect();
          btn.classList.add('correct');
          this.correctCount++;
          if (team === 'blue') {
            this.blueProgress = Math.min(100, this.blueProgress + this.step);
            this.blueScore++;
          } else {
            this.redProgress = Math.min(100, this.redProgress + this.step);
            this.redScore++;
          }
          this.score += 20;
          this.playerProgress = Math.max(this.blueProgress, this.redProgress);
        } else {
          Sound.playWrong();
          btn.classList.add('incorrect');
          // Sai xe khựng lại 1 nhịp để HS cảm nhận được
          try {
            const car = this.viewportEl.querySelector(team === 'blue' ? '#race-car-blue' : '#race-car-red');
            const card = this.viewportEl.querySelector('#race-quiz-card');
            if (car) {
              car.classList.remove('quiz-shake');
              void car.offsetWidth;
              car.classList.add('quiz-shake');
            }
            if (card) {
              card.classList.remove('quiz-shake');
              void card.offsetWidth;
              card.classList.add('quiz-shake');
            }
          } catch (e) {}
        }

        this.currentTeam = this.currentTeam === 'blue' ? 'red' : 'blue';
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
    let winner = 'HÒA NHAU 🤝';
    if (this.blueProgress > this.redProgress) winner = 'ĐỘI XANH 🔵 THẮNG!';
    else if (this.redProgress > this.blueProgress) winner = 'ĐỘI ĐỎ 🔴 THẮNG!';
    else if (this.blueScore > this.redScore) winner = 'ĐỘI XANH 🔵 (hơn điểm)';
    else if (this.redScore > this.blueScore) winner = 'ĐỘI ĐỎ 🔴 (hơn điểm)';
    const grade = acc >= 90 ? 'Vô địch! 🏆' : acc >= 75 ? 'Tuyệt vời! 🎉' : acc >= 50 ? 'Về đích! 💪' : 'Cố lên, đua lại nhé! 🌱';
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Về đích! 🏁 ${winner}</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">🏁</div>
          <h2 class="quiz-result-title">${winner} — Đúng ${this.correctCount}/${total} câu (${acc}%)</h2>
          <div class="quiz-grade">${grade}</div>
          <div class="quiz-stat-row">
            <span class="quiz-stat">🔵 Xanh <strong>${Math.floor(this.blueProgress)}%</strong></span>
            <span class="quiz-stat">🔴 Đỏ <strong>${Math.floor(this.redProgress)}%</strong></span>
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">⏱️ <strong>${mm}:${ss}</strong></span>
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
