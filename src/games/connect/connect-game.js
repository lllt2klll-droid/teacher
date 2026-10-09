/* ==========================================================================
   TeacherStudio Connect Game - Visual SVG Line Connection
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { pairsFromContent } from '../pairs-helper.js';
import { escHtml } from '../question-media.js';

function shuffleArr(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export class ConnectGame extends BaseGame {
  colorFor(id) {
    const palette = ['#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED', '#0284C7'];
    return palette[Number(id) % palette.length];
  }

  paintWires() {
    try {
      const board = this.viewportEl.querySelector('#connect-board');
      const svg = this.viewportEl.querySelector('#connect-svg');
      if (!board || !svg) return;
      const br = board.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, br.width)} ${Math.max(1, br.height)}`);
      let html = '';
      this.connected.forEach((id) => {
        const l = board.querySelector(`.connect-left[data-id="${id}"]`);
        const r = board.querySelector(`.connect-right[data-id="${id}"]`);
        if (!l || !r) return;
        const lr = l.getBoundingClientRect();
        const rr = r.getBoundingClientRect();
        const x1 = lr.right - br.left;
        const y1 = lr.top + lr.height / 2 - br.top;
        const x2 = rr.left - br.left;
        const y2 = rr.top + rr.height / 2 - br.top;
        const mx = (x1 + x2) / 2;
        const c = this.colorFor(id);
        html += `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>`;
        html += `<circle cx="${x1}" cy="${y1}" r="4.5" fill="${c}"/><circle cx="${x2}" cy="${y2}" r="4.5" fill="${c}"/>`;
      });
      // Dây xem trước đang nối dở: từ nút trái đã chọn ra giữa
      if (this.selectedLeft !== null && !this.connected.has(this.selectedLeft)) {
        const l = board.querySelector(`.connect-left[data-id="${this.selectedLeft}"]`);
        if (l) {
          const lr = l.getBoundingClientRect();
          const x1 = lr.right - br.left;
          const y1 = lr.top + lr.height / 2 - br.top;
          const c = this.colorFor(this.selectedLeft);
          html += `<line x1="${x1}" y1="${y1}" x2="${x1 + 44}" y2="${y1}" stroke="${c}" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round" opacity="0.8"/>`;
        }
      }
      svg.innerHTML = html;
    } catch (e) {}
  }

  start() {
    // Doc cap noi tu content GV (pairs hoac cau hoi -> dap an dung), giong ban xuat.
    const derived = pairsFromContent(this.content, 4);
    this.pairs = derived.length > 0 ? derived : [
      { id: 0, left: 'Thủ đô Hà Nội', right: 'Việt Nam' },
      { id: 1, left: 'Thủ đô Tokyo', right: 'Nhật Bản' },
      { id: 2, left: 'Thủ đô Paris', right: 'Pháp' },
      { id: 3, left: 'Thủ đô Washington D.C', right: 'Hoa Kỳ' }
    ];

    this.leftList = shuffleArr(this.pairs);
    this.rightList = shuffleArr(this.pairs);

    this.selectedLeft = null;
    this.connected = new Set();
    this.attempts = 0;
    this.score = 0;
    this._checking = false;
    this.startAt = Date.now();
    this.state = 'playing';

    this.renderBoard();
  }

  elapsed() {
    return this.startAt ? Math.max(1, Math.round((Date.now() - this.startAt) / 1000)) : 0;
  }

  renderBoard() {
    const pct = Math.round(this.connected.size / Math.max(1, this.pairs.length) * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Nối ý tương ứng</span>
        <span class="quiz-score">Đã nối: <strong>${this.connected.size}/${this.pairs.length}</strong> • Điểm <strong>${this.score}</strong></span>
      </div>

      <div class="game-body pair-body">
        <div class="quiz-progress" title="Tiến trình ${pct}%">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="pair-hint">
          ${this.selectedLeft === null ? 'Nhấp chọn một mục ở cột trái, rồi nhấp vào mục tương ứng ở cột phải để nối' : 'Đã chọn trái • hãy chọn mục phải tương ứng →'}
        </div>

        <div class="gv-side-2" id="connect-board" style="display: flex; justify-content: space-between; gap: 56px; position: relative;">
          <svg id="connect-svg" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5;"></svg>
          <!-- Left items -->
          <div class="flex flex-col gap-3" style="flex: 1; position: relative; z-index: 2;">
            ${this.leftList.map(item => {
              const c = this.colorFor(item.id);
              const done = this.connected.has(item.id);
              return `
              <button class="connect-node connect-left ${done ? 'matched' : ''}"
                data-id="${item.id}"
                style="padding: 14px 18px; border: 2px solid ${done ? c : 'var(--theme-border)'}; border-radius: 10px; background: ${done ? c + '18' : 'var(--theme-surface)'}; text-align: left; cursor: pointer; transition: all 0.2s; position: relative;"
                ${done ? 'disabled' : ''}>
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin-right:8px;vertical-align:middle;"></span>${escHtml(item.left)}
              </button>`;
            }).join('')}
          </div>

          <!-- Right items -->
          <div class="flex flex-col gap-3" style="flex: 1; position: relative; z-index: 2;">
            ${this.rightList.map(item => {
              const c = this.colorFor(item.id);
              const done = this.connected.has(item.id);
              return `
              <button class="connect-node connect-right ${done ? 'matched' : ''}"
                data-id="${item.id}"
                style="padding: 14px 18px; border: 2px solid ${done ? c : 'var(--theme-border)'}; border-radius: 10px; background: ${done ? c + '18' : 'var(--theme-surface)'}; text-align: right; cursor: pointer; transition: all 0.2s; position: relative;"
                ${done ? 'disabled' : ''}>
                ${escHtml(item.right)}<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin-left:8px;vertical-align:middle;"></span>
              </button>`;
            }).join('')}
          </div>

        </div>
      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Điểm ${this.score}đ • Thử ${this.attempts} • ⏱️ ${this.elapsed()}s</span>
        <button class="btn btn-secondary btn-sm" id="btn-reset-connect">↺ Nối lại từ đầu</button>
      </div>
    `;

    this.bindEvents();
    requestAnimationFrame(() => this.paintWires());
    this.gameTimeout(() => this.paintWires(), 60);
    const resetBtn = this.viewportEl.querySelector('#btn-reset-connect');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (this._checking) return;
        Sound.playClick();
        this.clearGameTimeouts();
        this.connected = new Set();
        this.selectedLeft = null;
        this.attempts = 0;
        this.score = 0;
        this.renderBoard();
      };
    }
  }

  bindEvents() {
    const leftNodes = this.viewportEl.querySelectorAll('.connect-left');
    const rightNodes = this.viewportEl.querySelectorAll('.connect-right');

    leftNodes.forEach(node => {
      node.onclick = () => {
        Sound.playClick();
        const id = parseInt(node.getAttribute('data-id'), 10);
        // Bấm lại để bỏ chọn dây đang nối dở
        if (this.selectedLeft === id) {
          this.selectedLeft = null;
          node.style.borderColor = 'var(--theme-border)';
          this.paintWires();
          const hint = this.viewportEl.querySelector('.pair-hint');
          if (hint) hint.textContent = 'Nhấp chọn một mục ở cột trái, rồi nhấp vào mục tương ứng ở cột phải để nối';
          return;
        }
        leftNodes.forEach(n => {
          if (!n.classList.contains('matched')) n.style.borderColor = 'var(--theme-border)';
        });
        node.style.borderColor = this.colorFor(id);
        this.selectedLeft = id;
        this.paintWires();
      };
    });

    rightNodes.forEach(node => {
      node.onclick = () => {
        if (this.selectedLeft === null || this._checking) return;
        const rightId = parseInt(node.getAttribute('data-id'), 10);
        this.attempts++;

        if (this.selectedLeft === rightId) {
          Sound.playCorrect();
          this.connected.add(this.selectedLeft);
          this.score += 15;
          this.selectedLeft = null;

          if (this.connected.size >= this.pairs.length) {
            this.gameTimeout(() => this.finish(), 800);
          } else {
            this.renderBoard();
          }
        } else {
          Sound.playWrong();
          this._checking = true;
          node.style.borderColor = '#B45454';
          node.disabled = true;
          this.gameTimeout(() => {
            this._checking = false;
            this.selectedLeft = null;
            this.renderBoard();
          }, 600);
        }
      };
    });
  }

  renderResultScreen() {
    const total = this.pairs.length || 1;
    const accuracy = this.attempts ? Math.round(this.connected.size / this.attempts * 100) : 100;
    const secs = this.elapsed();
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Nối ý hoàn thành!</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${accuracy >= 80 ? '🏆' : '🎉'}</div>
          <h2 class="quiz-result-title">Nối đúng ${this.connected.size}/${total} cặp</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">🎯 Chính xác <strong>${accuracy}%</strong></span>
            <span class="quiz-stat">⏱️ <strong>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</strong></span>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-restart-game">🔄 Chơi lại từ đầu</button>
      </div>
      <div class="game-footer"><span class="quiz-hint">TeacherStudio • ${accuracy}% chính xác</span></div>
    `;
    const rb = this.viewportEl.querySelector('#btn-restart-game');
    if (rb) rb.onclick = () => this.restart();
  }

  restart() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.start();
  }
}
