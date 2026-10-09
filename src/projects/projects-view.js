/* ==========================================================================
   TeacherStudio Projects View (Section 08)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { ProjectManager } from '../core/project-manager.js';
import { GameRegistry } from '../core/game-registry.js';
import { ThemeEngine } from '../core/theme-engine.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';
import { Icons, avatarFor } from '../ui/icons.js';
import { ValidationEngine } from '../core/validation-engine.js';
import { ExportEngine } from '../core/export-engine.js';

export const ProjectsView = {
  async render(container) {
    const projects = await Storage.getProjects();
    let currentFilterSubject = 'all';
    let searchQuery = '';

    const renderTable = () => {
      let filtered = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      if (currentFilterSubject !== 'all') {
        filtered = filtered.filter(p => p.subject === currentFilterSubject);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.subject && p.subject.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }

      const tbody = container.querySelector('#projects-table-body');
      const countEl = container.querySelector('#projects-count');
      if (countEl) countEl.textContent = `${filtered.length} hoạt động`;

      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
              Không tìm thấy dự án nào phù hợp với tìm kiếm.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(p => `
        <tr>
          <td>
            <div class="cell-main">
              ${avatarFor(p.name)}
              <div style="min-width: 0;">
                <span class="row-title" onclick="location.hash='#editor?id=${p.id}'">${p.name}</span>
                <div class="row-sub">${p.description || 'Chưa có mô tả'}</div>
              </div>
            </div>
          </td>
          <td>${p.subject || '-'}</td>
          <td>${p.grade || '-'}</td>
          <td><span class="badge badge-primary">${GameRegistry.get(p.gameType)?.name || p.gameType}</span></td>
          <td><span class="badge">${ThemeEngine.getTheme(p.themeId)?.name || 'Mặc định'}</span></td>
          <td class="text-sm text-secondary">${new Date(p.updatedAt).toLocaleDateString('vi-VN')}</td>
          <td style="text-align: right;">
            <div class="row-actions">
              <button class="btn btn-secondary btn-sm btn-edit-p" data-id="${p.id}">${Icons.get('edit')} Sửa</button>
              <button class="btn btn-icon btn-export-p" data-id="${p.id}" title="Xuất HTML">${Icons.get('download')}</button>
              <button class="btn btn-icon btn-dup-p" data-id="${p.id}" title="Nhân bản">${Icons.get('copy')}</button>
              <button class="btn btn-icon btn-del-p" data-id="${p.id}" title="Xóa" style="color: var(--color-danger);">${Icons.get('trash')}</button>
            </div>
          </td>
        </tr>
      `).join('');

      // Bind row actions
      tbody.querySelectorAll('.btn-edit-p').forEach(btn => {
        btn.onclick = () => window.location.hash = `#editor?id=${btn.getAttribute('data-id')}`;
      });

      tbody.querySelectorAll('.btn-export-p').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute('data-id');
          const p = await Storage.getProject(id);
          const c = await Storage.getContent(p.contentId);
          const val = ValidationEngine.validateProjectForExport(p, c);
          Dialogs.showDiagnosticsModal(val, (profile) => {
            const result = ExportEngine.downloadStandaloneHtml(p, c, profile || 'standalone');
            Notifications.success(`Đã xuất file HTML "${result.filename}" thành công!`);
            Dialogs.showExportSuccessModal({ filename: result.filename, profile: result.profile, gameType: p.gameType });
          }, p);
        };
      });

      tbody.querySelectorAll('.btn-dup-p').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute('data-id');
          await ProjectManager.duplicateProject(id);
          Notifications.success('Đã nhân bản dự án thành công');
          this.render(container);
        };
      });

      tbody.querySelectorAll('.btn-del-p').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          Dialogs.confirm({
            title: 'Xóa dự án',
            message: 'Thầy/Cô có chắc chắn muốn xóa dự án này vĩnh viễn?',
            isDanger: true,
            confirmText: 'Xóa',
            onConfirm: async () => {
              await ProjectManager.deleteProject(id);
              Notifications.success('Đã xóa dự án thành công');
              this.render(container);
            }
          });
        };
      });
    };

    container.innerHTML = `
      <div class="page-head">
        <div class="page-head-row">
          <div>
            <div class="eyebrow">Không gian soạn bài</div>
            <h1>Dự án của tôi</h1>
            <p class="page-desc" id="projects-count">${projects.length} hoạt động</p>
          </div>
          <button class="btn btn-primary" id="btn-projects-new">
            ${Icons.get('plus')} Tạo trò chơi mới
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="toolbar-card">
        <div class="search-wrap">
          <span class="search-ic">${Icons.get('search')}</span>
          <input type="text" class="input" id="inp-search-projects" placeholder="Tìm kiếm theo tên bài, môn học...">
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-secondary">Môn học:</span>
          <select class="select" id="sel-filter-subject" style="width: auto;">
            <option value="all">Tất cả môn học</option>
            <option value="Toán">Toán</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
            <option value="Hoạt động chung">Hoạt động chung</option>
          </select>
        </div>
      </div>

      <!-- Projects Table -->
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Môn học</th>
              <th>Khối</th>
              <th>Hình thức</th>
              <th>Chủ đề</th>
              <th>Cập nhật</th>
              <th style="text-align: right;">Thao tác</th>
            </tr>
          </thead>
          <tbody id="projects-table-body"></tbody>
        </table>
      </div>
    `;

    renderTable();

    // Toolbar event bindings
    const searchInp = container.querySelector('#inp-search-projects');
    if (searchInp) {
      searchInp.oninput = (e) => {
        searchQuery = e.target.value;
        renderTable();
      };
    }

    const subSelect = container.querySelector('#sel-filter-subject');
    if (subSelect) {
      subSelect.onchange = (e) => {
        currentFilterSubject = e.target.value;
        renderTable();
      };
    }

    const newBtn = container.querySelector('#btn-projects-new');
    if (newBtn) {
      newBtn.onclick = () => {
        Dialogs.showNewProjectModal(async (data) => {
          const { project } = await ProjectManager.createNewProject(data);
          Notifications.success('Đã tạo dự án mới!');
          window.location.hash = `#editor?id=${project.id}`;
        });
      };
    }
  }
};
