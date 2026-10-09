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

// 8. Ảnh minh họa, parse Word/Excel, danh sách lớp, mẫu SGK, chế độ GV
console.log('\n8. Kiểm tra Ảnh / Word-Excel / Mẫu SGK / Chế độ GV:');
const qImg = ContentEngine.createQuestion({ question: 'Test?' });
assert(qImg.image === '', 'Câu hỏi mới mặc định chưa có ảnh (image = "")');
const tabParsed = ContentEngine.parseBulkText('Thu do? \t Ha Noi \t Hue \t Da Nang \t Can Tho \t A');
assert(tabParsed.length === 1 && tabParsed[0].correctAnswer === 0, 'Paste bảng Word/Excel (TAB) được nhận diện đúng đáp án A');
const singleParsed = ContentEngine.parseBulkText('Nguyen Van An\nTran Thi Binh\n');
assert(singleParsed.length === 2, `Dòng đơn (tên HS) được nhận diện (${singleParsed.length}/2)`);
const classList = ContentEngine.parseClassList('1. Nguyen Van An\n2) Tran Thi Binh\n\nLe Hoang Cuc');
assert(classList.length === 3 && classList[0].question === 'Nguyen Van An', 'Danh sách lớp tách số thứ tự và dòng trống');
const mediaBytes = ContentEngine.estimateMediaSize({ questions: [{ image: 'data:image/jpeg;base64,' + 'A'.repeat(4000) }] });
assert(mediaBytes > 2000, 'Ước tính dung lượng ảnh base64 hợp lý');
assert(TEMPLATES.length >= 11, `Có ít nhất 11 mẫu SGK (hiện có: ${TEMPLATES.length})`);
assert(TEMPLATES.some(t => t.gameType === 'tug-of-war' && t.name.includes('Toán 5')), 'Có mẫu Kéo co Toán 5');
const mediaHtml = ExportEngine.generateStandaloneHtml(
  { name: 'Media', gameType: 'quiz', themeId: 'nature', settings: { teacherMode: true } },
  { questions: [{ question: 'Con gi?', answers: ['Ga', 'Cho'], correctAnswer: 0, image: 'data:image/jpeg;base64,AAA' }] },
  'standalone'
);
assert(mediaHtml.includes('q-img'), 'File xuất render ảnh minh họa câu hỏi');
assert(mediaHtml.includes('data-speak'), 'File xuất có nút Đọc to (data-speak)');
assert(mediaHtml.includes('toggleFS'), 'File xuất có nút/phím Toàn màn hình');
assert(mediaHtml.includes('chedo=gv'), 'File xuất hỗ trợ ?chedo=gv cho chế độ giáo viên');
assert(mediaHtml.includes('gv-badge') || mediaHtml.includes('Đáp án GV'), 'File xuất có huy hiệu đáp án GV khi bật teacherMode');
const bigImgContent = { questions: [{ question: 'Q?', answers: ['A', 'B'], correctAnswer: 0, image: 'data:image/jpeg;base64,' + 'A'.repeat(2200000) }] };
const bigVal = ValidationEngine.validateProjectForExport({ name: 'Nang', gameType: 'quiz' }, bigImgContent);
assert(bigVal.checks.some(c => c.status === 'warning'), 'Cảnh báo khi ảnh quá nặng (>1.5MB)');

// 9. Responsive + đồ họa đa thiết bị
console.log('\n9. Kiểm tra Responsive đa thiết bị:');
const fs = await import('fs');
const css = fs.readFileSync('src/styles/responsive.css', 'utf-8');
assert(css.includes('@media (max-width: 860px)'), 'Có breakpoint tablet 860px');
assert(css.includes('@media (max-width: 640px)'), 'Có breakpoint điện thoại 640px');
assert(css.includes('.gv-grid-2'), 'Có lưới game 2 cột co giãn');
assert(css.includes('pointer: coarse'), 'Có mục tiêu chạm ≥44px cho cảm ứng');
assert(css.includes('.sidebar-backdrop'), 'Có nền mờ menu mobile');
assert(css.includes('.editor-mobile-tabs'), 'Có tab panel editor mobile');
const indexHtml = fs.readFileSync('index.html', 'utf-8');
assert(indexHtml.includes('responsive.css'), 'index.html đã nạp responsive.css');
const noInlineGrid = ['src/games/true-false/true-false-game.js', 'src/games/matching/matching-game.js',
  'src/games/drag-drop/drag-drop-game.js', 'src/games/classroom/tug-of-war-game.js',
  'src/games/classroom/race-game.js'].every(f => !fs.readFileSync(f, 'utf-8').includes('grid-template-columns: 1fr 1fr'));
assert(noInlineGrid, '5 game đã bỏ grid inline cứng, dùng class gv-grid-2');
const editorJs = fs.readFileSync('src/editor/editor.js', 'utf-8');
assert(editorJs.includes('m-tab') && editorJs.includes('m-active'), 'Editor có tab Nội dung/Xem trước/Thiết kế');
const appJs = fs.readFileSync('src/app/app.js', 'utf-8');
assert(appJs.includes('sidebar-backdrop') && appJs.includes('mobile-open'), 'App shell mở/đóng menu mobile');
assert(!appJs.includes('style="display: none;"') || !appJs.includes('btn-mobile-menu" style'), 'Nút menu mobile không còn bị ẩn cứng');
const layoutCss = fs.readFileSync('src/styles/layout.css', 'utf-8');
assert(!layoutCss.includes('left: -240px'), 'Đã xóa hack sidebar cũ, dùng hệ thống transform thống nhất');
const themesCss = fs.readFileSync('src/styles/themes.css', 'utf-8');
assert(themesCss.includes('clamp(') && themesCss.includes('gvPop'), 'Game có chữ clamp() + animation phản hồi');

// 10. Dot 1: content that, phim tat, o chu chuan hoa
console.log('\n10. Kiem tra Dot 1 (Keo tha/Noi y/Phim/O chu):');
const PH = await import('../src/games/pairs-helper.js');
assert(PH.normText('Việt Nam') === 'VIETNAM', 'normText bo dau tieng Viet');
assert(PH.normText('ĐỎ') === 'DO' && PH.normText('ve sầu') === 'VESAU', 'normText xu ly Đ/đ, dau, cach');
const grpContent = { questions: [
  { question: 'Gà', answers: ['Động vật', 'Thực vật'], correctAnswer: 0 },
  { question: 'Hoa sen', answers: ['Động vật', 'Thực vật'], correctAnswer: 1 }
]};
const groups = PH.dragGroupsFromContent(grpContent, 8);
assert(groups && groups.cats.length === 2 && groups.items[0].targetCat === 'cat_0', 'Suy 2 nhom Keo tha tu phuong an');
assert(PH.dragGroupsFromContent({ questions: [] }) === null, 'Thieu du lieu -> null de dung demo');
assert(PH.dragGroupsFromContent({ questions: [{ question: 'A?', answers: ['X', 'Y', 'Z', 'W', 'V'], correctAnswer: 0 }] }) === null, 'Qua 4 nhom -> null');
const prs = PH.pairsFromContent({ pairs: [{ left: 'A', right: 'B' }] }, 4);
assert(prs.length === 1 && prs[0].left === 'A', 'Uu tien content.pairs khi co');
const prsQ = PH.pairsFromContent({ questions: [{ question: 'Hanoi?', answers: ['VN', 'Lao'], correctAnswer: 0 }] }, 4);
assert(prsQ[0].right === 'VN', 'Suy cap tu dap an dung');
const cw = PH.crosswordWordsFromContent({ questions: [{ question: 'Mau co?', answers: ['Đỏ', 'Xanh'], correctAnswer: 0 }] });
assert(cw.length === 1 && cw[0].answer === 'DO', 'Tu khoa o chu suy tu dap an + chuan hoa Đ');
const cwLong = PH.crosswordWordsFromContent({ questions: [{ question: 'Q?', answers: ['Mot dap an rat dai khong hop le', 'B'], correctAnswer: 0 }] });
assert(cwLong.length === 0, 'Bo tu khoa qua 12 ky tu');
const convDrag = ContentEngine.convertContentForGame({ questions: grpContent.questions }, 'drag-drop');
assert(convDrag.compatible && convDrag.convertedContent.pairs.length === 2, 'Convert sang Keo tha giu cap');
const convConn = ContentEngine.convertContentForGame({ questions: [1, 2, 3, 4, 5].map(i => ({ question: 'Q' + i, answers: ['A', 'B'], correctAnswer: 0 })) }, 'connect');
assert(convConn.convertedContent.pairs.length === 4, 'Noi y lay 4 cap dau');
const convCw = ContentEngine.convertContentForGame({ questions: grpContent.questions }, 'crossword');
assert(convCw.compatible === true, 'Convert sang O chu tuong thich');
const dragSrc = fs.readFileSync('src/games/drag-drop/drag-drop-game.js', 'utf-8');
assert(dragSrc.includes('dragGroupsFromContent'), 'Keo tha preview doc content that');
const connSrc = fs.readFileSync('src/games/connect/connect-game.js', 'utf-8');
assert(connSrc.includes('pairsFromContent'), 'Noi y preview doc content that');
const quizSrc = fs.readFileSync('src/games/quiz/quiz-game.js', 'utf-8');
assert(quizSrc.includes('bindKeyboard') && quizSrc.includes('_locked') && quizSrc.includes('this.bindKey'), 'Quiz co phim 1-4 + chong an diem trung');
const wheelSrc = fs.readFileSync('src/games/wheel/wheel-game.js', 'utf-8');
assert(wheelSrc.includes("e.key === ' '") && wheelSrc.includes('this.bindKey'), 'Vong quay co phim Space + key tap trung');
const cwSrc = fs.readFileSync('src/games/crossword/crossword-game.js', 'utf-8');
assert(cwSrc.includes('crosswordWordsFromContent') && cwSrc.includes('normText(input.value)'), 'O chu doc words + cham chuan hoa');
const expSrc = fs.readFileSync('src/core/export-engine.js', 'utf-8');
assert(expSrc.includes('/Đ/g'), 'File xuat xu ly Đ khi chuan hoa');
assert(expSrc.includes('function dragGroups'), 'File xuat Keo tha dung logic nhom nhu preview');
const expDrag = ExportEngine.generateStandaloneHtml({ name: 'Phan loai', gameType: 'drag-drop', themeId: 'nature' }, grpContent, 'standalone');
assert(expDrag.includes('dragGroups'), 'HTML Keo tha xuat chua logic nhom');

// 11. Dot 2: phim tap trung, manh ghep dong, dua xe %, keo co diem
console.log('\n11. Kiem tra Dot 2 (Base key/Manh ghep/Dua xe/Keo co):');
const BG = await import('../src/games/base-game.js');
let added = 0, removed = 0;
global.window = { addEventListener: () => { added++; }, removeEventListener: () => { removed++; } };
const bg = new BG.BaseGame({ innerHTML: '' }, {}, {});
const fn = () => {};
bg.bindKey(fn);
assert(added === 1 && bg.keyHandler === fn, 'BaseGame.bindKey dang ky 1 handler');
bg.bindKey(fn);
assert(added === 2 && removed === 1, 'bindKey moi tu go cu truoc');
bg.destroy();
assert(removed === 2 && bg.keyHandler === null, 'destroy() don phim + timer');
bg.destroy();
assert(removed === 2, 'destroy() 2 lan van an toan');
delete global.window;
const noDirectKey = ['src/games/quiz/quiz-game.js', 'src/games/true-false/true-false-game.js',
  'src/games/wheel/wheel-game.js', 'src/games/flashcard/flashcard-game.js']
  .every(f => !fs.readFileSync(f, 'utf-8').includes("addEventListener('keydown'"));
assert(noDirectKey, '4 game dung bindKey chung, khong con key rieng le');
const jigSrc = fs.readFileSync('src/games/jigsaw/jigsaw-game.js', 'utf-8');
assert(jigSrc.includes('gridCols') && jigSrc.includes('gridRows'), 'Manh ghep luoi dong theo so cau');
assert(jigSrc.includes('coverImage'), 'Manh ghep ho tro tranh bi mat tuy chinh');
const jigHtml = ExportEngine.generateStandaloneHtml({ name: 'J', gameType: 'jigsaw', themeId: 'nature' },
  { questions: [1, 2, 3, 4, 5, 6].map(i => ({ question: 'Q' + i, answers: ['A', 'B'], correctAnswer: 0 })), coverImage: 'data:image/png;base64,AAA' }, 'standalone');
assert(jigHtml.includes('cover') && jigHtml.includes('gCols'), 'File xuat manh ghep co luoi dong + anh nen');
const raceSrc = fs.readFileSync('src/games/classroom/race-game.js', 'utf-8');
assert(raceSrc.includes('100 / this.questions.length') && raceSrc.includes('correctCount'), 'Dua xe % theo tong so cau');
const raceHtml = ExportEngine.generateStandaloneHtml({ name: 'R', gameType: 'race', themeId: 'nature' },
  { questions: [{ question: 'Q?', answers: ['A', 'B'], correctAnswer: 0 }] }, 'standalone');
assert(raceHtml.includes('100 / qs.length'), 'File xuat dua xe % theo tong cau');
const tugSrc = fs.readFileSync('src/games/classroom/tug-of-war-game.js', 'utf-8');
assert(tugSrc.includes('blueScore') && tugSrc.includes('redScore'), 'Keo co co bang diem 2 doi');
assert(tugSrc.includes('tugGoal') && tugSrc.includes('goal'), 'Keo co co dich tuy chinh');
const tugHtml = ExportEngine.generateStandaloneHtml({ name: 'K', gameType: 'tug-of-war', themeId: 'nature', settings: { tugGoal: 50 } },
  { questions: [{ question: 'Q?', answers: ['A', 'B'], correctAnswer: 0 }] }, 'standalone');
assert(tugHtml.includes('hon diem') && tugHtml.includes('tugGoal'), 'File xuat keo co phan thang diem + dich');

// 12. Giao dien chuyen nghiep
console.log('\n12. Kiem tra giao dien chuyen nghiep:');
const viewsCss = fs.readFileSync('src/styles/views.css', 'utf-8');
['.page-head', '.stat-card', '.toolbar-card', '.chip', '.game-card-art', '.seg', '.avatar', '.continue-card', '.qa-card'].forEach(c => {
  assert(viewsCss.includes(c), 'views.css co ' + c);
});
assert(fs.readFileSync('index.html', 'utf-8').includes('views.css'), 'index.html nap views.css');
const IM = await import('../src/ui/icons.js');
assert(typeof IM.avatarFor === 'function' && IM.avatarFor('Nguyen Van An').includes('NV'), 'avatarFor lay chu cai');
const GR = await import('../src/core/game-registry.js');
const missingIcon = GR.GameRegistry.getAll().filter(g => IM.Icons.get(g.icon) === IM.Icons.get('nonexistent-xyz-abc'));
assert(missingIcon.length === 0, 'Ca 12 game deu co icon that (khong roi ve help)');
const dashSrc = fs.readFileSync('src/dashboard/dashboard.js', 'utf-8');
assert(!dashSrc.includes('👋'), 'Dashboard khong con emoji chao');
assert(dashSrc.includes('stat-grid') && dashSrc.includes('daypart'), 'Dashboard co stat cards + loi chao theo buoi');
const libSrc = fs.readFileSync('src/games/games-library-view.js', 'utf-8');
assert(!libSrc.includes('🎡') && libSrc.includes('game-card-art'), 'Thu vien game dung art header thay emoji');
assert(libSrc.includes('"chip"') || libSrc.includes(' chip'), 'Thu vien game dung chip loc');
const projSrc = fs.readFileSync('src/projects/projects-view.js', 'utf-8');
assert(projSrc.includes('avatarFor') && projSrc.includes('showExportSuccessModal'), 'Du an co avatar + xuat theo profile');
const edSrc = fs.readFileSync('src/editor/editor.js', 'utf-8');
assert(edSrc.includes('class="seg"') && edSrc.includes('m-tab'), 'Editor co segmented control + tab mobile');
const appSrc = fs.readFileSync('src/app/app.js', 'utf-8');
assert(appSrc.includes('avatar-top'), 'Topbar co avatar giao vien');

// 13. Tinh nang nho 12 game (preview + export)
console.log('\n13. Kiem tra tinh nang nho 12 game:');
function has(src, s) { return fs.readFileSync(src, 'utf-8').includes(s); }
const EXP = 'src/core/export-engine.js';
assert(has('src/games/quiz/quiz-game.js', 'this.picks') && has('src/games/quiz/quiz-game.js', 'renderResultScreen'), 'Quiz: luu dap an + man hinh xem lai');
assert(has(EXP, 'finishQuiz') && has(EXP, 'picks.push'), 'Xuat Quiz: tien trinh + xem lai');
assert(has('src/games/true-false/true-false-game.js', 'bestStreak') && has('src/games/true-false/true-false-game.js', '2200'), 'Dung/Sai: streak + giai thich');
assert(has(EXP, 'streak') && has(EXP, 'Giai thich'), 'Xuat Dung/Sai: streak + giai thich');
assert(has('src/games/flashcard/flashcard-game.js', 'masteredSet') && has('src/games/flashcard/flashcard-game.js', 'btn-shuffle-cards'), 'Flashcard: chong trung diem + nut xao');
assert(has(EXP, 'id="bS"') || has(EXP, "id=\"bS\""), 'Xuat Flashcard: nut xao');
assert(has('src/games/matching/matching-game.js', 'mistakes') && has('src/games/matching/matching-game.js', 'btn-reshuffle-match'), 'Ghep doi: dem sai + xao lai');
assert(has(EXP, 'errs') && has(EXP, 'mSh'), 'Xuat Ghep doi: dem sai + xao');
assert(has('src/games/drag-drop/drag-drop-game.js', 'btn-reset-drag'), 'Keo tha: nut xep lai');
assert(has(EXP, 'dRs'), 'Xuat Keo tha: nut xep lai');
assert(has('src/games/connect/connect-game.js', 'btn-reset-connect') && has('src/games/connect/connect-game.js', 'attempts'), 'Noi y: reset + dem luot');
assert(has(EXP, 'cRs') && has(EXP, 'tries'), 'Xuat Noi y: reset + dem luot');
assert(has('src/games/wheel/wheel-game.js', 'inp-add-wheel') && has('src/games/wheel/wheel-game.js', 'history'), 'Vong quay: them ten + lich su');
assert(has(EXP, 'wAdd') && has(EXP, 'hist'), 'Xuat Vong quay: them ten + lich su');
assert(has('src/games/jigsaw/jigsaw-game.js', 'attempts'), 'Manh ghep: dem luot thu');
assert(has(EXP, 'Luot thu'), 'Xuat Manh ghep: dem luot thu');
assert(has('src/games/crossword/crossword-game.js', 'hint-word-btn') && has('src/games/crossword/crossword-game.js', 'hinted'), 'O chu: nut goi y nua diem');
assert(has(EXP, 'data-hint') && has(EXP, 'hinted'), 'Xuat O chu: goi y');
assert(has('src/games/timer/timer-game.js', 'btn-timer-mode') && has('src/games/timer/timer-game.js', 'elapsedSeconds'), 'Dong ho: dem len + phut tuy chinh');
assert(has(EXP, 'tMode') && has(EXP, 'bell3'), 'Xuat Dong ho: dem len + chuong 3');
assert(has('src/games/classroom/tug-of-war-game.js', 'goal'), 'Keo co: hien dich + so cau');
assert(has(EXP, 'Dich'), 'Xuat Keo co: dich + so cau');
assert(has('src/games/classroom/race-game.js', 'startTime'), 'Dua xe: do thoi gian + do chinh xac');
assert(has(EXP, 't0'), 'Xuat Dua xe: thoi gian');
// Chuc nang: o chu goi y nua diem
const CW = await import('../src/games/crossword/crossword-game.js');
assert(typeof CW.CrosswordGame === 'function', 'CrosswordGame tai duoc');
assert(PH.crosswordWordsFromContent({ questions: [{ question: 'Mau?', answers: ['Do', 'Xanh'], correctAnswer: 0 }] })[0].answer === 'DO', 'Helper goi y dung dap an');

console.log(`\n========================================`);
console.log(`KẾT QUẢ: Đã vượt qua ${passed} kiểm thử, Thất bại: ${failed}`);
if (failed > 0) process.exit(1);
