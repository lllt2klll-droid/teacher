/* ==========================================================================
   TeacherStudio Onboarding Modal (Section 34)
   ========================================================================== */

import { Dialogs } from '../ui/dialogs.js';
import { LocalStorage } from '../storage/local-storage.js';

export const OnboardingModal = {
  checkAndShow(onStartCreate) {
    const seen = LocalStorage.get('onboarding_seen', false);
    if (!seen) {
      this.show(onStartCreate);
      LocalStorage.set('onboarding_seen', true);
    }
  },

  show(onStartCreate) {
    const contentHtml = `
      <div style="text-align: center; padding: 12px 8px;">
        <div style="font-size: 52px; margin-bottom: 12px;">🎒</div>
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Chào mừng Thầy/Cô đến với TeacherStudio!</h2>
        <p style="font-size: 14px; color: var(--color-text-secondary); max-width: 440px; margin: 0 auto 24px; line-height: 1.5;">
          Ứng dụng giúp giáo viên tiểu học dễ dàng tạo các trò chơi và hoạt động học tập tương tác mà không cần biết lập trình, xuất file HTML tự chạy không cần internet.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; margin-bottom: 24px;">
          <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px;">
            <div class="font-semibold" style="font-size: 13px; margin-bottom: 2px;">⚡ Soạn bài siêu tốc</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">Nhập từng câu hoặc dán hàng loạt chỉ trong vài giây.</div>
          </div>
          <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px;">
            <div class="font-semibold" style="font-size: 13px; margin-bottom: 2px;">📦 Xuất 1 file duy nhất</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">File HTML độc lập, mở ngay trên mọi máy tính và máy chiếu.</div>
          </div>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-close-ob">Xem sau</button>
      <button class="btn btn-primary btn-start-ob">Bắt đầu tạo trò chơi ngay →</button>
    `;

    const modal = Dialogs.createModal({
      title: 'Giới thiệu nhanh TeacherStudio',
      contentHtml,
      footerHtml,
      maxWidth: '520px'
    });

    modal.content.querySelector('.btn-close-ob').onclick = () => modal.close();
    modal.content.querySelector('.btn-start-ob').onclick = () => {
      modal.close();
      if (onStartCreate) onStartCreate();
    };

    return modal;
  }
};
