/* ==========================================================================
   TeacherStudio Question Editor Component (Left Panel)
   ========================================================================== */

import { ContentEngine } from '../core/content-engine.js';
import { BulkImportModal } from '../content/bulk-import-modal.js';
import { Icons } from '../ui/icons.js';

export const QuestionEditor = {
  render(container, { content, onQuestionsChange }) {
    let questions = content.questions || [];
    let selectedQIndex = 0;

    const renderView = () => {
      container.innerHTML = `
        <div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
          <span class="font-semibold" style="font-size: 14px;">Câu hỏi (${questions.length})</span>
          <div class="flex gap-1">
            <button class="btn btn-secondary btn-sm" id="btn-add-q">${Icons.get('plus')} Thêm</button>
            <button class="btn btn-secondary btn-sm" id="btn-bulk-q">Nhập nhanh</button>
          </div>
        </div>

        <!-- Question selector badges -->
        <div style="padding: 8px 16px; border-bottom: 1px solid var(--color-border); display: flex; gap: 6px; overflow-x: auto; background: var(--color-surface-subtle);">
          ${questions.map((q, idx) => `
            <button class="badge q-tab-btn ${idx === selectedQIndex ? 'badge-primary' : ''}" data-idx="${idx}" style="cursor: pointer; padding: 4px 10px; font-weight: 600;">
              Câu ${idx + 1}
            </button>
          `).join('')}
        </div>

        <!-- Selected Question Form -->
        <div style="padding: 16px; overflow-y: auto; flex: 1;" id="q-form-container">
          ${questions.length === 0 ? `
            <div style="text-align: center; padding: 40px 10px; color: var(--color-text-secondary); font-size: 13px;">
              Chưa có câu hỏi nào. Bấm <strong>Thêm câu hỏi</strong> hoặc <strong>Nhập nhanh</strong> để bắt đầu.
            </div>
          ` : renderQuestionForm(questions[selectedQIndex], selectedQIndex)}
        </div>
      `;

      bindEvents();
    };

    const renderQuestionForm = (q, idx) => {
      if (!q) return '';
      const answers = q.answers || ['', '', '', ''];
      return `
        <div class="flex items-center justify-between" style="margin-bottom: 12px;">
          <span class="font-semibold" style="font-size: 14px;">Chi tiết Câu ${idx + 1}</span>
          <button class="btn btn-icon btn-del-q" data-idx="${idx}" title="Xóa câu này" style="color: var(--color-danger);">${Icons.get('trash')}</button>
        </div>

        <div class="form-group">
          <label class="form-label">Nội dung câu hỏi *</label>
          <textarea class="textarea q-field" data-field="question" style="min-height: 60px;">${q.question || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Các phương án lựa chọn</label>
          <div class="flex flex-col gap-2">
            ${['A', 'B', 'C', 'D'].map((letter, i) => `
              <div class="flex items-center gap-2">
                <span class="font-semibold" style="width: 20px; font-size: 13px; color: var(--color-primary);">${letter}.</span>
                <input type="text" class="input q-ans-field" data-ans-idx="${i}" value="${answers[i] || ''}" placeholder="Phương án ${letter}">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Đáp án đúng</label>
          <select class="select q-field" data-field="correctAnswer">
            ${['A', 'B', 'C', 'D'].map((letter, i) => `
              <option value="${i}" ${q.correctAnswer === i ? 'selected' : ''}>Phương án ${letter} là đáp án đúng</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Giải thích chi tiết (hiện sau khi học sinh trả lời)</label>
          <textarea class="textarea q-field" data-field="explanation" placeholder="Lý do vì sao đáp án này đúng...">${q.explanation || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Thời gian (giây)</label>
            <input type="number" class="input q-field" data-field="timeLimit" min="5" max="300" value="${q.timeLimit || 30}">
          </div>
          <div class="form-group">
            <label class="form-label">Điểm số</label>
            <input type="number" class="input q-field" data-field="points" min="1" max="100" value="${q.points || 10}">
          </div>
        </div>
      `;
    };

    const bindEvents = () => {
      // Add Q
      const addBtn = container.querySelector('#btn-add-q');
      if (addBtn) {
        addBtn.onclick = () => {
          const newQ = ContentEngine.createQuestion({
            question: `Câu hỏi ${questions.length + 1}: `,
            answers: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
            correctAnswer: 0
          });
          questions.push(newQ);
          selectedQIndex = questions.length - 1;
          renderView();
          onQuestionsChange(questions);
        };
      }

      // Bulk Q
      const bulkBtn = container.querySelector('#btn-bulk-q');
      if (bulkBtn) {
        bulkBtn.onclick = () => {
          BulkImportModal.show((newBatch) => {
            questions = [...questions, ...newBatch];
            selectedQIndex = questions.length - 1;
            renderView();
            onQuestionsChange(questions);
          });
        };
      }

      // Tab Q
      container.querySelectorAll('.q-tab-btn').forEach(btn => {
        btn.onclick = () => {
          selectedQIndex = parseInt(btn.getAttribute('data-idx'), 10);
          renderView();
        };
      });

      // Delete Q
      const delBtn = container.querySelector('.btn-del-q');
      if (delBtn) {
        delBtn.onclick = () => {
          const idx = parseInt(delBtn.getAttribute('data-idx'), 10);
          questions.splice(idx, 1);
          selectedQIndex = Math.max(0, selectedQIndex - 1);
          renderView();
          onQuestionsChange(questions);
        };
      }

      // Form input change bindings
      container.querySelectorAll('.q-field').forEach(input => {
        input.oninput = () => {
          const field = input.getAttribute('data-field');
          let val = input.value;
          if (field === 'correctAnswer' || field === 'timeLimit' || field === 'points') {
            val = parseInt(val, 10) || 0;
          }
          if (questions[selectedQIndex]) {
            questions[selectedQIndex][field] = val;
            onQuestionsChange(questions);
          }
        };
      });

      container.querySelectorAll('.q-ans-field').forEach(input => {
        input.oninput = () => {
          const ansIdx = parseInt(input.getAttribute('data-ans-idx'), 10);
          if (questions[selectedQIndex]) {
            if (!questions[selectedQIndex].answers) questions[selectedQIndex].answers = [];
            questions[selectedQIndex].answers[ansIdx] = input.value;
            onQuestionsChange(questions);
          }
        };
      });
    };

    renderView();
  }
};
