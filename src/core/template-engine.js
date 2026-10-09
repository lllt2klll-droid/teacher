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
  },
  {
    id: 'tpl_toan3_cuu_chuong',
    name: 'Toán 3: Bảng cửu chương 7',
    phase: 'practice',
    phaseName: 'Luyện tập',
    gameType: 'quiz',
    themeId: 'mathematics',
    description: 'Trắc nghiệm bảng nhân 7 theo chương trình Toán 3 (Kết nối tri thức). Cô sửa số liệu là dạy được ngay.',
    sampleQuestions: [
      { question: '7 x 3 = ?', answers: ['18', '21', '24', '28'], correctAnswer: 1, explanation: '7 x 3 = 21.' },
      { question: '7 x 5 = ?', answers: ['30', '32', '35', '40'], correctAnswer: 2, explanation: '7 x 5 = 35.' },
      { question: '7 x 8 = ?', answers: ['54', '56', '58', '63'], correctAnswer: 1, explanation: '7 x 8 = 56.' },
      { question: '42 là kết quả của phép tính nào?', answers: ['7 x 5', '7 x 6', '7 x 7', '7 x 4'], correctAnswer: 1, explanation: '7 x 6 = 42.' }
    ]
  },
  {
    id: 'tpl_tv2_tu_ngu',
    name: 'Tiếng Việt 2: Từ chỉ sự vật',
    phase: 'practice',
    phaseName: 'Luyện tập',
    gameType: 'matching',
    themeId: 'nature',
    description: 'Ghép từ với nhóm ý nghĩa: người, vật, cây cối, hiện tượng — bám SGK Tiếng Việt 2.',
    sampleQuestions: [
      { question: 'Cô giáo', answers: ['Từ chỉ người'], correctAnswer: 0 },
      { question: 'Con mèo', answers: ['Từ chỉ con vật'], correctAnswer: 0 },
      { question: 'Cây bàng', answers: ['Từ chỉ cây cối'], correctAnswer: 0 },
      { question: 'Cơn mưa', answers: ['Từ chỉ hiện tượng'], correctAnswer: 0 }
    ]
  },
  {
    id: 'tpl_kh4_nuoc',
    name: 'Khoa học 4: Vòng tuần hoàn của nước',
    phase: 'consolidate',
    phaseName: 'Củng cố',
    gameType: 'true-false',
    themeId: 'ocean',
    description: 'Mệnh đề Đúng/Sai củng cố bài Nước trong tự nhiên — Khoa học 4.',
    sampleQuestions: [
      { question: 'Nước bay hơi khi được đun nóng', answers: ['ĐÚNG', 'SAI'], correctAnswer: 0 },
      { question: 'Mây được tạo thành từ hơi nước ngưng tụ', answers: ['ĐÚNG', 'SAI'], correctAnswer: 0 },
      { question: 'Nước đá tan ra ở nhiệt độ rất lạnh', answers: ['ĐÚNG', 'SAI'], correctAnswer: 1, explanation: 'Nước đá tan khi nhiệt độ tăng trên 0°C.' }
    ]
  },
  {
    id: 'tpl_lsdl5_bac_ho',
    name: 'Lịch sử & Địa lí 5: Bác Hồ',
    phase: 'explore',
    phaseName: 'Khám phá',
    gameType: 'flashcard',
    themeId: 'vietnam',
    description: 'Thẻ ghi nhớ sự kiện, địa danh gắn với Bác Hồ — Lịch sử 5.',
    sampleQuestions: [
      { question: 'Ngày sinh của Bác Hồ?', answers: ['19/5/1890'], correctAnswer: 0 },
      { question: 'Quê hương của Bác Hồ?', answers: ['Làng Sen, Nam Đàn, Nghệ An'], correctAnswer: 0 },
      { question: 'Bến cảng Bác ra đi tìm đường cứu nước (1911)?', answers: ['Bến Nhà Rồng'], correctAnswer: 0 }
    ]
  },
  {
    id: 'tpl_tv3_o_chu',
    name: 'Tiếng Việt 3: Ô chữ Quê hương',
    phase: 'consolidate',
    phaseName: 'Củng cố',
    gameType: 'crossword',
    themeId: 'festival',
    description: 'Ô chữ từ vựng chủ điểm Quê hương — Tiếng Việt 3. Sửa gợi ý là dùng được.',
    sampleQuestions: [
      { question: 'Dòng sông quê em thường có nước màu gì? (3 chữ)', answers: ['đỏ'], correctAnswer: 0 },
      { question: 'Cây gì cho bóng mát sân trường? (3 chữ)', answers: ['bàng'], correctAnswer: 0 },
      { question: 'Tiếng gì kêu "ri rả" mùa hè? (3 chữ)', answers: ['ve sầu'], correctAnswer: 0 }
    ]
  },
  {
    id: 'tpl_toan5_keo_co',
    name: 'Toán 5: Kéo co Số thập phân',
    phase: 'consolidate',
    phaseName: 'Củng cố',
    gameType: 'tug-of-war',
    themeId: 'mathematics',
    description: 'Hai đội thi đua làm tròn, so sánh số thập phân — Toán 5.',
    sampleQuestions: [
      { question: 'Làm tròn 3,47 đến hàng phần mười?', answers: ['3,4', '3,5', '3,47', '4,0'], correctAnswer: 1, explanation: '3,47 ≈ 3,5.' },
      { question: 'Số nào lớn nhất: 5,09 - 5,9 - 5,19?', answers: ['5,09', '5,9', '5,19', 'Bằng nhau'], correctAnswer: 1, explanation: '5,9 = 5,90 lớn nhất.' },
      { question: '0,5 = phân số nào?', answers: ['1/2', '1/5', '5/10 sai', '2/1'], correctAnswer: 0, explanation: '0,5 = 1/2.' }
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
