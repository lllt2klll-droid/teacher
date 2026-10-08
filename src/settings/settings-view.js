/* ==========================================================================
   TeacherStudio Settings Center (Section 29)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { BackupEngine } from '../storage/backup.js';
import { Notifications } from '../ui/notifications.js';
import { Dialogs } from '../ui/dialogs.js';
import { Icons } from '../ui/icons.js';
import { i18n } from '../app/i18n.js';

export const SettingsView = {
  async render(container) {
    const settings = Storage.getSettings();
    const projects = await Storage.getProjects();
    const contents = await Storage.getContents();

    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Trung tâm Cài đặt</h1>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
          Tùy chỉnh giao diện, trải nghiệm soạn bài và quản lý dữ liệu an toàn trên thiết bị của bạn.
        </p>
      </div>

      <div style="max-width: 800px; display: flex; flex-direction: column; gap: 24px;">
        
        <!-- 1. Theme & Appearance -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">1. Giao diện & Hiển thị</h3>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Chế độ màu giao diện</div>
                <div class="text-xs text-secondary">Chọn giao diện Sáng, Tối hoặc tự động theo hệ thống máy</div>
              </div>
              <select class="select" id="set-theme-mode" style="width: 180px;">
                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Sáng (Light)</option>
                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Tối (Dark)</option>
                <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>Theo hệ thống</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Màu sắc chủ đạo (Accent Color)</div>
                <div class="text-xs text-secondary">Màu nhấn thanh lịch cho các nút bấm và trạng thái</div>
              </div>
              <select class="select" id="set-accent-color" style="width: 180px;">
                <option value="forest" ${settings.accent === 'forest' ? 'selected' : ''}>Xanh rừng (Forest)</option>
                <option value="blue" ${settings.accent === 'blue' ? 'selected' : ''}>Xanh dương (Blue)</option>
                <option value="terracotta" ${settings.accent === 'terracotta' ? 'selected' : ''}>Đất nung (Terracotta)</option>
                <option value="violet" ${settings.accent === 'violet' ? 'selected' : ''}>Tím thanh nhã (Violet)</option>
                <option value="amber" ${settings.accent === 'amber' ? 'selected' : ''}>Hổ phách (Amber)</option>
                <option value="slate" ${settings.accent === 'slate' ? 'selected' : ''}>Đá phiến (Slate)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 2. Editor & Sound -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">2. Trình soạn thảo & Âm thanh</h3>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Tự động lưu bài khi soạn (Autosave)</div>
                <div class="text-xs text-secondary">Tự động lưu từng thay đổi, ngăn ngừa mất dữ liệu bài giảng</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="set-autosave" ${settings.autosave !== false ? 'checked' : ''}>
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Bật âm thanh phản hồi</div>
                <div class="text-xs text-secondary">Hiệu ứng Web Audio API tự nhiên khi chơi trò chơi</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="set-sound" ${settings.soundEnabled !== false ? 'checked' : ''}>
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 3. Language -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">3. Ngôn ngữ hiển thị (Language)</h3>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Ngôn ngữ giao diện</div>
              <div class="text-xs text-secondary">Toàn bộ ứng dụng sử dụng ngôn ngữ sư phạm chuẩn mực</div>
            </div>
            <select class="select" id="set-language" style="width: 180px;">
              <option value="vi" ${settings.language === 'vi' ? 'selected' : ''}>Tiếng Việt (Mặc định)</option>
              <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>
        </div>

        <!-- 4. Data Storage & Backup -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">4. Quản lý Dữ liệu & Sao lưu (.tstudio)</h3>
          </div>

          <div style="background: var(--color-surface-subtle); padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
            <div class="flex items-center justify-between" style="font-size: 13px; margin-bottom: 6px;">
              <span>Số dự án đã lưu trên máy:</span>
              <strong>${projects.length} dự án</strong>
            </div>
            <div class="flex items-center justify-between" style="font-size: 13px;">
              <span>Bộ câu hỏi lưu trữ:</span>
              <strong>${contents.length} bộ</strong>
            </div>
          </div>

          <div class="flex gap-3" style="flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-export-backup">
              ${Icons.get('download')} Xuất file sao lưu (.tstudio)
            </button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              ${Icons.get('upload')} Nhập khôi phục sao lưu
              <input type="file" id="inp-import-backup" accept=".tstudio,.json" style="display: none;">
            </label>
            <button class="btn btn-danger-subtle" id="btn-reset-app" style="margin-left: auto;">
              Xóa sạch dữ liệu ứng dụng
            </button>
          </div>
        </div>

        <!-- 5. Keyboard Shortcuts -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">5. Danh mục Phím tắt thông dụng</h3>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
            <div class="flex items-center justify-between" style="padding: 8px 12px; background: var(--color-surface-subtle); border-radius: 6px;">
              <span>Mở bảng lệnh nhanh</span>
              <kbd style="padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px;">Ctrl + K</kbd>
            </div>
            <div class="flex items-center justify-between" style="padding: 8px 12px; background: var(--color-surface-subtle); border-radius: 6px;">
              <span>Hoàn tác thay đổi</span>
              <kbd style="padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px;">Ctrl + Z</kbd>
            </div>
            <div class="flex items-center justify-between" style="padding: 8px 12px; background: var(--color-surface-subtle); border-radius: 6px;">
              <span>Làm lại thao tác</span>
              <kbd style="padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px;">Ctrl + Shift + Z</kbd>
            </div>
            <div class="flex items-center justify-between" style="padding: 8px 12px; background: var(--color-surface-subtle); border-radius: 6px;">
              <span>Đóng hộp thoại</span>
              <kbd style="padding: 2px 6px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px;">Esc</kbd>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents(container, settings);
  },

  bindEvents(container, settings) {
    const selTheme = container.querySelector('#set-theme-mode');
    if (selTheme) {
      selTheme.onchange = (e) => {
        settings.theme = e.target.value;
        Storage.saveSettings(settings);
        this.applyTheme(settings.theme);
        Notifications.success('Đã cập nhật chế độ màu');
      };
    }

    const selAccent = container.querySelector('#set-accent-color');
    if (selAccent) {
      selAccent.onchange = (e) => {
        settings.accent = e.target.value;
        Storage.saveSettings(settings);
        document.documentElement.setAttribute('data-accent', settings.accent);
        Notifications.success('Đã cập nhật màu nhấn');
      };
    }

    const chkAuto = container.querySelector('#set-autosave');
    if (chkAuto) {
      chkAuto.onchange = (e) => {
        settings.autosave = e.target.checked;
        Storage.saveSettings(settings);
      };
    }

    const chkSound = container.querySelector('#set-sound');
    if (chkSound) {
      chkSound.onchange = (e) => {
        settings.soundEnabled = e.target.checked;
        Storage.saveSettings(settings);
      };
    }

    const selLang = container.querySelector('#set-language');
    if (selLang) {
      selLang.onchange = (e) => {
        settings.language = e.target.value;
        Storage.saveSettings(settings);
        i18n.setLanguage(settings.language);
        Notifications.success('Đã cập nhật ngôn ngữ hiển thị');
      };
    }

    // Backup & Restore
    const btnExportBackup = container.querySelector('#btn-export-backup');
    if (btnExportBackup) {
      btnExportBackup.onclick = async () => {
        await BackupEngine.exportBackup();
        Notifications.success('Đã tải xuống file sao lưu TeacherStudio thành công');
      };
    }

    const inpImportBackup = container.querySelector('#inp-import-backup');
    if (inpImportBackup) {
      inpImportBackup.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const val = await BackupEngine.validateBackupFile(evt.target.result);
          if (!val.valid) {
            Notifications.danger(val.error);
            return;
          }

          Dialogs.confirm({
            title: 'Khôi phục dữ liệu từ tệp sao lưu',
            message: `Tệp chứa ${val.summary.projectsCount} dự án và ${val.summary.contentsCount} bộ câu hỏi. Thầy/Cô có muốn gộp dữ liệu này vào ứng dụng không?`,
            confirmText: 'Khôi phục',
            onConfirm: async () => {
              await BackupEngine.restoreBackup(val.payload, 'merge');
              Notifications.success('Đã khôi phục dữ liệu thành công!');
              location.reload();
            }
          });
        };
        reader.readAsText(file);
      };
    }

    const btnResetApp = container.querySelector('#btn-reset-app');
    if (btnResetApp) {
      btnResetApp.onclick = () => {
        Dialogs.confirm({
          title: 'Xóa sạch dữ liệu',
          message: 'Thao tác này sẽ xóa toàn bộ dự án và đưa ứng dụng về trạng thái ban đầu. Hãy chắc chắn Thầy/Cô đã xuất bản sao lưu trước khi thực hiện!',
          isDanger: true,
          confirmText: 'Xác nhận xóa sạch',
          onConfirm: async () => {
            localStorage.clear();
            indexedDB.deleteDatabase('TeacherStudio_DB');
            Notifications.warning('Đã xóa dữ liệu. Đang tải lại ứng dụng...');
            setTimeout(() => location.reload(), 1000);
          }
        });
      };
    }
  },

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }
};
