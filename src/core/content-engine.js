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
      explanation: explanation.trim(),
      points: Number(points) || 10,
      timeLimit: Number(timeLimit) || 30,
      metadata
    };
  },

  // Bulk parser for convenient teacher input
  parseBulkText(rawText) {
    if (!rawText || !rawText.trim()) return [];
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions = [];

    lines.forEach((line, index) => {
      // Format 1: Pip-separated: "Câu hỏi | A | B | C | D | A/B/C/D hoặc số thứ tự"
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
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
  }
};
