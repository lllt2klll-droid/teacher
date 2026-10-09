/* ==========================================================================
   TeacherStudio Editor Workspace (Section 23)
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { ProjectManager } from '../core/project-manager.js';
import { GameRegistry } from '../core/game-registry.js';
import { HistoryManager } from '../core/history.js';
import { QuestionEditor } from './question-editor.js';
import { GameSettingsPanel } from './game-settings-panel.js';
import { ValidationEngine } from '../core/validation-engine.js';
import { ExportEngine } from '../core/export-engine.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';
import { Icons } from '../ui/icons.js';

export const EditorView = {
  async render(container, projectId) {
    let project = await Storage.getProject(projectId);
    if (!project) {
      container.innerHTML = `
        <div class="empty-state" style="margin: 40px auto; max-width: 480px;">
          <h3 class="empty-state-title">Không tìm thấy dự án</h3>
          <p class="empty-state-desc">Dự án này có thể đã bị xóa hoặc không tồn tại.</p>
          <button class="btn btn-primary" onclick="location.hash='#projects'">Quay lại danh sách dự án</button>
        </div>
      `;
      return;
    }

    let content = await Storage.getContent(project.contentId);
    if (!content) {
      content = { id: project.contentId, questions: [] };
    }

    const history = new HistoryManager();
    history.push({ project, content });

    let activeGameInstance = null;
    let autosaveTimer = null;

    container.innerHTML = `
      <div class="editor-layout flex-col">
        
        <!-- Top Toolbar -->
        <div class="editor-toolbar">
          <div class="flex items-center gap-3">
            <button class="btn btn-secondary btn-sm" id="btn-editor-back">
              ${Icons.get('chevronLeft')} Quay lại
            </button>
            <input type="text" class="input font-semibold" id="inp-editor-proj-name" value="${project.name}" style="font-size: 15px; border: 1px solid transparent; background: transparent; padding: 4px 8px; max-width: 280px;" title="Nhấp để đổi tên dự án">
            <span class="badge badge-primary">${GameRegistry.get(project.gameType)?.name || project.gameType}</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Undo / Redo -->
            <button class="btn btn-icon btn-sm" id="btn-editor-undo" title="Hoàn tác (Ctrl+Z)" disabled>${Icons.get('undo')}</button>
            <button class="btn btn-icon btn-sm" id="btn-editor-redo" title="Làm lại (Ctrl+Shift+Z)" disabled>${Icons.get('redo')}</button>
            
            <div style="width: 1px; height: 20px; background: var(--color-border); margin: 0 4px;"></div>

            <!-- Change game type -->
            <button class="btn btn-secondary btn-sm" id="btn-editor-convert">
              ${Icons.get('refresh')} Đổi hình thức
            </button>

            <!-- Autosave status -->
            <span class="text-xs text-muted" id="editor-save-status" style="margin: 0 8px;">Đã lưu</span>

            <!-- Export Single HTML -->
            <button class="btn btn-primary btn-sm" id="btn-editor-export">
              ${Icons.get('download')} Xuất file HTML
            </button>
          </div>
        </div>

        <!-- Mobile panel tabs (chỉ hiện ≤860px, xem responsive.css) -->
        <div class="editor-mobile-tabs" style="gap: 8px; padding: 8px 12px; background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
          <button class="btn btn-subtle btn-sm m-tab" data-panel="left">📝 Nội dung</button>
          <button class="btn btn-subtle btn-sm m-tab active" data-panel="center">👁️ Xem trước</button>
          <button class="btn btn-subtle btn-sm m-tab" data-panel="right">🎨 Thiết kế</button>
        </div>

        <!-- 3-Column Workspace -->
        <div class="editor-workspace">
          
          <!-- Left: Questions / Content -->
          <div class="editor-left-panel" id="editor-left-container"></div>

          <!-- Center: Interactive Live Preview -->
          <div class="editor-center-panel" id="editor-center-container">
            <!-- Viewport bar -->
            <div style="position: absolute; top: 12px; display: flex; gap: 8px; z-index: 20; background: var(--color-surface); padding: 4px 8px; border-radius: 8px; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <button class="btn btn-subtle btn-sm preview-device-btn active" data-mode="16-9">Màn hình rộng (16:9)</button>
              <button class="btn btn-subtle btn-sm preview-device-btn" data-mode="4-3">Máy tính bảng (4:3)</button>
              <button class="btn btn-subtle btn-sm preview-device-btn" data-mode="mobile">Điện thoại</button>
              <button class="btn btn-icon btn-sm" id="btn-restart-preview" title="Chơi lại từ đầu">${Icons.get('refresh')}</button>
            </div>

            <!-- Preview Target Container -->
            <div id="editor-preview-target" style="width: 100%; height: 100%; max-width: 860px; max-height: 484px; display: flex; align-items: center; justify-content: center; margin-top: 24px;"></div>
          </div>

          <!-- Right: Themes & Settings -->
          <div class="editor-right-panel" id="editor-right-container"></div>

        </div>

      </div>
    `;

    // Trigger save to storage
    const triggerSave = () => {
      const statusEl = container.querySelector('#editor-save-status');
      if (statusEl) statusEl.textContent = 'Đang lưu...';

      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(async () => {
        await Storage.saveProject(project);
        await Storage.saveContent(content);
        if (statusEl) {
          const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          statusEl.textContent = `Đã lưu lúc ${now}`;
        }
      }, 600);
    };

    // Update history state
    const recordHistory = () => {
      history.push({ project, content });
      updateHistoryButtons();
      triggerSave();
      mountLivePreview();
    };

    const updateHistoryButtons = () => {
      const undoBtn = container.querySelector('#btn-editor-undo');
      const redoBtn = container.querySelector('#btn-editor-redo');
      if (undoBtn) undoBtn.disabled = !history.canUndo();
      if (redoBtn) redoBtn.disabled = !history.canRedo();
    };

    // Mount Live Game in Center Panel
    const mountLivePreview = () => {
      const previewRoot = container.querySelector('#editor-preview-target');
      if (!previewRoot) return;

      if (activeGameInstance) {
        activeGameInstance.destroy();
        activeGameInstance = null;
      }

      try {
        activeGameInstance = GameRegistry.createInstance(project.gameType, previewRoot, project, content);
        activeGameInstance.mount();
      } catch (e) {
        console.error('Error mounting live game:', e);
        previewRoot.innerHTML = `<div class="empty-state">Không thể tải xem trước trò chơi: ${e.message}</div>`;
      }
    };

    // Render Sub-panels
    const renderSubPanels = () => {
      const leftContainer = container.querySelector('#editor-left-container');
      const rightContainer = container.querySelector('#editor-right-container');

      QuestionEditor.render(leftContainer, {
        content,
        onQuestionsChange: (newQuestions) => {
          content.questions = newQuestions;
          recordHistory();
        }
      });

      GameSettingsPanel.render(rightContainer, {
        project,
        onProjectChange: (updatedProject) => {
          project = updatedProject;
          recordHistory();
        }
      });
    };

    renderSubPanels();
    mountLivePreview();

    // Mobile tabs: Nội dung / Xem trước / Thiết kế
    const setMobilePanel = (which) => {
      const left = container.querySelector('.editor-left-panel');
      const center = container.querySelector('.editor-center-panel');
      const right = container.querySelector('.editor-right-panel');
      [left, center, right].forEach(p => p && p.classList.remove('m-active'));
      if (which === 'left' && left) left.classList.add('m-active');
      if (which === 'center' && center) center.classList.add('m-active');
      if (which === 'right' && right) right.classList.add('m-active');
      container.querySelectorAll('.m-tab').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-panel') === which);
      });
    };
    // Mặc định mở Xem trước trên màn hình nhỏ
    if (window.innerWidth <= 860) setMobilePanel('center');
    container.querySelectorAll('.m-tab').forEach(btn => {
      btn.onclick = () => setMobilePanel(btn.getAttribute('data-panel'));
    });

    // Bind Toolbar Actions
    const backBtn = container.querySelector('#btn-editor-back');
    if (backBtn) backBtn.onclick = () => window.location.hash = '#projects';

    const nameInp = container.querySelector('#inp-editor-proj-name');
    if (nameInp) {
      nameInp.oninput = (e) => {
        project.name = e.target.value.trim() || 'Trò chơi không tên';
        triggerSave();
      };
      nameInp.onfocus = () => nameInp.style.border = '1px solid var(--color-border)';
      nameInp.onblur = () => nameInp.style.border = '1px solid transparent';
    }

    const undoBtn = container.querySelector('#btn-editor-undo');
    if (undoBtn) {
      undoBtn.onclick = () => {
        const state = history.undo();
        if (state) {
          project = state.project;
          content = state.content;
          renderSubPanels();
          mountLivePreview();
          updateHistoryButtons();
          triggerSave();
        }
      };
    }

    const redoBtn = container.querySelector('#btn-editor-redo');
    if (redoBtn) {
      redoBtn.onclick = () => {
        const state = history.redo();
        if (state) {
          project = state.project;
          content = state.content;
          renderSubPanels();
          mountLivePreview();
          updateHistoryButtons();
          triggerSave();
        }
      };
    }

    const convertBtn = container.querySelector('#btn-editor-convert');
    if (convertBtn) {
      convertBtn.onclick = () => {
        Dialogs.showChangeGameModal(project.gameType, async (newGameType) => {
          const { project: convProject, warnings } = await ProjectManager.convertProjectGameType(project, newGameType);
          project = convProject;
          if (warnings && warnings.length > 0) {
            Notifications.warning(warnings[0]);
          } else {
            Notifications.success(`Đã đổi thành trò chơi ${GameRegistry.get(newGameType)?.name}`);
          }
          renderSubPanels();
          mountLivePreview();
          container.querySelector('.badge-primary').textContent = GameRegistry.get(project.gameType)?.name;
        });
      };
    }

    const exportBtn = container.querySelector('#btn-editor-export');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const validation = ValidationEngine.validateProjectForExport(project, content);
        Dialogs.showDiagnosticsModal(validation, (profile) => {
          const result = ExportEngine.downloadStandaloneHtml(project, content, profile || 'standalone');
          Notifications.success(`Đã xuất file HTML "${result.filename}" thành công!`);
          Dialogs.showExportSuccessModal({
            filename: result.filename,
            profile: result.profile,
            gameType: project.gameType
          });
        }, project);
      };
    }

    const restartPreviewBtn = container.querySelector('#btn-restart-preview');
    if (restartPreviewBtn) {
      restartPreviewBtn.onclick = () => mountLivePreview();
    }

    // Viewport preview device switchers
    const deviceBtns = container.querySelectorAll('.preview-device-btn');
    deviceBtns.forEach(btn => {
      btn.onclick = () => {
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        const target = container.querySelector('#editor-preview-target');
        if (target) {
          if (mode === 'mobile') {
            target.style.maxWidth = '360px';
            target.style.maxHeight = '640px';
          } else if (mode === '4-3') {
            target.style.maxWidth = '680px';
            target.style.maxHeight = '510px';
          } else {
            target.style.maxWidth = '860px';
            target.style.maxHeight = '484px';
          }
        }
      };
    });
  }
};
