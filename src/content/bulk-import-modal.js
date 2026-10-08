/* ==========================================================================
   TeacherStudio Bulk Import Modal (Section 10.6)
   ========================================================================== */

import { ContentEngine } from '../core/content-engine.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';

export const BulkImportModal = {
  show(onImportSuccess) {
    const defaultSample = `Thủ đô Việt Nam là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
7 x 8 bằng bao nhiêu? | 54 | 56 | 58 | 60 | B
Con vật nào đẻ trứng? | Chó | Mèo | Gà | Bò | C
Hình nào có 4 cạnh bằng nhau và 4 góc vuông? | Hình vuông | Hình chữ nhật | Hình thoi | Hình bình hành | A`;

    const contentHtml = `
      <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 12px;">
        Dán danh sách câu hỏi theo định dạng: <br>
        <code>Câu hỏi | Phương án A | Phương án B | Phương án C | Phương án D | Đáp án đúng (A/B/C/D)</code>
      </div>

      <textarea class="textarea" id="bulk-import-textarea" style="height: 180px; font-family: monospace; font-size: 13px; line-height: 1.5;" placeholder="Dán nội dung tại đây...">${defaultSample}</textarea>

      <!-- Live parse preview -->
      <div style="margin-top: 14px; padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border: 1px solid var(--color-border);">
        <div class="flex items-center justify-between" style="font-size: 13px;">
          <span class="font-semibold">Kết quả nhận diện:</span>
          <span class="badge badge-primary" id="bulk-parse-count">0 câu hỏi</span>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn btn-primary btn-do-import">Nhập vào danh sách</button>
    `;

    const modal = Dialogs.createModal({
      title: 'Nhập câu hỏi hàng loạt',
      contentHtml,
      footerHtml,
      maxWidth: '640px'
    });

    const textarea = modal.content.querySelector('#bulk-import-textarea');
    const countBadge = modal.content.querySelector('#bulk-parse-count');
    const importBtn = modal.content.querySelector('.btn-do-import');

    const updatePreview = () => {
      const parsed = ContentEngine.parseBulkText(textarea.value);
      if (countBadge) {
        countBadge.textContent = `${parsed.length} câu hỏi hợp lệ`;
      }
      return parsed;
    };

    updatePreview();
    textarea.oninput = updatePreview;

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();

    importBtn.onclick = () => {
      const questions = updatePreview();
      if (questions.length === 0) {
        Notifications.warning('Chưa nhận diện được câu hỏi nào từ nội dung dán vào.');
        return;
      }
      modal.close();
      if (onImportSuccess) {
        onImportSuccess(questions);
      }
      Notifications.success(`Đã thêm thành công ${questions.length} câu hỏi!`);
    };

    return modal;
  }
};
