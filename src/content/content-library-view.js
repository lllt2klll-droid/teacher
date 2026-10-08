/* ==========================================================================
   TeacherStudio Question Bank & Content Library View (Section 10)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { ProjectManager } from '../core/project-manager.js';
import { BulkImportModal } from './bulk-import-modal.js';
import { Notifications } from '../ui/notifications.js';
import { Icons } from '../ui/icons.js';
import { Dialogs } from '../ui/dialogs.js';

export const ContentLibraryView = {
  async render(container) {
    const contents = await Storage.getContents();

    container.innerHTML = `
      <div class="view-header flex items-center justify-between" style="margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 700;">Thư viện Câu hỏi (Question Bank)</h1>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
            Các bộ câu hỏi độc lập có thể tái sử dụng cho nhiều hình thức trò chơi khác nhau.
          </p>
        </div>
        <button class="btn btn-primary" id="btn-create-content-bank">
          ${Icons.get('plus')} Tạo bộ câu hỏi mới
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${contents.map(c => `
          <div class="card flex flex-col justify-between" style="padding: 20px;">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 8px;">
                <span class="badge badge-primary">${c.subject || 'Lớp học'}</span>
                <span class="text-xs text-secondary">${(c.questions || []).length} câu hỏi</span>
              </div>
              <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 6px;">${c.name}</h3>
              <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.4;">
                ${c.description || 'Bộ câu hỏi tái sử dụng'}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button class="btn btn-primary btn-sm btn-create-game-from-content" data-id="${c.id}" style="flex: 1;">
                Tạo trò chơi từ bộ này
              </button>
              <button class="btn btn-icon btn-sm btn-del-content" data-id="${c.id}" title="Xóa" style="color: var(--color-danger);">
                ${Icons.get('trash')}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const createBankBtn = container.querySelector('#btn-create-content-bank');
    if (createBankBtn) {
      createBankBtn.onclick = () => {
        BulkImportModal.show(async (questions) => {
          const newBank = {
            id: 'content_' + Date.now(),
            name: 'Bộ câu hỏi mới (' + new Date().toLocaleDateString('vi-VN') + ')',
            subject: 'Toán',
            grade: '5',
            description: 'Được tạo từ tính năng nhập nhanh',
            questions
          };
          await Storage.saveContent(newBank);
          Notifications.success('Đã lưu bộ câu hỏi mới vào thư viện!');
          this.render(container);
        });
      };
    }

    container.querySelectorAll('.btn-create-game-from-content').forEach(btn => {
      btn.onclick = async () => {
        const cId = btn.getAttribute('data-id');
        const c = await Storage.getContent(cId);
        if (c) {
          Dialogs.showNewProjectModal(async (data) => {
            data.sampleQuestions = c.questions;
            const { project } = await ProjectManager.createNewProject(data);
            Notifications.success(`Đã tạo trò chơi từ bộ "${c.name}"!`);
            window.location.hash = `#editor?id=${project.id}`;
          });
        }
      };
    });

    container.querySelectorAll('.btn-del-content').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        Dialogs.confirm({
          title: 'Xóa bộ câu hỏi',
          message: 'Thầy/Cô có chắc chắn muốn xóa bộ câu hỏi này?',
          isDanger: true,
          confirmText: 'Xóa',
          onConfirm: async () => {
            await Storage.deleteContent(id);
            Notifications.success('Đã xóa bộ câu hỏi');
            this.render(container);
          }
        });
      };
    });
  }
};
