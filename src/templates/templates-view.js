/* ==========================================================================
   TeacherStudio Templates Library View (Section 22)
   ========================================================================== */

import { TEMPLATES } from '../core/template-engine.js';
import { ProjectManager } from '../core/project-manager.js';
import { GameRegistry } from '../core/game-registry.js';
import { Notifications } from '../ui/notifications.js';

export const TemplatesView = {
  render(container) {
    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Mẫu hoạt động sư phạm</h1>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
          Các mẫu khởi động, khám phá, luyện tập và củng cố được thiết kế sẵn cho từng chặng của tiết học.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        ${TEMPLATES.map(tpl => `
          <div class="card flex flex-col justify-between" style="border: 1px solid var(--color-border); padding: 20px;">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 10px;">
                <span class="badge badge-primary">${tpl.phaseName}</span>
                <span class="text-xs text-secondary">${GameRegistry.get(tpl.gameType)?.name || tpl.gameType}</span>
              </div>
              <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">${tpl.name}</h3>
              <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px; line-height: 1.5;">
                ${tpl.description}
              </p>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 16px;">
                ✓ Đã tích hợp sẵn ${(tpl.sampleQuestions || []).length} câu hỏi mẫu
              </div>
            </div>

            <button class="btn btn-primary btn-use-template" data-id="${tpl.id}" style="width: 100%;">
              Dùng mẫu này →
            </button>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-use-template').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-id');
        const tpl = TEMPLATES.find(t => t.id === id);
        if (tpl) {
          const { project } = await ProjectManager.createNewProject({
            name: tpl.name,
            gameType: tpl.gameType,
            themeId: tpl.themeId,
            sampleQuestions: tpl.sampleQuestions
          });
          Notifications.success(`Đã khởi tạo dự án từ mẫu "${tpl.name}"!`);
          window.location.hash = `#editor?id=${project.id}`;
        }
      };
    });
  }
};
