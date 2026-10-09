/* ==========================================================================
   TeacherStudio Quiz Game - Interactive Multiple Choice Quiz
   v3: khung thẻ, timer vòng tròn, streak, thưởng tốc độ, 50:50, hiệu ứng
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { bindSpeakButtons } from '../../core/speech.js';
import { questionImageHtml, questionTextRow, teacherBadgeHtml, escHtml } from '../question-media.js';

function shuffleArr(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export class QuizGame extends BaseGame {
  start() {
    this.questions = (this.content?.questions || []).map(q => ({
      ...q,
      answers: Array.isArray(q.answers) ? q.answers : [],
      correctAnswer: (Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < (q.answers || []).length) ? q.correctAnswer : 0
    }));
    if (this.options.shuffleQuestions) {
      this.questions = shuffleArr(this.questions);
    }
    // Trộn đáp án mỗi lần chơi (giữ đúng đáp án)
    this.shuffleAnswers = this.options.shuffleAnswers === true;
    this.speedBonus = this.options.speedBonus !== false;
    this.streakBonus = this.options.streakBonus !== false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.picks = [];
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.fiftyUsed = false;
    this.hiddenIdx = [];
    this.qStartAt = 0;
    this.state = 'playing';
    this.renderCurrentQuestion();
  }

  get totalTime() {
    return 30;
  }

  renderCurrentQuestion() {
    this.stopTimer();
    this.unbindKey();
    this.clearGameTimeouts();
    const q = this.questions[this.currentQuestionIndex];
    if (!q) {
      this.finish();
      return;
    }
    this._locked = false;
    this.hiddenIdx = [];

    const totalQ = this.questions.length;
    const qNum = this.currentQuestionIndex + 1;
    this.timeLeft = q.timeLimit || this.options.timerSeconds || 30;
    this.timeTotal = this.timeLeft;
    this.qStartAt = Date.now();

    // Thứ tự đáp án hiển thị (có thể trộn)
    this.order = (q.answers || []).map((_, i) => i);
    if (this.shuffleAnswers && this.order.length > 1) {
      this.order = shuffleArr(this.order);
    }

    const pct = Math.round((qNum - 1) / totalQ * 100);
    const streakHtml = this.streak >= 2 ? `<span class="quiz-streak" title="Chuỗi đúng liên tiếp">🔥 x${this.streak}</span>` : '';

    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary">Câu ${qNum} / ${totalQ}</span>
          ${streakHtml}
          <span class="quiz-score">Điểm: <strong>${this.score}</strong> <span class="quiz-sub">• Đúng ${this.correctCount}/${totalQ}</span></span>
        </div>
        ${this.options.timerEnabled !== false ? `
          <div class="quiz-timer" id="quiz-timer" title="Thời gian còn lại">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="5"/>
              <circle id="quiz-timer-ring" cx="20" cy="20" r="16" fill="none" stroke="var(--theme-primary)" stroke-width="5"
                stroke-linecap="round" stroke-dasharray="100.5" stroke-dashoffset="0" transform="rotate(-90 20 20)"/>
            </svg>
            <span id="timer-val">${this.timeLeft}</span>
          </div>
        ` : ''}
      </div>

      <div class="game-body quiz-body">
        <div class="quiz-progress" title="Tiến trình ${qNum}/${totalQ}">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="quiz-card quiz-enter">
          ${questionImageHtml(q)}
          ${teacherBadgeHtml(q, this.options.teacherMode)}
          ${questionTextRow(q, 20, this.options.readAloud !== false)}
          <div class="game-options-list quiz-options">
            ${this.order.map((realIdx, pos) => `
              <button class="game-option-btn quiz-opt" data-real="${realIdx}" data-pos="${pos}">
                <span class="game-option-letter">${String.fromCharCode(65 + pos)}</span>
                <span>${escHtml((q.answers || [])[realIdx] ?? '')}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-explanation-box" class="quiz-explain" style="display: none;">
            <strong>Giải thích:</strong> <span id="quiz-explanation-text"></span>
          </div>
          <div id="quiz-bonus-note" class="quiz-bonus-note"></div>
        </div>
      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Phím 1-${Math.min(this.order.length, 6)} / A-${String.fromCharCode(64 + Math.min(this.order.length, 6))} để chọn</span>
        <div class="flex items-center gap-2">
          <button class="btn btn-secondary btn-sm" id="btn-fifty" ${this.fiftyUsed ? 'disabled title="Đã dùng 50:50"' : 'title="Loại 2 đáp án sai (1 lần chơi)"'}>🎯 50:50</button>
          <button class="btn btn-secondary btn-sm" id="btn-autoread-q" title="Tự đọc to câu mới cho cả lớp nghe">${this.options.autoRead ? '🔊 Tự đọc: Bật' : '🔇 Tự đọc: Tắt'}</button>
          <button class="btn btn-secondary btn-sm" id="btn-skip-q">Bỏ qua →</button>
        </div>
      </div>
    `;

    // Bind click handlers
    const optionBtns = this.viewportEl.querySelectorAll('.quiz-opt');
    bindSpeakButtons(this.viewportEl);
    this.bindKeyboard(q, optionBtns.length);
    optionBtns.forEach(btn => {
      btn.onclick = () => {
        const real = parseInt(btn.getAttribute('data-real'), 10);
        this.handleAnswer(real, q, btn);
      };
    });

    const fiftyBtn = this.viewportEl.querySelector('#btn-fifty');
    if (fiftyBtn && !this.fiftyUsed) {
      fiftyBtn.onclick = () => this.useFifty(q);
    }

    const skipBtn = this.viewportEl.querySelector('#btn-skip-q');
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (this._locked) return;
        this.streak = 0;
        this.picks.push({ question: q.question, picked: -2, correct: q.correctAnswer, answers: q.answers || [], ok: false, explanation: '' });
        this.stopTimer();
        this.currentQuestionIndex++;
        this.renderCurrentQuestion();
      };
    }

    const autoBtn = this.viewportEl.querySelector('#btn-autoread-q');
    if (autoBtn) {
      autoBtn.onclick = () => {
        this.options.autoRead = !this.options.autoRead;
        autoBtn.textContent = this.options.autoRead ? '🔊 Tự đọc: Bật' : '🔇 Tự đọc: Tắt';
        if (this.options.autoRead) Speech.speak(q.question);
      };
    }
    // Tự đọc câu mới khi cô đã bật (chiếu lớp không cần bấm từng câu)
    if (this.options.autoRead && this.options.readAloud !== false) {
      this.gameTimeout(() => Speech.speak(q.question), 350);
    }

    // Start question timer
    if (this.options.timerEnabled !== false) {
      this.updateTimerRing();
      this.timer = setInterval(() => {
        this.timeLeft--;
        const valEl = this.viewportEl.querySelector('#timer-val');
        if (valEl) valEl.textContent = Math.max(0, this.timeLeft);
        this.updateTimerRing();

        if (this.timeLeft <= 5 && this.timeLeft > 0) {
          Sound.playTick();
          const t = this.viewportEl.querySelector('#quiz-timer');
          if (t) { t.classList.remove('quiz-urgent'); void t.offsetWidth; t.classList.add('quiz-urgent'); }
        }

        if (this.timeLeft <= 0) {
          this.stopTimer();
          Sound.playWrong();
          this.handleAnswer(-1, q, null); // Timeout
        }
      }, 1000);
    }
  }

  updateTimerRing() {
    const ring = this.viewportEl.querySelector('#quiz-timer-ring');
    const wrap = this.viewportEl.querySelector('#quiz-timer');
    if (!ring) return;
    const total = Math.max(1, this.timeTotal || 30);
    const frac = Math.max(0, this.timeLeft) / total;
    ring.style.strokeDashoffset = String(100.5 * (1 - frac));
    ring.style.stroke = this.timeLeft <= 5 ? '#B45454' : 'var(--theme-primary)';
    if (wrap) wrap.classList.toggle('is-low', this.timeLeft <= 5);
  }

  useFifty(q) {
    if (this._locked || this.fiftyUsed) return;
    const wrongs = (q.answers || []).map((_, i) => i).filter(i => i !== q.correctAnswer);
    if (wrongs.length < 2) return;
    this.fiftyUsed = true;
    Sound.playClick();
    const hide = shuffleArr(wrongs).slice(0, 2);
    this.hiddenIdx = hide;
    hide.forEach(real => {
      const btn = this.viewportEl.querySelector(`.quiz-opt[data-real="${real}"]`);
      if (btn) { btn.disabled = true; btn.classList.add('is-hidden-5050'); }
    });
    const fb = this.viewportEl.querySelector('#btn-fifty');
    if (fb) { fb.disabled = true; fb.title = 'Đã dùng 50:50'; }
  }

  bindKeyboard(q, optionCount) {
    this.bindKey((e) => {
      if (this.state !== 'playing' || this._locked) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 };
      const idx = map[String(e.key).toLowerCase()];
      if (idx !== undefined && idx < optionCount) {
        const btn = this.viewportEl.querySelector(`.quiz-opt[data-pos="${idx}"]`);
        const real = btn ? parseInt(btn.getAttribute('data-real'), 10) : this.order[idx];
        this.handleAnswer(real, q, btn);
      }
    });
  }

  handleAnswer(selectedIndex, q, btnEl) {
    if (this._locked) return;
    this._locked = true;
    this.stopTimer();
    this.unbindKey();
    const isCorrect = selectedIndex === q.correctAnswer;
    this.picks.push({ question: q.question, picked: selectedIndex, correct: q.correctAnswer, answers: q.answers || [], ok: isCorrect, explanation: q.explanation || '' });
    const optionBtns = this.viewportEl.querySelectorAll('.quiz-opt');

    optionBtns.forEach((btn) => {
      btn.disabled = true;
      const real = parseInt(btn.getAttribute('data-real'), 10);
      if (real === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (real === selectedIndex) {
        btn.classList.add('incorrect', 'quiz-shake');
      } else {
        btn.classList.add('is-dim');
      }
    });

    let gained = 0;
    let note = '';
    if (isCorrect) {
      Sound.playCorrect();
      this.correctCount++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      gained = q.points || 10;
      // Thưởng tốc độ: còn >50% thời gian thì +30%
      if (this.speedBonus && this.options.timerEnabled !== false && this.timeTotal > 0) {
        const elapsed = (Date.now() - this.qStartAt) / 1000;
        if (elapsed < this.timeTotal * 0.5) {
          const extra = Math.max(1, Math.round(gained * 0.3));
          gained += extra;
          note += `⚡ Nhanh +${extra} • `;
        }
      }
      // Thưởng chuỗi: mỗi 3 câu liên tiếp +5
      if (this.streakBonus && this.streak > 0 && this.streak % 3 === 0) {
        gained += 5;
        note += `🔥 Chuỗi ${this.streak} +5 • `;
      }
      this.score += gained;
      note += `+${gained}đ`;
      this.floatBonus(btnEl, `+${gained}`);
      if (this.streak >= 2) this.burstConfetti();
    } else {
      Sound.playWrong();
      this.streak = 0;
      note = selectedIndex === -1 ? 'Hết giờ!' : (selectedIndex === -2 ? 'Đã bỏ qua' : 'Chưa đúng, cố lên!');
    }

    const noteEl = this.viewportEl.querySelector('#quiz-bonus-note');
    if (noteEl && note) {
      noteEl.textContent = note;
      noteEl.classList.add('show', isCorrect ? 'good' : 'bad');
    }
    const headScore = this.viewportEl.querySelector('.quiz-score strong');
    if (headScore) headScore.textContent = this.score;

    // Show explanation if enabled (kèm nút đọc giải thích cho cả lớp nghe)
    if (this.options.showExplanation && q.explanation) {
      const expBox = this.viewportEl.querySelector('#quiz-explanation-box');
      const expText = this.viewportEl.querySelector('#quiz-explanation-text');
      if (expBox && expText) {
        expText.textContent = q.explanation;
        expBox.style.display = 'block';
        if (this.options.readAloud !== false && !expBox.querySelector('.btn-speak-exp')) {
          const b = document.createElement('button');
          b.className = 'btn btn-secondary btn-sm btn-speak-exp';
          b.textContent = '🔊 Đọc giải thích';
          b.style.marginLeft = '8px';
          b.onclick = (e) => { e.stopPropagation(); Speech.speak(q.explanation); };
          expBox.appendChild(b);
        }
      }
    }

    // Move to next question after short delay
    this.gameTimeout(() => {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }, this.options.showExplanation && q.explanation ? 2400 : 1200);
  }

  floatBonus(btnEl, text) {
    try {
      const host = btnEl && btnEl.closest ? (btnEl.closest('.quiz-card') || this.viewportEl) : this.viewportEl;
      const s = document.createElement('div');
      s.className = 'quiz-float-points';
      s.textContent = text;
      if (btnEl && host) {
        const hr = host.getBoundingClientRect ? host.getBoundingClientRect() : { left: 0, top: 0 };
        const br = btnEl.getBoundingClientRect ? btnEl.getBoundingClientRect() : { left: 100, top: 100 };
        s.style.left = Math.max(12, br.left - hr.left + 40) + 'px';
        s.style.top = Math.max(0, br.top - hr.top - 10) + 'px';
      }
      (host || this.viewportEl).appendChild(s);
      setTimeout(() => { try { s.remove(); } catch (e) {} }, 1100);
    } catch (e) {}
  }

  burstConfetti() {
    try {
      const host = this.viewportEl.querySelector('.quiz-card') || this.viewportEl;
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('span');
        p.className = 'quiz-confetti';
        p.textContent = ['🎉', '⭐', '✨', '🎊'][i % 4];
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
    const totalQ = this.questions.length || 1;
    const okCount = this.picks.filter(p => p.ok).length;
    const skipped = this.picks.filter(p => p.picked === -2).length;
    const acc = Math.round(okCount / totalQ * 100);
    const grade = this.gradeOf(acc);
    this.unbindKey();
    const filt = this._reviewFilter || 'all';
    const rows = (this.picks || []).map((p, i) => ({ p, i })).filter(({ p }) => {
      if (filt === 'correct') return p.ok;
      if (filt === 'wrong') return !p.ok && p.picked !== -2;
      if (filt === 'skip') return p.picked === -2;
      return true;
    });
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
          <div class="quiz-filter-row" role="tablist">
            ${[['all', 'Tất cả'], ['correct', 'Đúng'], ['wrong', 'Sai'], ['skip', 'Bỏ qua']].map(([k, label]) => `
              <button class="btn btn-sm quiz-filter ${filt === k ? 'active' : 'btn-secondary'}" data-f="${k}">${label}</button>
            `).join('')}
          </div>
        </div>
        <div class="quiz-review-list">
          ${rows.length ? rows.map(({ p, i }) => `
            <div class="quiz-review-item ${p.ok ? 'ok' : p.picked === -2 ? 'skip' : 'wrong'}">
              <div class="quiz-review-q">${i + 1}. ${escHtml(p.question)} ${p.ok ? '✓' : p.picked === -2 ? '⏭' : '✗'}</div>
              <div class="quiz-review-a">
                Trả lời: ${p.picked === -2 ? 'Bỏ qua' : (p.picked >= 0 ? escHtml(p.answers[p.picked] ?? '?') : 'Hết giờ')} • Đáp án: ${escHtml(p.answers[p.correct] ?? '?')}
              </div>
              ${p.explanation ? `<div class="quiz-review-exp">Giải thích: ${escHtml(p.explanation)}</div>` : ''}
            </div>
          `).join('') : '<div class="quiz-empty">Không có mục nào trong bộ lọc này.</div>'}
        </div>
        <div class="flex items-center gap-2" style="margin-top:12px;">
          <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Chơi lại từ đầu</button>
          <button class="btn btn-secondary" id="btn-review-all">📋 Xem lại đề</button>
        </div>
      </div>
      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">TeacherStudio • ${okCount}/${totalQ} đúng • ${this.score} điểm</span>
      </div>
    `;

    this.viewportEl.querySelectorAll('.quiz-filter').forEach(b => {
      b.onclick = () => { this._reviewFilter = b.getAttribute('data-f'); this.renderResultScreen(); };
    });
    const restartBtn = this.viewportEl.querySelector('#btn-restart-game');
    if (restartBtn) {
      restartBtn.onclick = () => this.restart();
    }
    const allBtn = this.viewportEl.querySelector('#btn-review-all');
    if (allBtn) {
      allBtn.onclick = () => { this._reviewFilter = 'all'; this.renderResultScreen(); };
    }
    if (acc >= 50) this.burstConfetti();
  }

  restart() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.fiftyUsed = false;
    this._reviewFilter = 'all';
    this.start();
  }
}
