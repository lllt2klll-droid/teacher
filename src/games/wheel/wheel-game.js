/* ==========================================================================
   TeacherStudio Wheel of Fortune - Physics-Based Interactive Canvas Wheel
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class WheelGame extends BaseGame {
  start() {
    const rawOptions = (this.content?.questions || []).map(q => q.question);
    this.optionsList = rawOptions.length > 0 ? [...rawOptions] : [
      'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cúc',
      'Phạm Minh Đức', 'Vũ Ngọc Hân', 'Hoàng Quốc Khánh',
      'Đặng Gia Huy', 'Bùi Mai Linh'
    ];

    this.currentAngle = 0;
    this.isSpinning = false;
    this.selectedItem = null;
    this.state = 'playing';

    this.renderWheelScreen();
  }

  renderWheelScreen() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Vòng quay may mắn</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Còn lại: <strong>${this.optionsList.length}</strong> mục</span>
      </div>

      <div class="game-body" style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; width: 100%;">
        
        <div style="position: relative; width: 340px; height: 340px;">
          <!-- Pointer -->
          <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 24px solid #B45454; z-index: 10;"></div>
          
          <!-- Canvas Wheel -->
          <canvas id="wheel-canvas" width="340" height="340" style="border-radius: 50%; box-shadow: var(--shadow-lg); border: 4px solid var(--theme-surface);"></canvas>
          
          <!-- Center Pin -->
          <button id="btn-spin-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 68px; border-radius: 50%; background: var(--theme-primary); color: #FFF; font-weight: 700; font-size: 14px; border: 4px solid #FFF; box-shadow: var(--shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center;">
            QUAY
          </button>
        </div>

        <!-- Result announcement -->
        <div id="wheel-result-banner" style="margin-top: 20px; font-size: 20px; font-weight: 700; color: var(--theme-primary); min-height: 32px; text-align: center;"></div>

        <div style="display: flex; gap: 12px; margin-top: 12px;">
          <button class="btn btn-primary btn-lg" id="btn-spin-action" ${this.isSpinning ? 'disabled' : ''}>
            🎯 Quay ngay!
          </button>
          <button class="btn btn-secondary" id="btn-remove-picked" style="display: none;">
            ✕ Bỏ mục này
          </button>
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Nhấp QUAY hoặc nhấn phím Space</span>
        <button class="btn btn-secondary btn-sm" id="btn-reset-wheel">Khôi phục danh sách</button>
      </div>
    `;

    this.canvas = this.viewportEl.querySelector('#wheel-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawWheel();

    const spinCenter = this.viewportEl.querySelector('#btn-spin-center');
    const spinAction = this.viewportEl.querySelector('#btn-spin-action');
    const removeBtn = this.viewportEl.querySelector('#btn-remove-picked');
    const resetBtn = this.viewportEl.querySelector('#btn-reset-wheel');

    const doSpin = () => {
      if (this.isSpinning || this.optionsList.length === 0) return;
      this.spinWheel();
    };

    spinCenter.onclick = doSpin;
    spinAction.onclick = doSpin;

    removeBtn.onclick = () => {
      if (this.selectedItem && this.optionsList.includes(this.selectedItem)) {
        this.optionsList = this.optionsList.filter(o => o !== this.selectedItem);
        this.selectedItem = null;
        removeBtn.style.display = 'none';
        const banner = this.viewportEl.querySelector('#wheel-result-banner');
        if (banner) banner.textContent = '';
        this.drawWheel();
      }
    };

    resetBtn.onclick = () => {
      this.start();
    };
  }

  drawWheel() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const num = this.optionsList.length;
    const radius = 170;
    ctx.clearRect(0, 0, 340, 340);

    if (num === 0) {
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(170, 170, radius, 0, 2 * Math.PI);
      ctx.fill();
      return;
    }

    const arc = (2 * Math.PI) / num;
    const colors = [
      '#3F5F55', '#D1A153', '#2F7C48', '#0284C7',
      '#818CF8', '#15803D', '#3B82F6', '#DC2626',
      '#D97706', '#9E4B37', '#5C4B82', '#A67832'
    ];

    for (let i = 0; i < num; i++) {
      const angle = this.currentAngle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(170, 170);
      ctx.arc(170, 170, radius, angle, angle + arc);
      ctx.lineTo(170, 170);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.save();
      ctx.translate(170, 170);
      ctx.rotate(angle + arc / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(this.optionsList[i].substring(0, 16), radius - 20, 5);
      ctx.restore();
    }
  }

  spinWheel() {
    this.isSpinning = true;
    Sound.playClick();
    const banner = this.viewportEl.querySelector('#wheel-result-banner');
    const removeBtn = this.viewportEl.querySelector('#btn-remove-picked');
    if (banner) banner.textContent = 'Đang quay... 🌀';
    if (removeBtn) removeBtn.style.display = 'none';

    // Physics parameters: random target rotation (4 to 8 full spins + random offset)
    const extraRotations = 4 + Math.random() * 4;
    const targetAngle = this.currentAngle + extraRotations * 2 * Math.PI + Math.random() * Math.PI * 2;
    const duration = 4000;
    const startTime = performance.now();
    const startAngle = this.currentAngle;
    let lastTickAngle = this.currentAngle;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.currentAngle = startAngle + (targetAngle - startAngle) * ease;

      // Tick sound every slice threshold
      const sliceSize = (2 * Math.PI) / this.optionsList.length;
      if (Math.abs(this.currentAngle - lastTickAngle) >= sliceSize) {
        Sound.playWheelTick();
        lastTickAngle = this.currentAngle;
      }

      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        Sound.playCheer();
        this.onSpinComplete();
      }
    };

    requestAnimationFrame(animate);
  }

  onSpinComplete() {
    const num = this.optionsList.length;
    const arc = (2 * Math.PI) / num;
    // Pointer is at top: 3*PI/2 (270 degrees)
    const normalizedAngle = (1.5 * Math.PI - (this.currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(normalizedAngle / arc) % num;
    this.selectedItem = this.optionsList[index];

    const banner = this.viewportEl.querySelector('#wheel-result-banner');
    const removeBtn = this.viewportEl.querySelector('#btn-remove-picked');
    if (banner) {
      banner.innerHTML = `🎉 Kết quả: <strong>${this.selectedItem}</strong>`;
    }
    if (removeBtn) {
      removeBtn.style.display = 'inline-flex';
    }
  }
}
