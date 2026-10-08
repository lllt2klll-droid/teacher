/* ==========================================================================
   TeacherStudio Central Game Registry
   ========================================================================== */

import { QuizGame } from '../games/quiz/quiz-game.js';
import { TrueFalseGame } from '../games/true-false/true-false-game.js';
import { FlashcardGame } from '../games/flashcard/flashcard-game.js';
import { MatchingGame } from '../games/matching/matching-game.js';
import { DragDropGame } from '../games/drag-drop/drag-drop-game.js';
import { ConnectGame } from '../games/connect/connect-game.js';
import { WheelGame } from '../games/wheel/wheel-game.js';
import { JigsawGame } from '../games/jigsaw/jigsaw-game.js';
import { CrosswordGame } from '../games/crossword/crossword-game.js';
import { TimerGame } from '../games/timer/timer-game.js';
import { TugOfWarGame } from '../games/classroom/tug-of-war-game.js';
import { RaceGame } from '../games/classroom/race-game.js';

const registry = new Map();

export const GameRegistry = {
  register(gameDef) {
    registry.set(gameDef.id, gameDef);
  },

  get(id) {
    return registry.get(id) || registry.get('quiz');
  },

  getAll() {
    return Array.from(registry.values());
  },

  getByCategory(category) {
    if (!category || category === 'all') return this.getAll();
    return this.getAll().filter(g => g.category === category);
  },

  createInstance(id, container, project, content, options) {
    const def = this.get(id);
    if (!def || !def.GameClass) {
      throw new Error(`Game '${id}' is not registered`);
    }
    return new def.GameClass(container, project, content, options);
  }
};

// Register all Core & Classroom Games
GameRegistry.register({
  id: 'quiz',
  name: 'Quiz Trắc nghiệm',
  category: 'quiz',
  description: 'Trắc nghiệm 4 lựa chọn, có tính giờ, tính điểm và giải thích chi tiết.',
  icon: 'help-circle',
  pedagogy: 'Luyện tập, Ôn tập, Kiểm tra nhanh',
  GameClass: QuizGame
});

GameRegistry.register({
  id: 'true-false',
  name: 'Đúng / Sai',
  category: 'quiz',
  description: 'Thẻ chọn Đúng hoặc Sai cỡ lớn, phản xạ nhanh với phím tắt 1-2 hoặc mũi tên.',
  icon: 'check-square',
  pedagogy: 'Khởi động, Kiểm tra nhận biết',
  GameClass: TrueFalseGame
});

GameRegistry.register({
  id: 'flashcard',
  name: 'Lật thẻ ghi nhớ',
  category: 'quiz',
  description: 'Thẻ học 3D lật 2 mặt giữa thuật ngữ và định nghĩa, hỗ trợ ghi nhớ bài học.',
  icon: 'copy',
  pedagogy: 'Khám phá từ vựng, Ghi nhớ khái niệm',
  GameClass: FlashcardGame
});

GameRegistry.register({
  id: 'matching',
  name: 'Ghép đôi tương ứng',
  category: 'matching',
  description: 'Ghép các mục tương ứng ở 2 cột, phản hồi màu sắc trực quan.',
  icon: 'columns',
  pedagogy: 'Luyện tập liên kết kiến thức',
  GameClass: MatchingGame
});

GameRegistry.register({
  id: 'drag-drop',
  name: 'Kéo thả phân loại',
  category: 'matching',
  description: 'Kéo các từ ngữ hoặc hình ảnh vào từng nhóm chủ đề tương ứng (chuột & cảm ứng).',
  icon: 'move',
  pedagogy: 'Phân loại nhóm, Khám phá bài học',
  GameClass: DragDropGame
});

GameRegistry.register({
  id: 'connect',
  name: 'Nối ý tương quan',
  category: 'matching',
  description: 'Chọn các điểm để nối các ý nghĩa phù hợp trong bài học.',
  icon: 'share-2',
  pedagogy: 'Luyện tập nối câu, đối chiếu',
  GameClass: ConnectGame
});

GameRegistry.register({
  id: 'wheel',
  name: 'Vòng quay may mắn',
  category: 'interactive',
  description: 'Vòng quay vật lý ngẫu nhiên để gọi tên học sinh hoặc rút câu hỏi bất ngờ.',
  icon: 'compass',
  pedagogy: 'Khởi động, Khen thưởng, Sinh hoạt lớp',
  GameClass: WheelGame
});

GameRegistry.register({
  id: 'jigsaw',
  name: 'Lật mảnh ghép',
  category: 'interactive',
  description: 'Trả lời đúng từng câu để lật mở bức tranh bí mật phía sau.',
  icon: 'grid',
  pedagogy: 'Khám phá chủ đề mới, Kích thích tò mò',
  GameClass: JigsawGame
});

GameRegistry.register({
  id: 'crossword',
  name: 'Giải ô chữ vui',
  category: 'quiz',
  description: 'Điền các từ khóa theo hàng ngang/dọc dựa trên gợi ý của giáo viên.',
  icon: 'type',
  pedagogy: 'Củng cố từ vựng, Tư duy logic',
  GameClass: CrosswordGame
});

GameRegistry.register({
  id: 'timer',
  name: 'Đồng hồ đếm ngược',
  category: 'tools',
  description: 'Đồng hồ hiển thị số lớn, có âm thanh chuông báo hết giờ thảo luận.',
  icon: 'clock',
  pedagogy: 'Quản lý thời gian thảo luận nhóm',
  GameClass: TimerGame
});

GameRegistry.register({
  id: 'tug-of-war',
  name: 'Kéo co đồng đội',
  category: 'interactive',
  description: 'Chia lớp làm 2 đội Đội Xanh và Đội Đỏ, giải đố để kéo dây về đích.',
  icon: 'users',
  pedagogy: 'Củng cố bài học, Thi đua tập thể',
  GameClass: TugOfWarGame
});

GameRegistry.register({
  id: 'race',
  name: 'Đua xe tốc độ',
  category: 'interactive',
  description: 'Mỗi câu trả lời đúng sẽ giúp xe tăng tốc vượt chặng đua về đích.',
  icon: 'zap',
  pedagogy: 'Khuấy động không khí, Đua điểm số',
  GameClass: RaceGame
});
