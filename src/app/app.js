/* ==========================================================================
   TeacherStudio Application Shell (Section 06)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { Icons } from '../ui/icons.js';
import { CommandPalette } from '../ui/command-palette.js';
import { Router } from './router.js';
import { OnboardingModal } from '../onboarding/onboarding-modal.js';
import { Dialogs } from '../ui/dialogs.js';
import { ProjectManager } from '../core/project-manager.js';
import { Notifications } from '../ui/notifications.js';

export const App = {
  async init() {
    await Storage.init();
    this.applyInitialTheme();

    const root = document.getElementById('app');
    root.innerHTML = `
      <!-- App Sidebar (Section 6.2) -->
      <aside class="app-sidebar" id="app-sidebar">
        <div class="sidebar-brand">
          <div class="brand-logo">T</div>
          <span class="brand-name">TeacherStudio</span>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-title">Không gian soạn bài</div>
          <a href="#dashboard" class="nav-item active">
            ${Icons.get('dashboard', 'icon')}
            <span class="nav-label">Tổng quan</span>
          </a>
          <a href="#projects" class="nav-item">
            ${Icons.get('folder', 'icon')}
            <span class="nav-label">Dự án của tôi</span>
          </a>
          <a href="#games" class="nav-item">
            ${Icons.get('gamepad', 'icon')}
            <span class="nav-label">Trò chơi</span>
          </a>
          <a href="#content" class="nav-item">
            ${Icons.get('book', 'icon')}
            <span class="nav-label">Thư viện câu hỏi</span>
          </a>
          <a href="#templates" class="nav-item">
            ${Icons.get('layout', 'icon')}
            <span class="nav-label">Mẫu hoạt động</span>
          </a>
          <a href="#themes" class="nav-item">
            ${Icons.get('palette', 'icon')}
            <span class="nav-label">Chủ đề</span>
          </a>

          <div class="nav-section-title" style="margin-top: 12px;">Hệ thống</div>
          <a href="#settings" class="nav-item">
            ${Icons.get('settings', 'icon')}
            <span class="nav-label">Cài đặt</span>
          </a>
          <a href="#help" class="nav-item">
            ${Icons.get('help', 'icon')}
            <span class="nav-label">Trợ giúp</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="nav-item" id="btn-toggle-sidebar" style="width: 100%;">
            ${Icons.get('chevronLeft', 'icon')}
            <span class="nav-label">Thu gọn</span>
          </button>
        </div>
      </aside>

      <!-- Main Shell Area -->
      <div class="app-main">
        
        <!-- Topbar (Section 6.3) -->
        <header class="app-topbar">
          <div class="topbar-left">
            <button class="btn btn-icon" id="btn-mobile-menu" style="display: none;">
              ${Icons.get('menu')}
            </button>
            <button class="topbar-search-btn" id="btn-topbar-search">
              ${Icons.get('search')}
              <span>Tìm kiếm dự án, câu hỏi...</span>
              <kbd>Ctrl+K</kbd>
            </button>
          </div>

          <div class="topbar-right">
            <button class="btn btn-icon" id="btn-theme-toggle" title="Đổi chế độ sáng / tối">
              ${Icons.get('moon')}
            </button>
            <a href="#help" class="btn btn-icon" title="Trợ giúp">
              ${Icons.get('help')}
            </a>
            <button class="btn btn-primary btn-sm" id="btn-topbar-new">
              ${Icons.get('plus')} Tạo trò chơi
            </button>
          </div>
        </header>

        <!-- Main Workspace Container -->
        <main class="view-container" id="view-container"></main>

      </div>
    `;

    // Initialize Command Palette
    CommandPalette.init();

    // Initialize Router
    const viewContainer = document.getElementById('view-container');
    Router.init(viewContainer);

    // Event Bindings
    this.bindEvents();

    // Check first-time onboarding
    OnboardingModal.checkAndShow(() => {
      Dialogs.showNewProjectModal(async (data) => {
        const { project } = await ProjectManager.createNewProject(data);
        Notifications.success('Đã tạo trò chơi thành công!');
        window.location.hash = `#editor?id=${project.id}`;
      });
    });
  },

  applyInitialTheme() {
    const settings = Storage.getSettings();
    if (settings.accent) {
      document.documentElement.setAttribute('data-accent', settings.accent);
    }
    if (settings.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (settings.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  },

  bindEvents() {
    const sidebar = document.getElementById('app-sidebar');
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    if (toggleSidebarBtn) {
      toggleSidebarBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        toggleSidebarBtn.querySelector('.nav-label').textContent = isCollapsed ? 'Mở rộng' : 'Thu gọn';
      };
    }

    const searchBtn = document.getElementById('btn-topbar-search');
    if (searchBtn) {
      searchBtn.onclick = () => CommandPalette.open();
    }

    const newBtn = document.getElementById('btn-topbar-new');
    if (newBtn) {
      newBtn.onclick = () => {
        Dialogs.showNewProjectModal(async (data) => {
          const { project } = await ProjectManager.createNewProject(data);
          Notifications.success('Đã tạo trò chơi mới!');
          window.location.hash = `#editor?id=${project.id}`;
        });
      };
    }

    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        const settings = Storage.getSettings();
        settings.theme = nextTheme;
        Storage.saveSettings(settings);
        themeToggleBtn.innerHTML = nextTheme === 'dark' ? Icons.get('sun') : Icons.get('moon');
        Notifications.info(nextTheme === 'dark' ? 'Đã chuyển sang giao diện Tối' : 'Đã chuyển sang giao diện Sáng');
      };
    }
  }
};
