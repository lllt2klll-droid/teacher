/* ==========================================================================
   TeacherStudio Drag & Drop Game - Interactive Classification Sorting
   Supports both mouse and touch events.
   ========================================================================== */

import { BaseGame } from '../base-game.js';
import { Sound } from '../audio-synth.js';
import { dragGroupsFromContent } from '../pairs-helper.js';
import { escHtml } from '../question-media.js';

function shuffleArr(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export class DragDropGame extends BaseGame {
  start() {
    // Doc content that cua GV: phuong an = ten nhom, dap an dung = nhom chua muc.
    // VD: muc "Ga" | nhom "Dong vat" | nhom "Thuc vat" | dap an A.
    const derived = dragGroupsFromContent(this.content, 8);
    if (derived) {
      this.categories = derived.cats;
      this.items = shuffleArr(derived.items);
    } else {
      // Demo khi chua co du lieu nhom (giup GV hieu cach choi ngay)
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
      ];
    }
    this.items = shuffleArr(this.items);

    this.placedCount = 0;
    this.placedIds = new Set();
    this.moves = 0;
    this.wrongs = 0;
    this.score = 0;
    this.startAt = Date.now();
    this.state = 'playing';

    this.renderBoard();
  }

  elapsed() {
    return this.startAt ? Math.max(1, Math.round((Date.now() - this.startAt) / 1000)) : 0;
  }

  renderBoard() {
    const pct = Math.round(this.placedCount / Math.max(1, this.items.length) * 100);
    this.viewportEl.innerHTML = `
      <div class="game-header quiz-head">
        <span class="badge badge-primary">Kéo thả phân loại</span>
        <span class="quiz-score">Đã xếp: <strong>${this.placedCount}/${this.items.length}</strong> • Điểm <strong>${this.score}</strong></span>
      </div>

      <div class="game-body pair-body">
        <div class="quiz-progress" title="Tiến trình ${pct}%">
          <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="pair-hint">Kéo hoặc nhấp vào thẻ rồi nhấp vào ô đích tương ứng • Lượt xếp đúng ${this.placedCount}/${this.items.length}</div>

      <div class="game-body" style="width: 100%; max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Source items container -->
        <div id="drag-source-pool" style="min-height: 70px; background: var(--theme-surface); border: 2px dashed var(--theme-border); border-radius: 12px; padding: 12px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center;">
          ${this.items.map(item => `
            <div class="draggable-chip" draggable="true" data-id="${item.id}" data-target="${item.targetCat}" style="padding: 10px 18px; background: var(--theme-primary); color: #FFF; font-weight: 600; border-radius: 8px; cursor: grab; user-select: none; box-shadow: var(--shadow-sm); transition: transform 0.15s;">
              ${escHtml(item.text)}
            </div>
          `).join('')}
        </div>

        <!-- Drop targets / buckets -->
        <div class="gv-grid-2">
          ${this.categories.map(cat => `
            <div class="drop-target-box" data-cat="${cat.id}" style="min-height: 180px; background: var(--theme-surface); border: 2px solid var(--theme-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; transition: border-color 0.2s;">
              <div class="font-semibold" style="margin-bottom: 12px; font-size: 16px; border-bottom: 1px solid var(--theme-border); padding-bottom: 8px;">
                ${escHtml(cat.title)}
              </div>
              <div class="bucket-contents flex gap-2 flex-wrap" style="flex: 1;"></div>
            </div>
          `).join('')}
        </div>

      </div>

      <div class="game-footer quiz-foot">
        <span class="quiz-hint">Đúng ${this.placedCount}/${this.items.length} • Sai ${this.wrongs} • Thử ${this.moves} • ⏱️ ${this.elapsed()}s</span>
        <button class="btn btn-secondary btn-sm" id="btn-reset-drag">↺ Xếp lại từ đầu</button>
      </div>
    `;

    this.bindDragEvents();
    const resetBtn = this.viewportEl.querySelector('#btn-reset-drag');
    if (resetBtn) {
      resetBtn.onclick = () => {
        Sound.playClick();
        this.clearGameTimeouts();
        this.placedCount = 0;
        this.placedIds = new Set();
        this.moves = 0;
        this.wrongs = 0;
        this.score = 0;
        this.startAt = Date.now();
        this.items = shuffleArr(this.items);
        this.renderBoard();
      };
    }
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
    const chipId = chipEl.getAttribute('data-id');
    // Chống cộng điểm trùng: chip đã đặt thì bỏ qua
    if (chipEl.dataset.placed === '1' || (chipId != null && this.placedIds.has(chipId))) return;
    this.moves++;

    if (targetCat === bucketCat) {
      Sound.playCorrect();
      chipEl.dataset.placed = '1';
      if (chipId != null) this.placedIds.add(chipId);
      this.score += 10;
      this.placedCount++;

      const catTitle = this.categories.find(c => c.id === bucketCat)?.title || '';
      chipEl.title = 'Đúng • ' + catTitle;
      const contents = bucketEl.querySelector('.bucket-contents');
      chipEl.removeAttribute('draggable');
      chipEl.onclick = null;
      chipEl.ondragstart = null;
      chipEl.style.cursor = 'default';
      chipEl.style.outline = 'none';
      chipEl.style.background = '#4D7A5A';
      contents.appendChild(chipEl);
      bucketEl.style.borderColor = '#4D7A5A';
      this.gameTimeout(() => { try { bucketEl.style.borderColor = 'var(--theme-border)'; } catch (e) {} }, 500);

      if (this.placedCount >= this.items.length) {
        this.gameTimeout(() => this.finish(), 800);
      } else {
        const head = this.viewportEl.querySelector('.quiz-score strong');
        if (head) head.textContent = `${this.placedCount}/${this.items.length}`;
      }
    } else {
      Sound.playWrong();
      this.wrongs++;
      chipEl.style.outline = '3px solid #B45454';
      bucketEl.style.borderColor = '#B45454';
      this.gameTimeout(() => { try { chipEl.style.outline = 'none'; bucketEl.style.borderColor = 'var(--theme-border)'; } catch (e) {} }, 600);
    }
  }

  renderResultScreen() {
    const total = this.items.length || 1;
    const secs = this.elapsed();
    const accuracy = this.moves ? Math.round(this.placedCount / this.moves * 100) : 100;
    this.viewportEl.innerHTML = `
      <div class="game-header">
        <span class="font-semibold">Phân loại hoàn thành!</span>
        <span class="badge badge-success">Hoàn thành!</span>
      </div>
      <div class="game-body quiz-result-body">
        <div class="quiz-result-card quiz-enter">
          <div class="quiz-trophy">${this.wrongs === 0 ? '🏆' : '🎉'}</div>
          <h2 class="quiz-result-title">Xếp đúng ${this.placedCount}/${total} mục</h2>
          <div class="quiz-stat-row">
            <span class="quiz-stat">⭐ <strong>${this.score}</strong> điểm</span>
            <span class="quiz-stat">🎯 Chính xác <strong>${accuracy}%</strong></span>
            <span class="quiz-stat">❌ Sai <strong>${this.wrongs}</strong></span>
            <span class="quiz-stat">⏱️ <strong>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</strong></span>
          </div>
          <div class="quiz-hint">${this.wrongs === 0 ? 'Phân loại hoàn hảo! 🏆' : 'Càng ít lần đặt sai càng giỏi!'}</div>
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
