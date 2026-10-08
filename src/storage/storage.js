/* ==========================================================================
   TeacherStudio Unified Storage API
   ========================================================================== */

import { LocalStorage } from './local-storage.js';
import { IndexedDBStore } from './indexed-db.js';

export const Storage = {
  async init() {
    // Check if initial sample data is needed
    const initialized = LocalStorage.get('initialized', false);
    if (!initialized) {
      await this.seedDefaultData();
      LocalStorage.set('initialized', true);
    }
  },

  async getProjects() {
    const list = await IndexedDBStore.getAll('projects');
    if (list && list.length > 0) return list;
    // Fallback to local storage if IndexedDB empty/unsupported
    return LocalStorage.get('projects_fallback', []);
  },

  async getProject(id) {
    const proj = await IndexedDBStore.get('projects', id);
    if (proj) return proj;
    const list = LocalStorage.get('projects_fallback', []);
    return list.find(p => p.id === id) || null;
  },

  async saveProject(project) {
    if (!project.id) {
      project.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    project.updatedAt = new Date().toISOString();
    if (!project.createdAt) project.createdAt = project.updatedAt;

    await IndexedDBStore.put('projects', project);

    // Keep fallback in sync
    const list = LocalStorage.get('projects_fallback', []);
    const idx = list.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      list[idx] = project;
    } else {
      list.push(project);
    }
    LocalStorage.set('projects_fallback', list);

    return project;
  },

  async deleteProject(id) {
    await IndexedDBStore.delete('projects', id);
    const list = LocalStorage.get('projects_fallback', []);
    const filtered = list.filter(p => p.id !== id);
    LocalStorage.set('projects_fallback', filtered);
    return true;
  },

  // Contents (Question banks / content packages)
  async getContents() {
    const list = await IndexedDBStore.getAll('contents');
    if (list && list.length > 0) return list;
    return LocalStorage.get('contents_fallback', []);
  },

  async getContent(id) {
    const item = await IndexedDBStore.get('contents', id);
    if (item) return item;
    const list = LocalStorage.get('contents_fallback', []);
    return list.find(c => c.id === id) || null;
  },

  async saveContent(content) {
    if (!content.id) {
      content.id = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    content.updatedAt = new Date().toISOString();
    await IndexedDBStore.put('contents', content);

    const list = LocalStorage.get('contents_fallback', []);
    const idx = list.findIndex(c => c.id === content.id);
    if (idx >= 0) {
      list[idx] = content;
    } else {
      list.push(content);
    }
    LocalStorage.set('contents_fallback', list);
    return content;
  },

  async deleteContent(id) {
    await IndexedDBStore.delete('contents', id);
    const list = LocalStorage.get('contents_fallback', []);
    LocalStorage.set('contents_fallback', list.filter(c => c.id !== id));
    return true;
  },

  // Settings
  getSettings() {
    const defaultSettings = {
      theme: 'system', // 'light' | 'dark' | 'system'
      accent: 'forest',
      density: 'comfortable',
      autosave: true,
      autosaveInterval: 30000,
      soundEnabled: true,
      highContrast: false,
      reducedMotion: false,
      language: 'vi',
      defaultGameTimer: 30,
      exportProfile: 'standalone'
    };
    return { ...defaultSettings, ...(LocalStorage.get('user_settings') || {}) };
  },

  saveSettings(settings) {
    return LocalStorage.set('user_settings', settings);
  },

  // Export / Import All
  async exportAllData() {
    const projects = await this.getProjects();
    const contents = await this.getContents();
    const settings = this.getSettings();
    return { projects, contents, settings };
  },

  async importAllData(data, mode = 'merge') {
    if (mode === 'replace') {
      await IndexedDBStore.clear('projects');
      await IndexedDBStore.clear('contents');
      LocalStorage.set('projects_fallback', []);
      LocalStorage.set('contents_fallback', []);
    }

    if (Array.isArray(data.projects)) {
      for (const p of data.projects) {
        await this.saveProject(p);
      }
    }

    if (Array.isArray(data.contents)) {
      for (const c of data.contents) {
        await this.saveContent(c);
      }
    }

    if (data.settings) {
      this.saveSettings(data.settings);
    }

    return true;
  },

  // Seed initial sample projects
  async seedDefaultData() {
    const sampleContent1 = {
      id: 'content_math_5',
      name: 'Toán 5 - Số thập phân và Làm tròn số',
      subject: 'Toán',
      grade: '5',
      description: 'Bộ câu hỏi ôn tập chuyên đề số thập phân học kỳ 1',
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          question: 'Làm tròn số 15,678 đến hàng phần mười ta được số nào?',
          answers: ['15,6', '15,7', '15,68', '16'],
          correctAnswer: 1, // index 1 is '15,7'
          explanation: 'Chữ số ngay sau hàng phần mười là 7 (>= 5), nên ta cộng thêm 1 vào hàng phần mười (6 + 1 = 7).',
          points: 10,
          timeLimit: 30
        },
        {
          id: 'q2',
          type: 'single-choice',
          question: 'Số 4,05 gấp 10 lần thì bằng bao nhiêu?',
          answers: ['0,405', '40,5', '405', '4,5'],
          correctAnswer: 1,
          explanation: 'Nhân một số thập phân với 10 ta dịch chuyển dấu phẩy sang phải một chữ số.',
          points: 10,
          timeLimit: 30
        },
        {
          id: 'q3',
          type: 'single-choice',
          question: 'Phân số 3/4 được viết dưới dạng số thập phân là:',
          answers: ['0,34', '0,75', '0,5', '0,7'],
          correctAnswer: 1,
          explanation: '3 chia 4 bằng 0,75.',
          points: 10,
          timeLimit: 30
        },
        {
          id: 'q4',
          type: 'single-choice',
          question: 'Hỗn số 2 và 3/5 đổi ra số thập phân là:',
          answers: ['2,35', '2,6', '2,3', '2,5'],
          correctAnswer: 1,
          explanation: '3/5 = 0,6; vậy 2 và 3/5 = 2,6.',
          points: 10,
          timeLimit: 30
        }
      ]
    };

    const sampleContent2 = {
      id: 'content_science_4',
      name: 'Khoa học 4 - Sự sống và Môi trường',
      subject: 'Khoa học',
      grade: '4',
      description: 'Câu hỏi khám phá tự nhiên cho học sinh lớp 4',
      questions: [
        {
          id: 'qs1',
          type: 'single-choice',
          question: 'Thực vật cần những yếu tố nào dưới đây để quang hợp?',
          answers: ['Ánh sáng, nước, khí carbonic', 'Chỉ cần nước', 'Bóng râm và khí oxy', 'Gió và đá'],
          correctAnswer: 0,
          explanation: 'Cây xanh cần ánh sáng mặt trời, nước từ rễ và khí carbonic từ không khí.',
          points: 10,
          timeLimit: 25
        },
        {
          id: 'qs2',
          type: 'single-choice',
          question: 'Nước tồn tại ở mấy thể trong tự nhiên?',
          answers: ['1 thể (thể lỏng)', '2 thể (lỏng và rắn)', '3 thể (rắn, lỏng, khí)', '4 thể'],
          correctAnswer: 2,
          explanation: 'Nước tồn tại ở thể rắn (băng), lỏng (nước thường), và khí (hơi nước).',
          points: 10,
          timeLimit: 25
        }
      ]
    };

    await this.saveContent(sampleContent1);
    await this.saveContent(sampleContent2);

    // Initial Projects
    const sampleProject1 = {
      id: 'proj_sample_quiz',
      name: 'Làm tròn số thập phân',
      subject: 'Toán',
      grade: '5',
      description: 'Trò chơi trắc nghiệm vui khởi động bài học',
      gameType: 'quiz',
      contentId: 'content_math_5',
      themeId: 'nature',
      tags: ['#Toán5', '#KhởiĐộng', '#SốThậpPhân'],
      settings: {
        timerEnabled: true,
        timerSeconds: 30,
        shuffleQuestions: false,
        showExplanation: true,
        soundEnabled: true
      },
      viewport: {
        mode: '16:9'
      }
    };

    const sampleProject2 = {
      id: 'proj_sample_wheel',
      name: 'Vòng quay gọi tên & câu hỏi ngẫu nhiên',
      subject: 'Hoạt động chung',
      grade: 'Tiểu học',
      description: 'Vòng quay may mắn dành cho tiết sinh hoạt hoặc khởi động',
      gameType: 'wheel',
      contentId: 'content_science_4',
      themeId: 'classroom',
      tags: ['#KhởiĐộng', '#VòngQuay'],
      settings: {
        soundEnabled: true,
        removeUsedOption: true
      },
      viewport: {
        mode: '16:9'
      }
    };

    await this.saveProject(sampleProject1);
    await this.saveProject(sampleProject2);
  }
};
