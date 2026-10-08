/* ==========================================================================
   TeacherStudio Dashboard View (Section 07)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { ProjectManager } from '../core/project-manager.js';
import { GameRegistry } from '../core/game-registry.js';
import { TEMPLATES } from '../core/template-engine.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';
import { Icons } from '../ui/icons.js';
import { EventBus } from '../core/event-bus.js';

export const DashboardView = {
  async render(container) {
    const projects = await Storage.getProjects();
    const sortedProjects = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const recentProject = sortedProjects[0] || null;

    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 28px;">
        <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 4px;">Chào mừng Thầy/Cô trở lại</div>
        <h1 style="font-size: 26px; font-weight: 700; color: var(--color-text);">Chào Thầy/Cô 👋</h1>
        <p style="color: var(--color-text-secondary); font-size: 14px; margin-top: 4px;">
          Tạo hoạt động tương tác sinh động cho lớp học một cách nhẹ nhàng, nhanh chóng và chuyên nghiệp.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
        <button class="btn btn-primary btn-lg" id="btn-quick-new">
          ${Icons.get('plus')} Tạo trò chơi mới
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-quick-template">
          ${Icons.get('layout')} Khám phá mẫu
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-quick-backup">
          ${Icons.get('upload')} Sao lưu & Khôi phục
        </button>
      </div>

      ${recentProject ? `
        <!-- Continue Recent Project Card -->
        <div class="card" style="margin-bottom: 32px; border-left: 4px solid var(--color-primary); background: var(--color-surface);">
          <div class="flex items-center justify-between" style="margin-bottom: 8px;">
            <span class="badge badge-primary">Tiếp tục gần đây</span>
            <span class="text-xs text-muted">Cập nhật: ${new Date(recentProject.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${recentProject.name}</h3>
              <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0;">
                Môn: <strong>${recentProject.subject || 'Lớp học'}</strong> • Khối: <strong>${recentProject.grade || 'Tiểu học'}</strong> • Loại: <strong>${GameRegistry.get(recentProject.gameType)?.name || recentProject.gameType}</strong>
              </p>
            </div>
            <button class="btn btn-primary btn-open-recent" data-id="${recentProject.id}">
              Tiếp tục chỉnh sửa →
            </button>
          </div>
        </div>
      ` : ''}

      <!-- My Projects Section -->
      <div style="margin-bottom: 36px;">
        <div class="flex items-center justify-between" style="margin-bottom: 16px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 600;">Dự án của tôi</h2>
            <span style="font-size: 13px; color: var(--color-text-secondary);">${projects.length} hoạt động đã tạo</span>
          </div>
          <a href="#projects" class="text-sm font-medium" style="color: var(--color-primary);">Xem tất cả →</a>
        </div>

        ${projects.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.get('folder')}</div>
            <h3 class="empty-state-title">Chưa có dự án nào</h3>
            <p class="empty-state-desc">Hãy bắt đầu tạo trò chơi đầu tiên để sẵn sàng cho tiết học thú vị sắp tới.</p>
            <button class="btn btn-primary" id="btn-empty-new">${Icons.get('plus')} Tạo trò chơi đầu tiên</button>
          </div>
        ` : `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Tên hoạt động</th>
                  <th>Môn học</th>
                  <th>Khối</th>
                  <th>Hình thức</th>
                  <th>Cập nhật</th>
                  <th style="text-align: right;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${sortedProjects.slice(0, 5).map(p => `
                  <tr>
                    <td>
                      <div class="font-semibold" style="cursor: pointer;" onclick="location.hash='#editor?id=${p.id}'">${p.name}</div>
                      ${p.tags && p.tags.length ? `<div class="flex gap-1" style="margin-top: 4px;">${p.tags.map(t => `<span class="badge" style="font-size: 10px;">${t}</span>`).join('')}</div>` : ''}
                    </td>
                    <td>${p.subject || '-'}</td>
                    <td>${p.grade || '-'}</td>
                    <td><span class="badge badge-primary">${GameRegistry.get(p.gameType)?.name || p.gameType}</span></td>
                    <td class="text-sm text-secondary">${new Date(p.updatedAt).toLocaleDateString('vi-VN')}</td>
                    <td style="text-align: right;">
                      <div class="flex items-center justify-center gap-1" style="justify-content: flex-end;">
                        <button class="btn btn-icon btn-edit-proj" data-id="${p.id}" title="Chỉnh sửa">${Icons.get('edit')}</button>
                        <button class="btn btn-icon btn-dup-proj" data-id="${p.id}" title="Nhân bản">${Icons.get('copy')}</button>
                        <button class="btn btn-icon btn-del-proj" data-id="${p.id}" title="Xóa" style="color: var(--color-danger);">${Icons.get('trash')}</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Pre-made Templates Section -->
      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 16px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 600;">Mẫu hoạt động gợi ý cho tiết học</h2>
            <span style="font-size: 13px; color: var(--color-text-secondary);">Chọn mẫu để tạo nhanh bài tập tương tác hoàn chỉnh</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
          ${TEMPLATES.slice(0, 4).map(tpl => `
            <div class="card flex flex-col justify-between" style="border: 1px solid var(--color-border); cursor: pointer; transition: transform 0.15s, border-color 0.15s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='var(--color-border)'">
              <div>
                <span class="badge badge-primary" style="margin-bottom: 8px;">${tpl.phaseName}</span>
                <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 6px;">${tpl.name}</h4>
                <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px; line-height: 1.4;">${tpl.description}</p>
              </div>
              <button class="btn btn-secondary btn-sm btn-use-tpl" data-id="${tpl.id}" style="width: 100%;">
                Dùng mẫu này →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    const handleNew = () => {
      Dialogs.showNewProjectModal(async (data) => {
        const { project } = await ProjectManager.createNewProject(data);
        Notifications.success('Đã tạo trò chơi thành công!');
        window.location.hash = `#editor?id=${project.id}`;
      });
    };

    const newBtn = container.querySelector('#btn-quick-new');
    const emptyNewBtn = container.querySelector('#btn-empty-new');
    if (newBtn) newBtn.onclick = handleNew;
    if (emptyNewBtn) emptyNewBtn.onclick = handleNew;

    const tplBtn = container.querySelector('#btn-quick-template');
    if (tplBtn) tplBtn.onclick = () => window.location.hash = '#templates';

    const backupBtn = container.querySelector('#btn-quick-backup');
    if (backupBtn) backupBtn.onclick = () => window.location.hash = '#settings';

    const openRecent = container.querySelector('.btn-open-recent');
    if (openRecent) {
      openRecent.onclick = () => {
        window.location.hash = `#editor?id=${openRecent.getAttribute('data-id')}`;
      };
    }

    container.querySelectorAll('.btn-edit-proj').forEach(btn => {
      btn.onclick = () => {
        window.location.hash = `#editor?id=${btn.getAttribute('data-id')}`;
      };
    });

    container.querySelectorAll('.btn-dup-proj').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-id');
        await ProjectManager.duplicateProject(id);
        Notifications.success('Đã nhân bản dự án thành công');
        this.render(container);
      };
    });

    container.querySelectorAll('.btn-del-proj').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        Dialogs.confirm({
          title: 'Xóa trò chơi',
          message: 'Thầy/Cô có chắc chắn muốn xóa trò chơi này? Thao tác không thể hoàn tác.',
          isDanger: true,
          confirmText: 'Xóa dự án',
          onConfirm: async () => {
            await ProjectManager.deleteProject(id);
            Notifications.success('Đã xóa dự án');
            this.render(container);
          }
        });
      };
    });

    container.querySelectorAll('.btn-use-tpl').forEach(btn => {
      btn.onclick = async () => {
        const tplId = btn.getAttribute('data-id');
        const tpl = TEMPLATES.find(t => t.id === tplId);
        if (tpl) {
          const { project } = await ProjectManager.createNewProject({
            name: tpl.name,
            gameType: tpl.gameType,
            themeId: tpl.themeId,
            sampleQuestions: tpl.sampleQuestions
          });
          Notifications.success(`Đã khởi tạo dự án từ mẫu "${tpl.name}"`);
          window.location.hash = `#editor?id=${project.id}`;
        }
      };
    });
  }
};
