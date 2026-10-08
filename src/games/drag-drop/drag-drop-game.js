/* ==========================================================================
   TeacherStudio Drag & Drop Game - Interactive Classification Sorting
   Supports both mouse and touch events.
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';

export class DragDropGame extends BaseGame {
  start() {
    this.categories = [
      { id: 'cat_a', title: 'Nhóm 1: Động vật', acceptedKeywords: ['Gà', 'Chó', 'Mèo', 'Bò', 'Chim', 'Cá'] },
      { id: 'cat_b', title: 'Nhóm 2: Thực vật', acceptedKeywords: ['Cây bàng', 'Hoa sen', 'Cây lúa', 'Cỏ', 'Hoa hồng'] }
    ];

    this.items = [
      { id: 1, text: 'Gà', targetCat: 'cat_a' },
      { id: 2, text: 'Hoa sen', targetCat: 'cat_b' },
      { id: 3, text: 'Mèo', targetCat: 'cat_a' },
      { id: 4, text: 'Cây lúa', targetCat: 'cat_b' },
      { id: 5, text: 'Chó', targetCat: 'cat_a' },
      { id: 6, text: 'Cây bàng', targetCat: 'cat_b' }
    ].sort(() => Math.random() - 0.5);

    this.placedCount = 0;
    this.score = 0;
    this.state = 'playing';

    this.renderBoard();
  }

  renderBoard() {
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="badge badge-primary">Kéo thả phân loại</span>
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Đã xếp: <strong>${this.placedCount} / ${this.items.length}</strong></span>
      </div>

      <div class="game-body" style="width: 100%; max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Source items container -->
        <div id="drag-source-pool" style="min-height: 70px; background: var(--theme-surface); border: 2px dashed var(--theme-border); border-radius: 12px; padding: 12px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center;">
          ${this.items.map(item => `
            <div class="draggable-chip" draggable="true" data-id="${item.id}" data-target="${item.targetCat}" style="padding: 10px 18px; background: var(--theme-primary); color: #FFF; font-weight: 600; border-radius: 8px; cursor: grab; user-select: none; box-shadow: var(--shadow-sm); transition: transform 0.15s;">
              ${item.text}
            </div>
          `).join('')}
        </div>

        <!-- Drop targets / buckets -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${this.categories.map(cat => `
            <div class="drop-target-box" data-cat="${cat.id}" style="min-height: 180px; background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; transition: border-color 0.2s;">
              <div class="font-semibold" style="margin-bottom: 12px; font-size: 16px; border-bottom: 1px solid var(--theme-border); padding-bottom: 8px;">
                ${cat.title}
              </div>
              <div class="bucket-contents flex gap-2 flex-wrap" style="flex: 1;"></div>
            </div>
          `).join('')}
        </div>

      </div>

      <div class="game-footer">
        <span style="font-size: 13px; color: var(--theme-text-subtle);">Kéo hoặc nhấp vào thẻ rồi nhấp vào ô đích tương ứng</span>
      </div>
    `;

    this.bindDragEvents();
  }

  bindDragEvents() {
    let draggedItem = null;
    const chips = this.viewportEl.querySelectorAll('.draggable-chip');
    const buckets = this.viewportEl.querySelectorAll('.drop-target-box');

    chips.forEach(chip => {
      chip.ondragstart = (e) => {
        draggedItem = chip;
        e.dataTransfer.setData('text/plain', chip.getAttribute('data-id'));
        Sound.playClick();
      };

      // Also support click-to-place for touch/accessibility
      chip.onclick = () => {
        Sound.playClick();
        chips.forEach(c => c.style.outline = 'none');
        chip.style.outline = '3px solid var(--theme-accent)';
        draggedItem = chip;
      };
    });

    buckets.forEach(bucket => {
      bucket.ondragover = (e) => {
        e.preventDefault();
        bucket.style.borderColor = 'var(--theme-primary)';
      };

      bucket.ondragleave = () => {
        bucket.style.borderColor = 'var(--theme-border)';
      };

      bucket.ondrop = (e) => {
        e.preventDefault();
        bucket.style.borderColor = 'var(--theme-border)';
        if (!draggedItem) return;
        this.verifyAndDrop(draggedItem, bucket);
      };

      bucket.onclick = () => {
        if (draggedItem) {
          this.verifyAndDrop(draggedItem, bucket);
        }
      };
    });
  }

  verifyAndDrop(chipEl, bucketEl) {
    const targetCat = chipEl.getAttribute('data-target');
    const bucketCat = bucketEl.getAttribute('data-cat');

    if (targetCat === bucketCat) {
      Sound.playCorrect();
      this.score += 10;
      this.placedCount++;
      
      const contents = bucketEl.querySelector('.bucket-contents');
      chipEl.removeAttribute('draggable');
      chipEl.style.cursor = 'default';
      chipEl.style.outline = 'none';
      chipEl.style.background = '#4D7A5A';
      contents.appendChild(chipEl);

      if (this.placedCount >= this.items.length) {
        setTimeout(() => this.finish(), 800);
      }
    } else {
      Sound.playWrong();
      chipEl.style.outline = '3px solid #B45454';
      setTimeout(() => chipEl.style.outline = 'none', 600);
    }
  }
}
