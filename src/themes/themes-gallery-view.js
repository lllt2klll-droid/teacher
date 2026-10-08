/* ==========================================================================
   TeacherStudio Themes Gallery View (Section 21)
   ========================================================================== */

import { THEMES } from './theme-definitions.js';

export const ThemesGalleryView = {
  render(container) {
    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Bộ sưu tập Chủ đề (Themes)</h1>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
          9 chủ đề sư phạm học đường được thiết kế hài hòa, giúp tiết học thêm phần sinh động.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${THEMES.map(theme => `
          <div class="card" style="padding: 20px; border: 1px solid var(--color-border); overflow: hidden;">
            <div style="height: 100px; border-radius: 8px; background: ${theme.colors.bg}; border: 1px solid ${theme.colors.border}; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; justify-content: space-between;">
              <div class="flex items-center justify-between">
                <span style="font-size: 12px; font-weight: 700; color: ${theme.colors.primary};">Xem trước giao diện</span>
                <div style="display: flex; gap: 4px;">
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: ${theme.colors.primary};"></span>
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: ${theme.colors.accent || '#DDD'};"></span>
                </div>
              </div>
              <div style="font-size: 14px; font-weight: 600; color: ${theme.colors.text};">
                Ví dụ: Câu 1. Em hãy chọn đáp án đúng?
              </div>
            </div>

            <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 6px;">${theme.name}</h3>
            <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.4;">${theme.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
};
