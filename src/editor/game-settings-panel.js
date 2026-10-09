/* ==========================================================================
   TeacherStudio Game Settings & Design Panel (Right Panel)
   ========================================================================== */

import { THEMES } from '../themes/theme-definitions.js';

export const GameSettingsPanel = {
  render(container, { project, onProjectChange }) {
    const p = project;
    const settings = p.settings || {};
    const viewport = p.viewport || { mode: '16:9' };

    container.innerHTML = `
      <div class="panel-head">
        <span class="panel-title">Thiết kế & Cài đặt</span>
      </div>

      <div style="padding: 16px; overflow-y: auto; flex: 1;">
        
        <!-- Theme Selection -->
        <div style="margin-bottom: 24px;">
          <label class="form-label" style="margin-bottom: 8px;">Chủ đề giao diện (Theme)</label>
          <div class="flex flex-col gap-2">
            ${THEMES.map(t => `
              <div class="theme-choice-card ${p.themeId === t.id ? 'active' : ''}" data-theme-id="${t.id}" style="padding: 10px 12px; border: 2px solid ${p.themeId === t.id ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: 8px; cursor: pointer; background: var(--color-surface); transition: border-color 0.15s;">
                <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                  <span class="font-semibold" style="font-size: 14px;">${t.name}</span>
                  <div style="width: 16px; height: 16px; border-radius: 50%; background: ${t.colors.primary};"></div>
                </div>
                <div style="font-size: 12px; color: var(--color-text-secondary); line-height: 1.3;">${t.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Gameplay Settings -->
        <div style="margin-bottom: 24px; border-top: 1px solid var(--color-border); padding-top: 16px;">
          <label class="form-label" style="margin-bottom: 12px;">Cài đặt trò chơi</label>

          <!-- Sound toggle -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">Hiệu ứng âm thanh</div>
              <div class="text-xs text-secondary">Tiếng chuông đúng, sai, reo thưởng</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-sound" ${settings.soundEnabled !== false ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Timer toggle -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">Đồng hồ đếm ngược</div>
              <div class="text-xs text-secondary">Giới hạn thời gian mỗi câu</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-timer" ${settings.timerEnabled !== false ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Shuffle questions -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">Xáo trộn câu hỏi</div>
              <div class="text-xs text-secondary">Đổi thứ tự ngẫu nhiên mỗi lần chơi</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-shuffle" ${settings.shuffleQuestions ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Show explanation -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">Hiện giải thích đáp án</div>
              <div class="text-xs text-secondary">Hiển thị lời giải sau khi chọn</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-explanation" ${settings.showExplanation !== false ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Read aloud -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">🔊 Nút đọc to câu hỏi</div>
              <div class="text-xs text-secondary">Giọng Việt, giúp HS lớp 1-2 chưa đọc thạo</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-readaloud" ${settings.readAloud !== false ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Teacher mode -->
          <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div>
              <div class="font-medium" style="font-size: 13px;">👩‍🏫 Chế độ giáo viên</div>
              <div class="text-xs text-secondary">Hiện đáp án + giải thích ngay trong game & file xuất</div>
            </div>
            <label class="switch">
              <input type="checkbox" id="chk-teachermode" ${settings.teacherMode ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>

        <!-- Viewport Mode -->
        <div style="border-top: 1px solid var(--color-border); padding-top: 16px;">
          <label class="form-label" style="margin-bottom: 8px;">Tỷ lệ khung nhìn (Viewport)</label>
          <select class="select" id="sel-viewport-mode">
            <option value="16:9" ${viewport.mode === '16:9' ? 'selected' : ''}>16:9 (Màn hình rộng / Máy chiếu chuẩn)</option>
            <option value="4:3" ${viewport.mode === '4:3' ? 'selected' : ''}>4:3 (Máy tính bảng / Màn hình vuông)</option>
            <option value="1:1" ${viewport.mode === '1:1' ? 'selected' : ''}>1:1 (Hình vuông)</option>
            <option value="mobile" ${viewport.mode === 'mobile' ? 'selected' : ''}>Điện thoại dọc (9:16)</option>
          </select>
        </div>

      </div>
    `;

    // Bind event handlers
    container.querySelectorAll('.theme-choice-card').forEach(card => {
      card.onclick = () => {
        const themeId = card.getAttribute('data-theme-id');
        p.themeId = themeId;
        container.querySelectorAll('.theme-choice-card').forEach(c => {
          c.style.borderColor = c.getAttribute('data-theme-id') === themeId ? 'var(--color-primary)' : 'var(--color-border)';
        });
        onProjectChange(p);
      };
    });

    const chkSound = container.querySelector('#chk-sound');
    if (chkSound) {
      chkSound.onchange = (e) => {
        p.settings.soundEnabled = e.target.checked;
        onProjectChange(p);
      };
    }

    const chkTimer = container.querySelector('#chk-timer');
    if (chkTimer) {
      chkTimer.onchange = (e) => {
        p.settings.timerEnabled = e.target.checked;
        onProjectChange(p);
      };
    }

    const chkShuffle = container.querySelector('#chk-shuffle');
    if (chkShuffle) {
      chkShuffle.onchange = (e) => {
        p.settings.shuffleQuestions = e.target.checked;
        onProjectChange(p);
      };
    }

    const chkExplanation = container.querySelector('#chk-explanation');
    if (chkExplanation) {
      chkExplanation.onchange = (e) => {
        p.settings.showExplanation = e.target.checked;
        onProjectChange(p);
      };
    }

    const chkReadAloud = container.querySelector('#chk-readaloud');
    if (chkReadAloud) {
      chkReadAloud.onchange = (e) => {
        p.settings.readAloud = e.target.checked;
        onProjectChange(p);
      };
    }

    const chkTeacherMode = container.querySelector('#chk-teachermode');
    if (chkTeacherMode) {
      chkTeacherMode.onchange = (e) => {
        p.settings.teacherMode = e.target.checked;
        onProjectChange(p);
      };
    }

    const selViewport = container.querySelector('#sel-viewport-mode');
    if (selViewport) {
      selViewport.onchange = (e) => {
        if (!p.viewport) p.viewport = {};
        p.viewport.mode = e.target.value;
        onProjectChange(p);
      };
    }
  }
};
