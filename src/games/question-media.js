/* ==========================================================================
   TeacherStudio Question Media Helper - Ảnh minh họa dùng chung cho các game
   ========================================================================== */

export function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Khung ảnh minh họa câu hỏi (tự ẩn khi không có ảnh)
export function questionImageHtml(q, maxHeight = 180) {
  if (!q || !q.image) return '';
  return `<div style="margin: 0 auto 16px; text-align: center;">
    <img src="${q.image}" alt="Minh họa câu hỏi"
      style="max-width: 100%; max-height: ${maxHeight}px; border-radius: 12px; border: 2px solid var(--theme-border); object-fit: contain; background: #fff;" />
  </div>`;
}

// Dòng câu hỏi + nút Đọc to (tôn trọng cài đặt readAloud)
export function questionTextRow(q, fontSize = 20, readAloud = true) {
  const text = escHtml(q.question);
  const speakBtn = readAloud
    ? `<button class="btn btn-secondary btn-sm btn-speak" data-speak="${escHtml(q.question)}" title="Đọc to câu hỏi" style="flex-shrink:0;">🔊 Đọc</button>`
    : '';
  return `<div style="display: flex; align-items: flex-start; justify-content: center; gap: 10px; margin-bottom: 20px;">
    <div class="game-q-text" style="font-size: ${fontSize}px; margin-bottom: 0; flex: 1;">${text}</div>
    ${speakBtn}
  </div>`;
}

// Huy hiệu "Đáp án: X" cho Chế độ giáo viên (xem trước + xuất file)
export function teacherBadgeHtml(q, teacherMode) {
  if (!teacherMode || !q || !Array.isArray(q.answers)) return '';
  const letter = String.fromCharCode(65 + (q.correctAnswer || 0));
  return `<div style="margin-bottom: 12px;"><span class="badge" style="background: #FEF3C7; color: #92400E; border: 1px dashed #D97706;">👩‍🏫 Đáp án GV: ${letter}${q.explanation ? ' — ' + escHtml(q.explanation) : ''}</span></div>`;
}
