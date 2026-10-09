/* ==========================================================================
   TeacherStudio True/False Game - Quick Binary Choice
   v3: khung thẻ, timer vòng tròn, streak + thưởng, hiệu ứng, kết quả chi tiết
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, questionTextRow, teacherBadgeHtml, escHtml } from '../question-media.js';

export class TrueFalseGame extends BaseGame {
  start() {
    this.questions = (this.content?.questions || []).map(q => ({
      ...q,
      correctAnswer: (q.correctAnswer === 1) ? 1 : 0
    }));
    if (this.options.shuffleQuestions) {
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = this.questions[i]; this.questions[i] = this.questions[j]; this.questions[j] = t;
      }
    }
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.picks = [];
    this.qStartAt = 0;
    this.speedBonus = this.options.speedBonus !== false;
    this.streakBonus = this.options.streakBonus !== false;
    this.state = 'playing';
    this.bindKeyboard();
    this.renderCurrentQuestion();
  }

  bindKeyboard() {
    this.bindKey((e) => {
      if (this.state !== 'playing' || this._locked) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft' || e.key === '1' || e.key.toLowerCase() === 'd') {
        this.selectAnswer(0);
      } else if (e.key === 'ArrowRight' || e.key === '2' || e.key.toLowerCase() === 's') {
        this.selectAnswer(1);
      }
    });
  }

  renderCurrentQuestion() {
    this.clearGameTimeouts();
    this.stopTimer();
    const q = this.questions[this.currentQuestionIndex];
    if (!q) {
      this.finish();
      return;
    }

    const totalQ = this.questions.length;
    const qNum = this.currentQuestionIndex + 1;
    this._locked = false;
    this.timeLeft = q.timeLimit || this.options.timerSeconds || 30;
    this.timeTotal = this.timeLeft;
    this.qStartAt = Date.now();
    const pct = Math.round((qNum - 1) / totalQ * 100);
    const streakHtml = this.streak >= 2 ? `<span class="quiz-streak" title="Chuỗi đúng liên tiếp">🔥 x${this.streak}</span>` : '';

    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary">Mệnh đề ${qNum} / ${totalQ}</span>
          ${streakHtml}
          <span class="quiz-score">Điểm: <strong>${this.score}</strong> <span class="quiz-sub">• Đúng ${this.correctCount}/${totalQ}</span></span>
        </div>
        ${this.options.timerEnabled !== false ? `
          <div class="quiz-timer" id="tf-timer" title="Thời gian còn lại">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="5"/>
              <circle id="tf-timer-ring" cx="20" cy="20" r="16" fill="none" stroke="var(--theme-primary)" stroke-width="5"
                stroke-linecap="round" stroke-dasharray="100.5" stroke-dashoffset="0" transform="rotate(-90 20 20)"/>
            </svg>
            <span id="tf-timer-val">${this.timeLeft}</span>
          </div>
        ` : ''}
      </div>

      <div class="game-body tf-body">
        <div class="quiz-progress" title="Tiến trình ${qNum}/${totalQ}">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="quiz-card tf-card quiz-enter">
          <div class="tf-quote-mark">❝</div>
          ${questionImageHtml(q)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          ${questionTextRow(q, 22, this.options.readAloud !== false)}

          <div class="tf-choices">
            <button class="tf-choice is-true" id="btn-true">
              <span class="tf-icon">✓</span>
              <span class="tf-label">ĐÚNG</span>
              <span class="tf-key">Phím 1 / ← / D</span>
            </button>
            <button class="tf-choice is-false" id="btn-false">
              <span class="tf-icon">✗</span>
              <span class="tf-label">SAI</span>
              <span class="tf-key">Phím 2 / → / S</span>
            </button>
          </div>
          <div id="tf-explain-box" class="quiz-explain" style="display:none;">
            <strong>Giải thích:</strong> <span id="tf-explain-text"></span>
          </div>
          <div id="tf-bonus-note" class="quiz-bonus-note"></div>
        </div>
      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Bấm trực tiếp hoặc dùng phím ← → • Trả lời nhanh được thưởng</span>
        <button class="btn btn-secondary btn-sm" id="btn-skip-tf">Bỏ qua →</button>
      </div>
    `;

    const btnTrue = this.viewportEl.querySelector('#btn-true');
    const btnFalse = this.viewportEl.querySelector('#btn-false');

    btnTrue.onclick = () => this.selectAnswer(0);
    btnFalse.onclick = () => this.selectAnswer(1);
    // Vuốt trái/phải trên máy tính bảng = chọn Sai/Đúng (HS lớp 1 thao tác nhanh)
    try {
      const card = this.viewportEl.querySelector('.tf-card');
      let tx = null;
      if (card) {
        card.addEventListener('touchstart', (e) => {
          tx = e.touches && e.touches[0] ? e.touches[0].clientX : null;
        }, { passive: true });
        card.addEventListener('touchend', (e) => {
          if (tx == null) return;
          const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : tx;
          const dx = endX - tx;
          tx = null;
          if (Math.abs(dx) < 40) return;
          this.selectAnswer(dx > 0 ? 1 : 0);
        }, { passive: true });
      }
    } catch (e) {}
    const skipBtn = this.viewportEl.querySelector('#btn-skip-tf');
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (this._locked) return;
        this.streak = 0;
        this.picks.push({ question: q.question, picked: -2, correct: q.correctAnswer ?? 0, ok: false, explanation: '' });
        this.stopTimer();
        this.currentQuestionIndex++;
        this.renderCurrentQuestion();
      };
    }
    bindSpeakButtons(this.viewportEl);

    if (this.options.timerEnabled !== false) {
      this.updateTimerRing();
      this.timer = setInterval(() => {
        this.timeLeft--;
        const valEl = this.viewportEl.querySelector('#tf-timer-val');
        if (valEl) valEl.textContent = Math.max(0, this.timeLeft);
        this.updateTimerRing();
        if (this.timeLeft <= 5 && this.timeLeft > 0) {
          Sound.playTick();
          const t = this.viewportEl.querySelector('#tf-timer');
          if (t) { t.classList.remove('quiz-urgent'); void t.offsetWidth; t.classList.add('quiz-urgent'); }
        }
        if (this.timeLeft <= 0) {
          this.stopTimer();
          Sound.playWrong();
          this.selectAnswer(-1);
        }
      }, 1000);
    }
  }

  updateTimerRing() {
    const ring = this.viewportEl.querySelector('#tf-timer-ring');
    const wrap = this.viewportEl.querySelector('#tf-timer');
    if (!ring) return;
    const total = Math.max(1, this.timeTotal || 30);
    const frac = Math.max(0, this.timeLeft) / total;
    ring.style.strokeDashoffset = String(100.5 * (1 - frac));
    ring.style.stroke = this.timeLeft <= 5 ? '#B45454' : 'var(--theme-primary)';
    if (wrap) wrap.classList.toggle('is-low', this.timeLeft <= 5);
  }

  selectAnswer(choice) {
    if (this._locked || this.state !== 'playing') return;
    this._locked = true;
    this.stopTimer();
    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    // 0 is True, 1 is False
    const isCorrect = choice === (q.correctAnswer ?? 0);
    const timedOut = choice === -1;
    const skipped = choice === -2;
    this.picks.push({ question: q.question, picked: choice, correct: q.correctAnswer ?? 0, ok: isCorrect, explanation: q.explanation || '' });

    const btnTrue = this.viewportEl.querySelector('#btn-true');
    const btnFalse = this.viewportEl.querySelector('#btn-false');
    if (btnTrue) btnTrue.disabled = true;
    if (btnFalse) btnFalse.disabled = true;

    let gained = 0;
    let note = '';
    const reflexSec = Math.max(0, (Date.now() - (this.qStartAt || Date.now())) / 1000);
    if (isCorrect) {
      Sound.playCorrect();
      this.correctCount++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      gained = q.points || 10;
      // Hiện thời gian phản xạ để thi đua (VD: Phản xạ 2.3s)
      note += `⚡ Phản xạ ${reflexSec.toFixed(1)}s • `;
      if (this.speedBonus && this.options.timerEnabled !== false && this.timeTotal > 0) {
        const elapsed = reflexSec;
        if (elapsed < this.timeTotal * 0.5) {
          const extra = Math.max(1, Math.round(gained * 0.3));
          gained += extra;
          note += `Nhanh +${extra} • `;
        }
      }
      if (this.streakBonus && this.streak % 3 === 0) {
        gained += 5;
        note += `🔥 Chuỗi ${this.streak} +5 • `;
      }
      this.score += gained;
      note += `+${gained}đ`;
      const winBtn = choice === 0 ? btnTrue : btnFalse;
      if (winBtn) { winBtn.classList.add('is-win'); this.floatBonus(winBtn, `+${gained}`); }
      const loseBtn = choice === 0 ? btnFalse : btnTrue;
      if (loseBtn) loseBtn.classList.add('is-dim');
      if (this.streak >= 2) this.burstConfetti();
    } else {
      Sound.playWrong();
      this.streak = 0;
      const badBtn = choice === 0 ? btnTrue : choice === 1 ? btnFalse : null;
      if (badBtn) badBtn.classList.add('is-lose', 'quiz-shake');
      const goodBtn = (q.correctAnswer ?? 0) === 0 ? btnTrue : btnFalse;
      if (goodBtn) goodBtn.classList.add('is-reveal');
      note = timedOut ? 'Hết giờ!' : skipped ? 'Đã bỏ qua' : 'Chưa đúng, cố lên!';
    }

    const noteEl = this.viewportEl.querySelector('#tf-bonus-note');
    if (noteEl && note) {
      noteEl.textContent = note;
      noteEl.classList.add('show', isCorrect ? 'good' : 'bad');
    }
    // Cập nhật điểm + streak trên header ngay
    const head = this.viewportEl.querySelector('.quiz-score strong');
    if (head) head.textContent = this.score;

    // Hien giai thich (neu co) truoc khi sang cau moi — 2200ms khi có giải thích
    if (q.explanation) {
      const box = this.viewportEl.querySelector('#tf-explain-box');
      const txt = this.viewportEl.querySelector('#tf-explain-text');
      if (box && txt) { txt.textContent = q.explanation; box.style.display = 'block'; }
    }

    this.gameTimeout(() => {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }, q.explanation ? 2200 : 1100);
  }

  floatBonus(btnEl, text) {
    try {
      const host = this.viewportEl.querySelector('.tf-card') || this.viewportEl;
      const s = document.createElement('div');
      s.className = 'quiz-float-points';
      s.textContent = text;
      host.appendChild(s);
      s.style.left = '50%'; s.style.top = '30%';
      setTimeout(() => { try { s.remove(); } catch (e) {} }, 1100);
    } catch (e) {}
  }

  burstConfetti() {
    try {
      const host = this.viewportEl.querySelector('.tf-card') || this.viewportEl;
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('span');
        p.className = 'quiz-confetti';
        p.textContent = ['🎉', '⭐', '✨', '🔥'][i % 4];
        p.style.left = (10 + Math.random() * 80) + '%';
        p.style.animationDelay = (Math.random() * 0.25) + 's';
        host.appendChild(p);
        setTimeout(() => { try { p.remove(); } catch (e) {} }, 1200);
      }
    } catch (e) {}
  }

  gradeOf(acc) {
    if (acc >= 90) return { t: 'Xuất sắc! 🏆', c: '#15803D' };
    if (acc >= 75) return { t: 'Giỏi! 🎉', c: '#2F7C48' };
    if (acc >= 50) return { t: 'Khá! 💪', c: '#B45309' };
    return { t: 'Cố gắng thêm nhé! 🌱', c: '#B45454' };
  }

  renderResultScreen() {
    this.stopTimer();
    this.unbindKey();
    this.clearGameTimeouts();
    const totalQ = this.questions.length || 1;
    const okCount = this.picks.filter(p => p.ok).length;
    const skipped = this.picks.filter(p => p.picked === -2).length;
    const acc = Math.round(okCount / totalQ * 100);
    const grade = this.gradeOf(acc);
    const filt = this._reviewFilter || 'all';
    const rows = (this.picks || []).map((p, i) => ({ p, i })).filter(({ p }) => {
      if (filt === 'correct') return p.ok;
      if (filt === 'wrong') return !p.ok && p.picked !== -2;
      if (filt === 'skip') return p.picked === -2;
      return true;
    });
    const name = (v) => v === 0 ? 'ĐÚNG ✓' : v === 1 ? 'SAI ✗' : v === -2 ? 'Bỏ qua ⏭' : 'Hết giờ ⏱';
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">${escHtml(this.project.name || 'Kết quả')}</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${acc >= 75 ? '🏆' : acc >= 50 ? '🎉' : '🌱'}</div>
          <h2 class="quiz-result-title">Đúng ${okCount}/${totalQ} câu (${acc}%)</h2>
          <div class="quiz-grade" style="color:${grade.c};">${grade.t}</div>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">🔥 Chuỗi hay nhất: <strong>x${this.bestStreak}</strong></span>
            <span class="quiz-stat">⏭️ Bỏ qua: <strong>${skipped}</strong></span>
          </div>
          <div class="quiz-filter-row">
            ${[['all', 'Tất cả'], ['correct', 'Đúng'], ['wrong', 'Sai'], ['skip', 'Bỏ qua']].map(([k, label]) => `
              <button class="btn btn-sm quiz-filter ${filt === k ? 'active' : 'btn-secondary'}" data-f="${k}">${label}</button>
            `).join('')}
          </div>
        </div>
        <div class="quiz-review-list">
          ${rows.length ? rows.map(({ p, i }) => `
            <div class="quiz-review-item ${p.ok ? 'ok' : p.picked === -2 ? 'skip' : 'wrong'}">
              <div class="quiz-review-q">${i + 1}. ${escHtml(p.question)} ${p.ok ? '✓' : p.picked === -2 ? '⏭' : '✗'}</div>
              <div class="quiz-review-a">Trả lời: ${escHtml(name(p.picked))} • Đáp án: ${escHtml(name(p.correct))}</div>
              ${p.explanation ? `<div class="quiz-review-exp">Giải thích: ${escHtml(p.explanation)}</div>` : ''}
            </div>
          `).join('') : '<div class="quiz-empty">Không có mục nào trong bộ lọc này.</div>'}
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Chơi lại từ đầu</button>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio • ${okCount}/${totalQ} đúng • chuỗi x${this.bestStreak}</span>
      </div>
    `;
    this.viewportEl.querySelectorAll('.quiz-filter').forEach(b => {
      b.onclick = () => { this._reviewFilter = b.getAttribute('data-f'); this.renderResultScreen(); };
    });
    const restartBtn = this.viewportEl.querySelector('#btn-restart-game');
    if (restartBtn) restartBtn.onclick = () => this.restart();
    if (acc >= 50) this.burstConfetti();
  }

  restart() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this._reviewFilter = 'all';
    this.start();
  }
}
