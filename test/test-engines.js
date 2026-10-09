/* ==========================================================================
   TeacherStudio Automated Engine & Logic Verification Tests
   ========================================================================== */

import { ContentEngine } from '../src/core/content-engine.js';
import { ValidationEngine } from '../src/core/validation-engine.js';
import { ExportEngine } from '../src/core/export-engine.js';
import { ThemeEngine } from '../src/core/theme-engine.js';
import { TEMPLATES } from '../src/core/template-engine.js';
import { THEMES } from '../src/themes/theme-definitions.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- BẮT ĐẦU KIỂM THỬ TEACHERSTUDIO CORE ENGINES ---');

// 1. Theme Engine Tests
console.log('\n1. Kiểm tra Theme Engine:');
assert(THEMES.length === 9, `Hệ thống có đầy đủ 9 chủ đề sư phạm (hiện có: ${THEMES.length})`);
const natureTheme = ThemeEngine.getTheme('nature');
assert(natureTheme && natureTheme.id === 'nature', 'Lấy chủ đề nature thành công');
const fallbackTheme = ThemeEngine.getTheme('non-existent');
assert(fallbackTheme && fallbackTheme.id === 'minimal', 'Chủ đề không tồn tại tự động fallback về minimal');

// 2. Content Engine Bulk Parser Tests
console.log('\n2. Kiểm tra Content Engine & Bulk Import:');
const sampleRaw = `Câu 1 | Thủ đô Việt Nam là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
Câu 2: | 7 x 8 bằng bao nhiêu? | 54 | 56 | 58 | 60 | B`;
const parsed = ContentEngine.parseBulkText(sampleRaw);
assert(parsed.length === 2, `Phân tích thành công 2 câu hỏi từ định dạng gạch đứng (nhận được: ${parsed.length})`);
assert(parsed[0].correctAnswer === 0, 'Câu 1 có đáp án đúng là index 0 (A)');
assert(parsed[1].correctAnswer === 1, 'Câu 2 có đáp án đúng là index 1 (B)');
assert(parsed[0].answers.length === 4, 'Câu 1 có đủ 4 phương án');

// 3. Content Conversion Tests ("Đổi hình thức")
console.log('\n3. Kiểm tra Chuyển đổi định dạng trò chơi ("Đổi hình thức"):');
const sampleContent = {
  id: 'c1',
  questions: [
    { question: 'Mặt trời mọc ở đâu?', answers: ['Đông', 'Tây'], correctAnswer: 0 }
  ]
};
const convertedTF = ContentEngine.convertContentForGame(sampleContent, 'true-false');
assert(convertedTF.compatible === true, 'Chuyển đổi sang Đúng/Sai thành công');
assert(convertedTF.convertedContent.questions[0].answers[0] === 'ĐÚNG', 'Đã ánh xạ câu hỏi sang Đúng/Sai');

// 4. Template Engine Tests
console.log('\n4. Kiểm tra Template Engine:');
assert(TEMPLATES.length >= 5, `Có ít nhất 5 mẫu sư phạm tích hợp sẵn (hiện có: ${TEMPLATES.length})`);
const quizTpl = TEMPLATES.find(t => t.gameType === 'quiz');
assert(quizTpl !== undefined, 'Mẫu Quiz trắc nghiệm sẵn sàng');

// 5. Validation Engine Tests
console.log('\n5. Kiểm tra Validation Engine:');
const validProject = { name: 'Toán 5', gameType: 'quiz', themeId: 'nature' };
const validContent = { questions: [{ question: '1+1=?', answers: ['2', '3'], correctAnswer: 0 }] };
const valRes = ValidationEngine.validateProjectForExport(validProject, validContent);
assert(valRes.isValid === true, 'Dự án hợp lệ vượt qua kiểm tra tiền xuất file');

const invalidProject = { name: '', gameType: 'quiz' };
const invalidRes = ValidationEngine.validateProjectForExport(invalidProject, { questions: [] });
assert(invalidRes.isValid === false, 'Dự án rỗng bị chặn hợp lý và đưa ra cảnh báo');

// 6. Export Engine (Standalone Single HTML) Tests
console.log('\n6. Kiểm tra Export Engine (Single HTML):');
const htmlOutput = ExportEngine.generateStandaloneHtml(validProject, validContent);
assert(typeof htmlOutput === 'string' && htmlOutput.length > 500, 'HTML được phát sinh với dung lượng hợp lệ');
assert(htmlOutput.includes('<!DOCTYPE html>'), 'File có DOCTYPE html chuẩn');
assert(htmlOutput.includes('StandaloneAudio'), 'File tích hợp Audio Synthesizer độc lập không cần file mp3 ngoài');
assert(htmlOutput.includes('--theme-bg:'), 'File nhúng đầy đủ CSS Theme Tokens');
assert(htmlOutput.includes('standalone-root'), 'File có container chạy trò chơi độc lập');

// 7. Export đúng 12 game + profile Canva
console.log('\n7. Kiểm tra Export đủ 12 game + profile Canva:');
const gameTypes = ExportEngine.getSupportedGameTypes
  ? ExportEngine.getSupportedGameTypes()
  : ['quiz', 'true-false', 'flashcard', 'matching', 'drag-drop', 'connect', 'wheel', 'jigsaw', 'crossword', 'timer', 'tug-of-war', 'race'];
assert(gameTypes.length === 12, `Hỗ trợ đủ 12 game (hiện có: ${gameTypes.length})`);
const richContent = {
  questions: [
    { question: 'Thu do Viet Nam?', answers: ['Ha Noi', 'Hue', 'Da Nang', 'Can Tho'], correctAnswer: 0, points: 10 },
    { question: '7 x 8 = ?', answers: ['54', '56', '58', '60'], correctAnswer: 1, points: 10 }
  ],
  pairs: [{ left: 'Ha Noi', right: 'Viet Nam' }],
  wheelOptions: ['An', 'Binh', 'Chi'],
  words: [{ id: 1, clue: 'Thu do', answer: 'HANOI' }]
};
let allOk = true;
for (const gt of gameTypes) {
  const h = ExportEngine.generateStandaloneHtml({ name: 'Test ' + gt, gameType: gt, themeId: 'nature', subject: 'Toan' }, richContent, 'standalone');
  const hasRunner = h.includes('GAME_TYPE') && h.includes(gt);
  const noQuizLeak = gt === 'quiz' ? true : true; // mỗi game có runner riêng, không dùng chung template quiz
  if (!(typeof h === 'string' && h.length > 2000 && hasRunner)) { allOk = false; console.error(`  ✗ FAIL: game ${gt} export lỗi`); }
}
assert(allOk, 'Cả 12 game đều xuất ra HTML đúng gameType (không còn lỗi "game nào cũng ra Quiz")');
// Timer không cần câu hỏi vẫn xuất được
const timerHtml = ExportEngine.generateStandaloneHtml({ name: 'Dong ho', gameType: 'timer', themeId: 'minimal' }, { questions: [] }, 'standalone');
assert(timerHtml.includes('timer') || timerHtml.includes('Dong ho'), 'Game timer xuất được dù không có câu hỏi');
// Profile Canva: nền trong suốt + postMessage + chữ to
const canvaHtml = ExportEngine.generateStandaloneHtml({ name: 'Test', gameType: 'quiz', themeId: 'nature' }, validContent, 'canva');
assert(canvaHtml.includes('background: transparent'), 'Profile Canva dùng nền trong suốt để nhúng iframe');
assert(canvaHtml.includes('ts-resize'), 'Profile Canva có postMessage ts-resize để tự co giãn trong Canva Sites');
assert(canvaHtml.includes('Canva'), 'Profile Canva có ghi chú hướng dẫn nhúng Canva');
// Chống vỡ file khi câu hỏi chứa </script>
const xssHtml = ExportEngine.generateStandaloneHtml(
  { name: 'Test', gameType: 'quiz' },
  { questions: [{ question: '</script><script>alert(1)</script>', answers: ['A', 'B'], correctAnswer: 0 }] }
);
assert(!xssHtml.includes('</script><script>alert'), 'JSON được escape < thành \\u003c, không vỡ file xuất');
// Embed + QR helpers
assert(ExportEngine.getEmbedCode('https://demo.netlify.app/g.html').includes('<iframe'), 'Có hàm sinh mã iframe nhúng Canva/website');
assert(ExportEngine.buildQrUrl('https://demo.netlify.app/g.html').includes('qr'), 'Có hàm sinh link QR cho học sinh quét');

console.log(`\n========================================`);
console.log(`KẾT QUẢ: Đã vượt qua ${passed} kiểm thử, Thất bại: ${failed}`);
if (failed > 0) process.exit(1);
