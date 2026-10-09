/* ==========================================================================
   TeacherStudio Bulk Import Modal - Nhập nhanh từ Word/Excel/CSV/Danh sách lớp
   ========================================================================== */

import { ContentEngine } from '../core/content-engine.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';

const SAMPLE_QUIZ = `Thủ đô Việt Nam là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
7 x 8 bằng bao nhiêu? | 54 | 56 | 58 | 60 | B
Con vật nào đẻ trứng? | Chó | Mèo | Gà | Bò | C`;

const SAMPLE_CLASS = `Nguyễn Văn An
Trần Thị Bình
Lê Hoàng Cúc
Phạm Minh Đức`;

export const BulkImportModal = {
  show(onImportSuccess) {
    const contentHtml = `
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button class="btn btn-sm tab-btn active" data-tab="quiz">📝 Câu hỏi trắc nghiệm</button>
        <button class="btn btn-sm tab-btn" data-tab="class">👩‍🏫 Danh sách lớp (Vòng quay)</button>
      </div>

      <div id="tab-quiz">
        <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px; line-height: 1.6;">
          <strong>Cách 1 — Copy bảng từ Word/Excel:</strong> bôi đen bảng 6 cột trong Word/Excel → Copy → dán vào đây
          (các ô cách nhau bằng TAB, máy tự nhận diện).<br>
          <strong>Cách 2 — Gõ tay:</strong> <code>Câu hỏi | A | B | C | D | Đáp án (A/B/C/D)</code><br>
          <strong>Cách 3 — File CSV/TXT:</strong> <button class="btn btn-secondary btn-sm" id="btn-pick-file">📂 Chọn file .csv/.txt</button>
          <button class="btn btn-secondary btn-sm" id="btn-sample-csv">⬇ File mẫu</button>
          <input type="file" id="inp-csv-file" accept=".csv,.txt" style="display: none;">
        </div>
        <textarea class="textarea" id="bulk-import-textarea" style="height: 170px; font-family: monospace; font-size: 13px; line-height: 1.5;" placeholder="Dán nội dung tại đây...">${SAMPLE_QUIZ}</textarea>
      </div>

      <div id="tab-class" style="display: none;">
        <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px;">
          Mỗi dòng 1 tên học sinh (copy cột tên từ Excel/Sổ điểm). Dùng cho <strong>Vòng quay may mắn</strong> gọi tên.
        </div>
        <textarea class="textarea" id="bulk-class-textarea" style="height: 170px; font-size: 14px; line-height: 1.6;" placeholder="Mỗi dòng 1 tên...">${SAMPLE_CLASS}</textarea>
      </div>

      <div style="margin-top: 14px; padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border: 1px solid var(--color-border);">
        <div class="flex items-center justify-between" style="font-size: 13px;">
          <span class="font-semibold">Kết quả nhận diện:</span>
          <span class="badge badge-primary" id="bulk-parse-count">0 mục</span>
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

    let activeTab = 'quiz';
    const qArea = modal.content.querySelector('#bulk-import-textarea');
    const cArea = modal.content.querySelector('#bulk-class-textarea');
    const countBadge = modal.content.querySelector('#bulk-parse-count');
    const importBtn = modal.content.querySelector('.btn-do-import');

    const parseActive = () => {
      if (activeTab === 'class') return ContentEngine.parseClassList(cArea.value);
      return ContentEngine.parseBulkText(qArea.value);
    };

    const updatePreview = () => {
      const parsed = parseActive();
      if (countBadge) countBadge.textContent = `${parsed.length} mục hợp lệ`;
      return parsed;
    };

    modal.content.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        modal.content.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        modal.content.querySelector('#tab-quiz').style.display = activeTab === 'quiz' ? 'block' : 'none';
        modal.content.querySelector('#tab-class').style.display = activeTab === 'class' ? 'block' : 'none';
        updatePreview();
      };
    });

    qArea.oninput = updatePreview;
    cArea.oninput = updatePreview;
    updatePreview();

    // File CSV/TXT
    const pickBtn = modal.content.querySelector('#btn-pick-file');
    const fileInp = modal.content.querySelector('#inp-csv-file');
    if (pickBtn && fileInp) {
      pickBtn.onclick = () => fileInp.click();
      fileInp.onchange = () => {
        const f = fileInp.files && fileInp.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          let text = String(e.target.result || '');
          // CSV dùng dấu ; hoặc , -> đổi thành |
          const firstLine = (text.split('\n')[0] || '');
          if (!firstLine.includes('|') && !firstLine.includes('\t')) {
            const delim = firstLine.includes(';') ? ';' : ',';
            text = text.split('\n').map(l => l.split(delim).map(c => c.trim().replace(/^"|"$/g, '')).join(' | ')).join('\n');
          }
          qArea.value = text;
          updatePreview();
          Notifications.success('Đã đọc file, cô kiểm tra lại rồi bấm Nhập nhé.');
        };
        reader.readAsText(f, 'UTF-8');
      };
    }

    // Tải file mẫu CSV
    const sampleBtn = modal.content.querySelector('#btn-sample-csv');
    if (sampleBtn) {
      sampleBtn.onclick = () => {
        const csv = 'Cau hoi;Phuong an A;Phuong an B;Phuong an C;Phuong an D;Dap an\n'
          + SAMPLE_QUIZ.replaceAll(' | ', ';');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'mau-cau-hoi-teacherstudio.csv';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      };
    }

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();

    importBtn.onclick = () => {
      const questions = updatePreview();
      if (questions.length === 0) {
        Notifications.warning('Chưa nhận diện được mục nào từ nội dung dán vào.');
        return;
      }
      modal.close();
      if (onImportSuccess) onImportSuccess(questions);
      Notifications.success(`Đã thêm thành công ${questions.length} mục!`);
    };

    return modal;
  }
};
