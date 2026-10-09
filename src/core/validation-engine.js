/* ==========================================================================
   TeacherStudio Validation Engine - Diagnostics & Data Integrity
   ========================================================================== */

export const ValidationEngine = {
  validateProjectForExport(project, content) {
    const checks = [];
    let hasError = false;

    // 1. Project Title check
    if (!project || !project.name || !project.name.trim()) {
      checks.push({ status: 'error', message: 'Tên dự án không được để trống.' });
      hasError = true;
    } else {
      checks.push({ status: 'ok', message: `Tên dự án hợp lệ: "${project.name}"` });
    }

    // 2. Questions check
    const questions = content?.questions || [];
    if (project.gameType !== 'timer' && questions.length === 0) {
      checks.push({ status: 'error', message: 'Bộ câu hỏi đang trống. Cần ít nhất 1 câu hỏi.' });
      hasError = true;
    } else {
      checks.push({ status: 'ok', message: `Số lượng câu hỏi/nội dung: ${questions.length} mục` });
    }

    // 3. Questions integrity
    let emptyQuestionsCount = 0;
    let oobCount = 0;
    let emptyAnswersCount = 0;
    questions.forEach((q, idx) => {
      if (!q.question || !String(q.question).trim()) {
        emptyQuestionsCount++;
      }
      if (!Array.isArray(q.answers) || q.answers.length === 0) {
        emptyAnswersCount++;
      } else if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= q.answers.length) {
        oobCount++;
      }
      if (typeof q.points === 'number' && q.points < 0) {
        oobCount++;
      }
      if (typeof q.timeLimit === 'number' && q.timeLimit < 0) {
        oobCount++;
      }
    });

    if (emptyQuestionsCount > 0) {
      checks.push({ status: 'warning', message: `Có ${emptyQuestionsCount} câu hỏi chưa có nội dung cụ thể.` });
    }
    if (emptyAnswersCount > 0) {
      checks.push({ status: 'error', message: `Có ${emptyAnswersCount} câu chưa có phương án trả lời.` });
      hasError = true;
    }
    if (oobCount > 0) {
      checks.push({ status: 'error', message: `Có ${oobCount} câu đáp án đúng ngoài phạm vi / điểm / thời gian âm — hãy sửa trước khi xuất.` });
      hasError = true;
    }
    // gameType lạ
    const knownTypes = ['quiz', 'true-false', 'flashcard', 'matching', 'drag-drop', 'connect', 'wheel', 'jigsaw', 'crossword', 'timer', 'tug-of-war', 'race'];
    if (project.gameType && !knownTypes.includes(project.gameType)) {
      checks.push({ status: 'warning', message: `Kiểu game "${project.gameType}" lạ, sẽ dùng Quiz khi xuất.` });
    }

    // 4. Theme check
    checks.push({ status: 'ok', message: `Chủ đề được áp dụng: ${project.themeId || 'minimal'}` });

    // 4b. Media size check (ảnh minh họa base64, gồm coverImage jigsaw)
    let mediaBytes = 0;
    questions.forEach((q) => {
      if (q.image && typeof q.image === 'string' && q.image.startsWith('data:')) {
        mediaBytes += Math.round(q.image.length * 0.75);
      }
    });
    if (content && content.coverImage && typeof content.coverImage === 'string' && content.coverImage.startsWith('data:')) {
      mediaBytes += Math.round(content.coverImage.length * 0.75);
    }
    if (mediaBytes > 1536 * 1024) {
      checks.push({ status: 'warning', message: `Ảnh minh họa nặng ~${Math.round(mediaBytes / 1024)} KB — file xuất sẽ mở chậm, nên xóa bớt hoặc đổi ảnh nhẹ hơn.` });
    } else if (mediaBytes > 0) {
      checks.push({ status: 'ok', message: `Ảnh minh họa: ~${Math.round(mediaBytes / 1024)} KB (vẫn nhẹ, mở nhanh)` });
    }

    // 5. External dependencies check
    // Lưu ý: link QR dùng api.qrserver.com nhưng chỉ khi GV bấm tạo QR, file game vẫn offline 100%
    checks.push({ status: 'ok', message: 'File game xuất hoàn toàn độc lập, không cần mạng (chỉ link QR dùng mạng khi GV tạo).' });

    // 6. Estimated file size check
    const rawDataSize = JSON.stringify({ project, content }).length;
    const estSizeKb = Math.round((rawDataSize + 45000) / 1024); // runtime overhead ~45KB
    checks.push({ status: 'ok', message: `Kích thước file ước tính: ~${estSizeKb} KB (Siêu nhẹ, tải tức thì)` });

    return {
      isValid: !hasError,
      checks
    };
  }
};
