/* ==========================================================================
   TeacherStudio Command Palette (Ctrl+K) & Global Search (Section 31 & 32)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { GameRegistry } from '../core/game-registry.js';
import { TEMPLATES } from '../core/template-engine.js';
import { Dialogs } from './dialogs.js';
import { ProjectManager } from '../core/project-manager.js';
import { Notifications } from './notifications.js';
import { BackupEngine } from '../storage/backup.js';

export const CommandPalette = {
  isOpen: false,

  init() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  },

  async open() {
    if (this.isOpen) return;
    this.isOpen = true;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    const content = document.createElement('div');
    content.className = 'modal-content cmd-palette';
    content.style.maxWidth = '540px';

    content.innerHTML = `
      <input type="text" class="cmd-search-input" id="cmd-input" placeholder="Nhập lệnh hoặc tìm kiếm dự án, trò chơi, mẫu... (Ctrl+K)" autofocus>
      <div class="cmd-item-list" id="cmd-results"></div>
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    const input = content.querySelector('#cmd-input');
    const results = content.querySelector('#cmd-results');

    const defaultCommands = [
      { title: 'Tạo trò chơi mới', category: 'Lệnh', action: () => {
        close();
        Dialogs.showNewProjectModal(async (data) => {
          const { project } = await ProjectManager.createNewProject(data);
          Notifications.success('Đã tạo trò chơi mới!');
          window.location.hash = `#editor?id=${project.id}`;
        });
      }},
      { title: 'Xem danh sách dự án của tôi', category: 'Điều hướng', action: () => { close(); window.location.hash = '#projects'; }},
      { title: 'Khám phá Thư viện trò chơi', category: 'Điều hướng', action: () => { close(); window.location.hash = '#games'; }},
      { title: 'Mở Thư viện câu hỏi', category: 'Điều hướng', action: () => { close(); window.location.hash = '#content'; }},
      { title: 'Mở Mẫu hoạt động sư phạm', category: 'Điều hướng', action: () => { close(); window.location.hash = '#templates'; }},
      { title: 'Mở Bộ sưu tập chủ đề', category: 'Điều hướng', action: () => { close(); window.location.hash = '#themes'; }},
      { title: 'Mở Cài đặt hệ thống', category: 'Điều hướng', action: () => { close(); window.location.hash = '#settings'; }},
      { title: 'Mở Trợ giúp & Hướng dẫn', category: 'Điều hướng', action: () => { close(); window.location.hash = '#help'; }},
      { title: 'Xuất file sao lưu (.tstudio)', category: 'Dữ liệu', action: async () => { close(); await BackupEngine.exportBackup(); }}
    ];

    const renderList = async (query = '') => {
      const q = query.trim().toLowerCase();
      let items = [...defaultCommands];

      if (q) {
        // Search projects too!
        const projects = await Storage.getProjects();
        projects.forEach(p => {
          if (p.name.toLowerCase().includes(q) || (p.subject && p.subject.toLowerCase().includes(q))) {
            items.push({
              title: `Dự án: ${p.name} (${p.subject || 'Lớp học'})`,
              category: 'Dự án',
              action: () => { close(); window.location.hash = `#editor?id=${p.id}`; }
            });
          }
        });

        // Search templates
        TEMPLATES.forEach(tpl => {
          if (tpl.name.toLowerCase().includes(q) || tpl.description.toLowerCase().includes(q)) {
            items.push({
              title: `Mẫu: ${tpl.name}`,
              category: 'Mẫu hoạt động',
              action: () => { close(); window.location.hash = '#templates'; }
            });
          }
        });

        items = items.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
      }

      if (items.length === 0) {
        results.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Không tìm thấy kết quả nào</div>`;
        return;
      }

      results.innerHTML = items.map((item, idx) => `
        <div class="cmd-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
          <span class="badge" style="font-size: 11px;">${item.category}</span>
          <span style="flex: 1; font-weight: 500;">${item.title}</span>
        </div>
      `).join('');

      results.querySelectorAll('.cmd-item').forEach((el, idx) => {
        el.onclick = () => {
          if (items[idx]) items[idx].action();
        };
      });
    };

    renderList();

    input.oninput = (e) => {
      renderList(e.target.value);
    };

    const close = () => {
      if (backdrop.parentElement) {
        document.body.removeChild(backdrop);
      }
      this.isOpen = false;
    };

    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Escape') close();
    };
  }
};
