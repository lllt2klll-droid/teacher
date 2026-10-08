/* ==========================================================================
   TeacherStudio Modal Dialogs & Sheets
   ========================================================================== */

import { Icons } from './icons.js';
import { GameRegistry } from '../core/game-registry.js';
import { THEMES } from '../themes/theme-definitions.js';

export const Dialogs = {
  createModal({ title, contentHtml, footerHtml = '', maxWidth = '560px' }) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    const content = document.createElement('div');
    content.className = 'modal-content';
    if (maxWidth) content.style.maxWidth = maxWidth;

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title font-semibold" style="font-size: 17px;">${title}</h3>
        <button class="btn btn-icon btn-close" aria-label="Đóng">${Icons.get('x')}</button>
      </div>
      <div class="modal-body">
        ${contentHtml}
      </div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    const close = () => {
      if (backdrop.parentElement) {
        document.body.removeChild(backdrop);
      }
    };

    content.querySelector('.btn-close').onclick = close;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };

    return { backdrop, content, close };
  },

  confirm({ title = 'Xác nhận thao tác', message, confirmText = 'Xác nhận', isDanger = false, onConfirm }) {
    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} btn-confirm">${confirmText}</button>
    `;

    const modal = this.createModal({
      title,
      contentHtml: `<p style="font-size: 15px; line-height: 1.5; color: var(--color-text);">${message}</p>`,
      footerHtml
    });

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();
    modal.content.querySelector('.btn-confirm').onclick = () => {
      modal.close();
      if (onConfirm) onConfirm();
    };

    return modal;
  },

  showNewProjectModal(onCreated) {
    const games = GameRegistry.getAll();
    const themes = THEMES;

    const contentHtml = `
      <form id="form-new-project">
        <div class="form-group">
          <label class="form-label">Tên hoạt động / Trò chơi *</label>
          <input type="text" class="input" id="inp-proj-name" placeholder="Ví dụ: Ôn tập Làm tròn số thập phân" required autofocus>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Môn học</label>
            <select class="select" id="inp-proj-subject">
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
              <option value="Đạo đức">Đạo đức</option>
              <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Khối lớp</label>
            <select class="select" id="inp-proj-grade">
              <option value="Lớp 1">Lớp 1</option>
              <option value="Lớp 2">Lớp 2</option>
              <option value="Lớp 3">Lớp 3</option>
              <option value="Lớp 4">Lớp 4</option>
              <option value="Lớp 5" selected>Lớp 5</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Hình thức trò chơi</label>
          <select class="select" id="inp-proj-game">
            ${games.map(g => `<option value="${g.id}">${g.name} - ${g.pedagogy}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Chủ đề giao diện (Theme)</label>
          <select class="select" id="inp-proj-theme">
            ${themes.map(t => `<option value="${t.id}">${t.name} (${t.description.slice(0, 32)}...)</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Ghi chú / Mô tả ngắn</label>
          <input type="text" class="input" id="inp-proj-desc" placeholder="Dành cho hoạt động khởi động 5 phút">
        </div>
      </form>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn btn-primary btn-submit">Tạo trò chơi</button>
    `;

    const modal = this.createModal({
      title: 'Tạo trò chơi mới',
      contentHtml,
      footerHtml
    });

    const form = modal.content.querySelector('#form-new-project');
    const submitBtn = modal.content.querySelector('.btn-submit');
    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();

    const handleSubmit = (e) => {
      e.preventDefault();
      const name = modal.content.querySelector('#inp-proj-name').value.trim();
      if (!name) return;
      const subject = modal.content.querySelector('#inp-proj-subject').value;
      const grade = modal.content.querySelector('#inp-proj-grade').value;
      const gameType = modal.content.querySelector('#inp-proj-game').value;
      const themeId = modal.content.querySelector('#inp-proj-theme').value;
      const description = modal.content.querySelector('#inp-proj-desc').value.trim();

      modal.close();
      if (onCreated) {
        onCreated({ name, subject, grade, gameType, themeId, description });
      }
    };

    form.onsubmit = handleSubmit;
    submitBtn.onclick = handleSubmit;
    return modal;
  },

  showChangeGameModal(currentGameType, onSelect) {
    const games = GameRegistry.getAll();
    const contentHtml = `
      <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px;">
        Toàn bộ câu hỏi và nội dung hiện tại sẽ được giữ nguyên và tự động ánh xạ sang định dạng trò chơi mới.
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 380px; overflow-y: auto;">
        ${games.map(g => `
          <button class="btn btn-secondary game-select-card ${g.id === currentGameType ? 'active' : ''}" 
            data-id="${g.id}" 
            style="display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding: 12px; gap: 4px; border: 2px solid ${g.id === currentGameType ? 'var(--color-primary)' : 'var(--color-border)'};">
            <div class="font-semibold" style="font-size: 15px;">${g.name}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">${g.pedagogy}</div>
          </button>
        `).join('')}
      </div>
    `;

    const modal = this.createModal({
      title: 'Đổi hình thức trò chơi',
      contentHtml
    });

    modal.content.querySelectorAll('.game-select-card').forEach(card => {
      card.onclick = () => {
        const selectedId = card.getAttribute('data-id');
        modal.close();
        if (onSelect) onSelect(selectedId);
      };
    });

    return modal;
  },

  showDiagnosticsModal(validationResult, onConfirmExport) {
    const { isValid, checks } = validationResult;
    const contentHtml = `
      <div style="font-size: 14px; margin-bottom: 16px; color: var(--color-text-secondary);">
        Hệ thống tự động kiểm tra tính toàn vẹn của dữ liệu và đảm bảo file HTML độc lập có thể hoạt động hoàn hảo:
      </div>
      <div class="flex flex-col gap-2" style="margin-bottom: 20px;">
        ${checks.map(c => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 14px; background: ${c.status === 'ok' ? 'var(--color-success-subtle)' : (c.status === 'warning' ? 'var(--color-warning-subtle)' : 'var(--color-danger-subtle)')}; color: ${c.status === 'ok' ? 'var(--color-success)' : (c.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)')};">
            <span style="font-weight: 700;">${c.status === 'ok' ? '✓' : (c.status === 'warning' ? '⚠' : '✕')}</span>
            <span style="flex: 1; color: var(--color-text);">${c.message}</span>
          </div>
        `).join('')}
      </div>
      <div class="card" style="padding: 12px 16px; background: var(--color-surface-subtle);">
        <div style="font-size: 13px; color: var(--color-text-secondary);">
          💡 <strong>Gợi ý:</strong> File HTML đã xuất có thể mở trực tiếp bằng trình duyệt (Chrome, Cốc Cốc, Edge), copy vào USB để trình chiếu trên máy chiếu lớp học mà không cần kết nối mạng.
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn btn-primary btn-export" ${!isValid ? 'disabled' : ''}>
        ${Icons.get('download')} Tải file HTML ngay
      </button>
    `;

    const modal = this.createModal({
      title: 'Kiểm tra chẩn đoán trước khi xuất file',
      contentHtml,
      footerHtml
    });

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();
    const exportBtn = modal.content.querySelector('.btn-export');
    if (exportBtn) {
      exportBtn.onclick = () => {
        modal.close();
        if (onConfirmExport) onConfirmExport();
      };
    }

    return modal;
  }
};
