/* ==========================================================================
   TeacherStudio Content Engine - Reusable Question & Content Management
   ========================================================================== */

import { Storage } from '../storage/storage.js';

export const ContentEngine = {
  createQuestion({
    id = null,
    type = 'single-choice',
    question = '',
    answers = ['', '', '', ''],
    correctAnswer = 0,
    explanation = '',
    image = '',
    points = 10,
    timeLimit = 30,
    metadata = {}
  } = {}) {
    return {
      id: id || 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type,
      question: question.trim(),
      answers: Array.isArray(answers) ? answers.map(a => String(a).trim()) : [],
      correctAnswer: typeof correctAnswer === 'number' ? correctAnswer : 0,
      explanation: (explanation || '').trim(),
      image: image || '',
      points: Number(points) || 10,
      timeLimit: Number(timeLimit) || 30,
      metadata
    };
  },

  // Tách 1 dòng thành các ô: ưu tiên TAB (paste bảng Word/Excel), rồi mới tới |
  splitCells(line) {
    if (line.includes('\t')) return line.split('\t').map(p => p.trim()).filter((p, i, arr) => p !== '' || i === 0);
    if (line.includes('|')) return line.split('|').map(p => p.trim());
    return [line.trim()];
  },

  // Bulk parser: pipe | tab | 1 cột (danh sách lớp cho Vòng quay)
  parseBulkText(rawText) {
    if (!rawText || !rawText.trim()) return [];
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions = [];

    lines.forEach((line, index) => {
      const hasSep = line.includes('|') || line.includes('\t');
      // Format 0: 1 cột duy nhất -> mục đơn (tên HS cho Vòng quay, từ vựng Flashcard)
      if (!hasSep) {
        const text = line.replace(/^câu\s*\d+\s*[:.-]\s*/i, '').replace(/^\d+\s*[).-]\s*/, '').trim();
        if (text) {
          questions.push(this.createQuestion({ question: text, answers: ['Đúng', 'Sai'], correctAnswer: 0 }));
        }
        return;
      }
      // Format 1: Pip/Tab-separated: "Câu hỏi | A | B | C | D | A/B/C/D hoặc số thứ tự"
      {
        const parts = this.splitCells(line);
        if (parts.length >= 3) {
          let questionText = parts[0];
          let answerOptions = [];

          // If parts[0] is just a label like "Câu 1" or "1" and there are at least 4 parts
          if (/^(câu\s*\d+|\d+|q\d+)[:.-]?$/i.test(parts[0]) && parts.length >= 4) {
            questionText = parts[1];
            answerOptions = parts.slice(2, parts.length - 1);
          } else {
            questionText = questionText.replace(/^câu\s*\d+\s*[:.-]\s*/i, '');
            answerOptions = parts.slice(1, parts.length - 1);
          }

          // Last part is typically correct answer
          const rawAns = parts[parts.length - 1].toUpperCase();
          
          let correctIdx = 0;
          if (['A', 'B', 'C', 'D', 'E', 'F'].includes(rawAns)) {
            correctIdx = rawAns.charCodeAt(0) - 65;
          } else if (!isNaN(parseInt(rawAns))) {
            correctIdx = Math.max(0, parseInt(rawAns) - 1);
          } else {
            // Find option matching rawAns exactly
            const found = answerOptions.findIndex(o => o.toLowerCase() === rawAns.toLowerCase());
            if (found >= 0) correctIdx = found;
          }

          if (correctIdx >= answerOptions.length) correctIdx = 0;

          questions.push(this.createQuestion({
            question: questionText,
            answers: answerOptions,
            correctAnswer: correctIdx
          }));
        }
      }
    });

    return questions;
  },

  // "Đổi hình thức" - Content Conversion Matrix
  convertContentForGame(content, targetGameType) {
    const questions = content?.questions || [];
    const result = {
      compatible: true,
      warnings: [],
      convertedContent: JSON.parse(JSON.stringify(content))
    };

    if (questions.length === 0) {
      result.compatible = false;
      result.warnings.push('Bộ câu hỏi hiện tại chưa có câu hỏi nào.');
      return result;
    }

    switch (targetGameType) {
      case 'true-false': {
        // Must convert multi-choice into True/False statements
        result.convertedContent.questions = questions.map(q => {
          const isSingle = q.answers && q.answers.length > 0;
          const correctText = isSingle ? q.answers[q.correctAnswer] : 'Đúng';
          return {
            ...q,
            type: 'true-false',
            question: `${q.question} (Khẳng định: ${correctText})`,
            answers: ['ĐÚNG', 'SAI'],
            correctAnswer: 0
          };
        });
        result.warnings.push('Các câu hỏi trắc nghiệm đã được chuyển thành mệnh đề Đúng/Sai.');
        break;
      }

      case 'flashcard': {
        // Map question to Front and correctAnswer to Back
        result.convertedContent.questions = questions.map(q => ({
          ...q,
          type: 'flashcard',
          front: q.question,
          back: q.answers && q.answers[q.correctAnswer] ? q.answers[q.correctAnswer] : ''
        }));
        break;
      }

      case 'matching': {
        // Map Question -> Correct Answer pairs
        result.convertedContent.pairs = questions.slice(0, 8).map(q => ({
          left: q.question,
          right: q.answers && q.answers[q.correctAnswer] ? q.answers[q.correctAnswer] : ''
        }));
        if (questions.length > 8) {
          result.warnings.push('Trò chơi Ghép đôi sẽ ưu tiên sử dụng 8 câu hỏi đầu tiên để đảm bảo bố cục trực quan.');
        }
        break;
      }

      case 'connect': {
        result.convertedContent.pairs = questions.slice(0, 4).map(q => ({
          left: q.question,
          right: q.answers && q.answers[q.correctAnswer] ? q.answers[q.correctAnswer] : ''
        }));
        if (questions.length > 4) {
          result.warnings.push('Trò chơi Nối ý dùng 4 cặp đầu tiên cho vừa khung nối.');
        }
        break;
      }

      case 'drag-drop': {
        // Quy uoc: phuong an = ten nhom. Can it nhat 2 nhom khac nhau.
        const groups = [];
        questions.forEach(q => {
          (q.answers || []).forEach(a => {
            const name = String(a || '').trim();
            if (name && groups.indexOf(name) < 0) groups.push(name);
          });
        });
        result.convertedContent.pairs = questions.slice(0, 8).map(q => ({
          left: q.question,
          right: q.answers && q.answers[q.correctAnswer] ? q.answers[q.correctAnswer] : ''
        }));
        if (groups.length < 2) {
          result.warnings.push('Kéo thả cần phương án là tên nhóm (VD: "Động vật" | "Thực vật", đáp án = nhóm đúng). Hãy sửa phương án thành tên nhóm.');
        } else if (groups.length > 4) {
          result.warnings.push('Kéo thả hỗ trợ tối đa 4 nhóm; các nhóm thừa sẽ bị gộp, nên dùng 2-3 nhóm.');
        } else {
          result.warnings.push('Kéo thả dùng 8 mục đầu, chia theo nhóm trong phương án.');
        }
        break;
      }

      case 'crossword': {
        // Tu khoa = dap an dung (tu bo dau khi cham)
        result.warnings.push('Ô chữ lấy đáp án đúng làm từ khóa (tự bỏ dấu khi chấm). Câu nào đáp án dài quá 12 ký tự sẽ bị bỏ qua.');
        break;
      }

      case 'wheel': {
        // Options for the wheel
        result.convertedContent.wheelOptions = questions.map(q => q.question);
        break;
      }

      case 'timer': {
        // Timer doesn't require questions, purely uses duration
        result.warnings.push('Đồng hồ đếm ngược là công cụ thời gian, nội dung câu hỏi sẽ được lưu trữ dự phòng.');
        break;
      }

      default:
        // Quiz, tug-of-war, race, jigsaw all use standard single-choice questions directly!
        break;
    }

    return result;
  },

  // Danh sách lớp / từ vựng 1 cột -> mảng câu hỏi đơn (cho Vòng quay, Flashcard)
  parseClassList(rawText) {
    if (!rawText || !rawText.trim()) return [];
    return rawText.split('\n').map(l => l.trim()).filter(Boolean)
      .map(name => this.createQuestion({ question: name.replace(/^\d+\s*[).-]\s*/, ''), answers: ['Đúng', 'Sai'], correctAnswer: 0 }))
      .filter(q => q.question);
  },

  // Ước tính dung lượng ảnh base64 trong bộ câu hỏi (byte)
  estimateMediaSize(content) {
    let bytes = 0;
    (content?.questions || []).forEach(q => {
      if (q.image && q.image.startsWith('data:')) bytes += Math.round(q.image.length * 0.75);
    });
    return bytes;
  },

  // Nén ảnh upload về JPEG/PNG dataURL gọn nhẹ để giữ Single-HTML offline
  compressImageFile(file, maxDim = 800, quality = 0.72) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) { reject(new Error('not-image')); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          let { width: w, height: h } = img;
          const scale = Math.min(1, maxDim / Math.max(w, h));
          w = Math.max(1, Math.round(w * scale)); h = Math.max(1, Math.round(h * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load-failed')); };
      img.src = url;
    });
  }
};
