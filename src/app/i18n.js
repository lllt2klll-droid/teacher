/* ==========================================================================
   TeacherStudio Internationalization (i18n) - Teacher-First Language
   ========================================================================== */

import { LocalStorage } from '../storage/local-storage.js';

const translations = {
  vi: {
    appTitle: 'TeacherStudio',
    appSubtitle: 'Không gian sáng tạo trò chơi học tập',
    greeting: 'Chào Thầy/Cô 👋',
    tagline: 'Tạo hoạt động tương tác cho lớp học mà không cần lập trình',
    
    // Navigation
    navDashboard: 'Tổng quan',
    navGames: 'Trò chơi',
    navProjects: 'Dự án của tôi',
    navContent: 'Thư viện câu hỏi',
    navThemes: 'Chủ đề',
    navTemplates: 'Mẫu hoạt động',
    navSettings: 'Cài đặt',
    navHelp: 'Trợ giúp',
    
    // Common Actions
    createGame: 'Tạo trò chơi',
    createFromQuestions: 'Tạo từ bộ câu hỏi',
    useTemplate: 'Dùng mẫu',
    importProject: 'Nhập dự án',
    save: 'Lưu',
    saving: 'Đang lưu...',
    saved: 'Đã lưu',
    savedAt: 'Đã lưu lúc',
    preview: 'Xem trước',
    exportHtml: 'Xuất file HTML',
    undo: 'Hoàn tác',
    redo: 'Làm lại',
    changeGameType: 'Đổi hình thức',
    duplicate: 'Nhân bản',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    back: 'Quay lại',
    search: 'Tìm kiếm dự án, câu hỏi, mẫu...',
    commandPalette: 'Bảng lệnh nhanh',
    
    // Projects View
    projectList: 'Danh sách dự án',
    projectName: 'Tên dự án',
    subject: 'Môn học',
    grade: 'Khối lớp',
    gameType: 'Loại trò chơi',
    theme: 'Chủ đề',
    updatedAt: 'Cập nhật',
    actions: 'Thao tác',
    noProjectsYet: 'Chưa có dự án nào',
    noProjectsDesc: 'Bắt đầu ngay bằng cách tạo một trò chơi mới hoặc dùng mẫu có sẵn.',
    deleteConfirmTitle: 'Xác nhận xóa dự án',
    deleteConfirmDesc: 'Thầy/Cô có chắc chắn muốn xóa dự án này? Thao tác này không thể hoàn tác.',
    
    // Editor
    tabContent: 'Nội dung',
    tabQuestions: 'Câu hỏi',
    tabSettings: 'Cài đặt',
    tabDesign: 'Thiết kế',
    addQuestion: 'Thêm câu hỏi',
    bulkImport: 'Nhập hàng loạt',
    questionText: 'Nội dung câu hỏi',
    answersText: 'Các phương án trả lời',
    correctAnswer: 'Đáp án đúng',
    explanation: 'Giải thích chi tiết',
    timeLimitSeconds: 'Thời gian làm (giây)',
    points: 'Điểm số',
    
    // Export & Diagnostics
    exportDiagnosticsTitle: 'Kiểm tra trước khi xuất file',
    exportStandaloneDesc: 'Tạo một file HTML duy nhất hoạt động độc lập không cần mạng Internet.',
    exportProfile: 'Cấu hình xuất',
    exportProfileStandalone: 'Chuẩn độc lập (Khuyên dùng)',
    exportProfileLightweight: 'Tối ưu siêu nhẹ',
    exportProfileCanva: 'Tương thích trình chiếu / Canva',
    startExport: 'Tải file HTML về máy',
    diagnosticValid: 'Tất cả điều kiện hợp lệ để xuất file',
    
    // Backup & Restore
    backupData: 'Sao lưu dữ liệu',
    restoreData: 'Khôi phục dữ liệu',
    exportBackupSuccess: 'Đã tải về tệp sao lưu .tstudio thành công',
    
    // Game categories
    catAll: 'Tất cả',
    catQuiz: 'Trắc nghiệm',
    catMatching: 'Ghép & Nối',
    catInteractive: 'Tương tác & Lớp học',
    catTools: 'Công cụ lớp học',

    // Themes
    themeMinimal: 'Tối giản',
    themeClassroom: 'Lớp học bảng đen',
    themeNature: 'Thiên nhiên tươi mát',
    themeOcean: 'Đại dương bao la',
    themeSpace: 'Vũ trụ huyền bí',
    themeScience: 'Khoa học kỳ thú',
    themeMathematics: 'Toán học vui',
    themeVietnam: 'Hào khí Việt Nam',
    themeFestival: 'Lễ hội rực rỡ'
  },
  en: {
    appTitle: 'TeacherStudio',
    appSubtitle: 'Interactive Educational Activity Studio',
    greeting: 'Welcome Teacher 👋',
    tagline: 'Create interactive classroom activities without coding',
    
    navDashboard: 'Dashboard',
    navGames: 'Games',
    navProjects: 'My Projects',
    navContent: 'Question Bank',
    navThemes: 'Themes',
    navTemplates: 'Templates',
    navSettings: 'Settings',
    navHelp: 'Help Center',
    
    createGame: 'Create Game',
    createFromQuestions: 'Create from Questions',
    useTemplate: 'Use Template',
    importProject: 'Import Project',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    savedAt: 'Saved at',
    preview: 'Preview',
    exportHtml: 'Export Single HTML',
    undo: 'Undo',
    redo: 'Redo',
    changeGameType: 'Change Game Format',
    duplicate: 'Duplicate',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    search: 'Search projects, questions, templates...',
    commandPalette: 'Command Palette',
    
    projectList: 'Projects List',
    projectName: 'Project Name',
    subject: 'Subject',
    grade: 'Grade',
    gameType: 'Game Type',
    theme: 'Theme',
    updatedAt: 'Updated',
    actions: 'Actions',
    noProjectsYet: 'No projects yet',
    noProjectsDesc: 'Get started by creating a new game or using a pre-made template.',
    deleteConfirmTitle: 'Confirm Project Deletion',
    deleteConfirmDesc: 'Are you sure you want to delete this project? This action cannot be undone.',
    
    tabContent: 'Content',
    tabQuestions: 'Questions',
    tabSettings: 'Settings',
    tabDesign: 'Design',
    addQuestion: 'Add Question',
    bulkImport: 'Bulk Import',
    questionText: 'Question Content',
    answersText: 'Answer Choices',
    correctAnswer: 'Correct Answer',
    explanation: 'Explanation',
    timeLimitSeconds: 'Time Limit (s)',
    points: 'Points',
    
    exportDiagnosticsTitle: 'Pre-export Diagnostics',
    exportStandaloneDesc: 'Generate a single self-contained HTML file that runs anywhere without Internet.',
    exportProfile: 'Export Profile',
    exportProfileStandalone: 'Standalone (Recommended)',
    exportProfileLightweight: 'Ultra-lightweight',
    exportProfileCanva: 'Presentation / Canva Compatible',
    startExport: 'Download HTML File',
    diagnosticValid: 'All conditions are valid for export',
    
    backupData: 'Backup Data',
    restoreData: 'Restore Data',
    exportBackupSuccess: 'Backup .tstudio file downloaded successfully',
    
    catAll: 'All',
    catQuiz: 'Quiz & Choice',
    catMatching: 'Match & Connect',
    catInteractive: 'Classroom Games',
    catTools: 'Classroom Tools',

    themeMinimal: 'Minimalist',
    themeClassroom: 'Classroom Blackboard',
    themeNature: 'Fresh Nature',
    themeOcean: 'Deep Ocean',
    themeSpace: 'Cosmic Space',
    themeScience: 'Fun Science',
    themeMathematics: 'Playful Math',
    themeVietnam: 'Vietnam Heritage',
    themeFestival: 'Festival Celebration'
  }
};

let currentLang = LocalStorage.get('app_language', 'vi');

export const i18n = {
  getLanguage() {
    return currentLang;
  },

  setLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
      LocalStorage.set('app_language', lang);
      document.documentElement.setAttribute('lang', lang);
      return true;
    }
    return false;
  },

  t(key, fallback = '') {
    const dict = translations[currentLang] || translations.vi;
    return dict[key] || translations.vi[key] || fallback || key;
  }
};
