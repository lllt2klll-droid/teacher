/* ==========================================================================
   TeacherStudio Template Engine - Pre-built Pedagogical Starters
   ========================================================================== */

export const TEMPLATES = [
  {
    id: 'tpl_quick_quiz',
    name: 'Khởi động: Trắc nghiệm 5 phút',
    phase: 'warmup',
    phaseName: 'Khởi động',
    gameType: 'quiz',
    themeId: 'nature',
    description: 'Bộ trắc nghiệm 4 câu vui nhộn, hào hứng khuấy động không khí lớp học đầu giờ.',
    sampleQuestions: [
      {
        question: 'Con vật nào sau đây đẻ trứng?',
        answers: ['Gà', 'Chó', 'Mèo', 'Bò'],
        correctAnswer: 0,
        explanation: 'Gà là loài gia cầm thuộc lớp chim, sinh sản bằng hình thức đẻ trứng.'
      },
      {
        question: 'Hình nào có 4 cạnh bằng nhau và 4 góc vuông?',
        answers: ['Hình tam giác', 'Hình chữ nhật', 'Hình vuông', 'Hình thoi'],
        correctAnswer: 2,
        explanation: 'Hình vuông có 4 góc vuông và 4 cạnh bằng nhau.'
      },
      {
        question: 'Từ nào sau đây viết ĐÚNG chính tả?',
        answers: ['Xinh xắn', 'Sinh xắn', 'Xinh sắn', 'Sinh sắn'],
        correctAnswer: 0,
        explanation: 'Từ láy đúng chính tả là "xinh xắn".'
      }
    ]
  },
  {
    id: 'tpl_wheel_spin',
    name: 'Khởi động: Vòng quay may mắn',
    phase: 'warmup',
    phaseName: 'Khởi động',
    gameType: 'wheel',
    themeId: 'classroom',
    description: 'Vòng quay gọi tên học sinh ngẫu nhiên phát biểu bài hoặc nhận thử thách thú vị.',
    sampleQuestions: [
      { question: 'Nguyễn Văn An' },
      { question: 'Trần Thị Bình' },
      { question: 'Lê Hoàng Cúc' },
      { question: 'Phạm Minh Đức' },
      { question: 'Vũ Ngọc Hân' },
      { question: 'Hoàng Quốc Khánh' }
    ]
  },
  {
    id: 'tpl_matching_vocab',
    name: 'Luyện tập: Ghép đôi từ vựng & ý nghĩa',
    phase: 'practice',
    phaseName: 'Luyện tập',
    gameType: 'matching',
    themeId: 'ocean',
    description: 'Nối từ khóa với định nghĩa phù hợp, củng cố vốn từ và khái niệm môn học.',
    sampleQuestions: [
      { question: 'Thực vật', answers: ['Sinh vật tự quang hợp sản xuất chất dinh dưỡng'], correctAnswer: 0 },
      { question: 'Động vật ăn cỏ', answers: ['Các loài tiêu thụ thực vật như trâu, bò, dê'], correctAnswer: 0 },
      { question: 'Động vật ăn thịt', answers: ['Các loài săn mồi như hổ, báo, đại bàng'], correctAnswer: 0 },
      { question: 'Khí oxy', answers: ['Khí cần thiết cho sự hô hấp của sinh vật'], correctAnswer: 0 }
    ]
  },
  {
    id: 'tpl_tug_of_war',
    name: 'Củng cố: Kéo co đồng đội',
    phase: 'consolidate',
    phaseName: 'Củng cố',
    gameType: 'tug-of-war',
    themeId: 'festival',
    description: 'Chia lớp thành 2 đội (Đội Xanh & Đội Đỏ), thi đua giải câu hỏi để kéo dây về đích.',
    sampleQuestions: [
      {
        question: 'Số lớn nhất có 3 chữ số khác nhau là:',
        answers: ['999', '987', '978', '897'],
        correctAnswer: 1,
        explanation: 'Chữ số hàng trăm lớn nhất là 9, hàng chục là 8, hàng đơn vị là 7 -> 987.'
      },
      {
        question: 'Sông nào dài nhất Việt Nam?',
        answers: ['Sông Hồng', 'Sông Đồng Nai', 'Sông Cửu Long', 'Sông Mê Kông'],
        correctAnswer: 1,
        explanation: 'Sông Đồng Nai là con sông nội địa dài nhất chảy hoàn toàn trong lãnh thổ Việt Nam.'
      },
      {
        question: 'Từ ngữ nào chỉ tình cảm yêu thương gia đình?',
        answers: ['Hiếu thảo', 'Chăm chỉ', 'Dũng cảm', 'Cần cù'],
        correctAnswer: 0,
        explanation: 'Hiếu thảo thể hiện sự kính trọng, biết ơn ông bà cha mẹ.'
      }
    ]
  },
  {
    id: 'tpl_jigsaw_reveal',
    name: 'Khám phá: Lật mảnh ghép bí mật',
    phase: 'explore',
    phaseName: 'Khám phá',
    gameType: 'jigsaw',
    themeId: 'space',
    description: 'Trả lời đúng từng câu hỏi để lật mở từng mảnh ghép, giải mã bức tranh chủ đề.',
    sampleQuestions: [
      {
        question: 'Hành tinh nào gần Mặt Trời nhất?',
        answers: ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa'],
        correctAnswer: 0
      },
      {
        question: 'Trái Đất là hành tinh thứ mấy từ Mặt Trời?',
        answers: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5'],
        correctAnswer: 1
      },
      {
        question: 'Vệ tinh tự nhiên của Trái Đất là gì?',
        answers: ['Mặt Trăng', 'Sao Băng', 'Mặt Trời', 'Sao Hỏa'],
        correctAnswer: 0
      },
      {
        question: 'Hành tinh nào có vành đai băng lớn nhất?',
        answers: ['Sao Mộc', 'Sao Thổ', 'Sao Hải Vương', 'Sao Diêm Vương'],
        correctAnswer: 1
      }
    ]
  }
];

export const TemplateEngine = {
  getTemplates(filterPhase = null) {
    if (!filterPhase || filterPhase === 'all') return TEMPLATES;
    return TEMPLATES.filter(t => t.phase === filterPhase);
  },

  getTemplate(id) {
    return TEMPLATES.find(t => t.id === id) || null;
  }
};
