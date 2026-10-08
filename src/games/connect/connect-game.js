/* ==========================================================================
   TeacherStudio Connect Game - Visual SVG Line Connection
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class ConnectGame extends BaseGame {
  start() {
    this.pairs = [
      { id: 1, left: 'Thủ đô Hà Nội', right: 'Việt Nam' },
      { id: 2, left: 'Thủ đô Tokyo', right: 'Nhật Bản' },
      { id: 3, left: 'Thủ đô Paris', right: 'Pháp' },
      { id: 4, left: 'Thủ đô Washington D.C', right: 'Hoa Kỳ' }
    ];

    this.leftList = [...this.pairs].sort(() => Math.random() - 0.5);
    this.rightList = [...this.pairs].sort(() => Math.random() - 0.5);

    this.selectedLeft = null;
    this.connected = new Set();
    this.score = 0;
    this.state = 'playing';

    this.renderBoard();
  }

  renderBoard() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Nối ý tương ứng</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã nối: <strong>${this.connected.size} / ${this.pairs.length}</strong></span>
      </div>

      <div class="game-body" style="width: 100%; max-width: 680px; margin: 0 auto;">
        <div style="font-size: 16px; text-align: center; margin-bottom: 20px; color: var(--theme-text-subtle);">
          Nhấp chọn một mục ở cột trái, rồi nhấp vào mục tương ứng ở cột phải để nối
        </div>

        <div style="display: flex; justify-content: space-between; gap: 40px; position: relative;">
          
          <!-- Left items -->
          <div class="flex flex-col gap-3" style="flex: 1;">
            ${this.leftList.map(item => `
              <button class="connect-node connect-left ${this.connected.has(item.id) ? 'matched' : ''}" 
                data-id="${item.id}"
                style="padding: 14px 18px; border: 2px solid var(--theme-border); border-radius: 10px; background: var(--theme-surface); text-align: left; cursor: pointer; transition: all 0.2s;"
                ${this.connected.has(item.id) ? 'disabled' : ''}>
                ● ${item.left}
              </button>
            `).join('')}
          </div>

          <!-- Right items -->
          <div class="flex flex-col gap-3" style="flex: 1;">
            ${this.rightList.map(item => `
              <button class="connect-node connect-right ${this.connected.has(item.id) ? 'matched' : ''}" 
                data-id="${item.id}"
                style="padding: 14px 18px; border: 2px solid var(--theme-border); border-radius: 10px; background: var(--theme-surface); text-align: right; cursor: pointer; transition: all 0.2s;"
                ${this.connected.has(item.id) ? 'disabled' : ''}>
                ${item.right} ●
              </button>
            `).join('')}
          </div>

        </div>
      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Điểm số: ${this.score}đ</span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const leftNodes = this.viewportEl.querySelectorAll('.connect-left');
    const rightNodes = this.viewportEl.querySelectorAll('.connect-right');

    leftNodes.forEach(node => {
      node.onclick = () => {
        Sound.playClick();
        leftNodes.forEach(n => n.style.borderColor = 'var(--theme-border)');
        node.style.borderColor = 'var(--theme-primary)';
        this.selectedLeft = parseInt(node.getAttribute('data-id'), 10);
      };
    });

    rightNodes.forEach(node => {
      node.onclick = () => {
        if (this.selectedLeft === null) return;
        const rightId = parseInt(node.getAttribute('data-id'), 10);

        if (this.selectedLeft === rightId) {
          Sound.playCorrect();
          this.connected.add(this.selectedLeft);
          this.score += 15;
          this.selectedLeft = null;

          if (this.connected.size >= this.pairs.length) {
            setTimeout(() => this.finish(), 800);
          } else {
            this.renderBoard();
          }
        } else {
          Sound.playWrong();
          node.style.borderColor = '#B45454';
          setTimeout(() => {
            node.style.borderColor = 'var(--theme-border)';
          }, 600);
        }
      };
    });
  }
}
