/* ==========================================================================
   TeacherStudio Project Manager
   ========================================================================== */

import { Storage } from '../storage/storage.js';
import { ContentEngine } from './content-engine.js';
import { EventBus } from './event-bus.js';

export const ProjectManager = {
  async getAllProjects() {
    return await Storage.getProjects();
  },

  async getProject(id) {
    return await Storage.getProject(id);
  },

  async createNewProject({
    name = 'Trò chơi mới',
    subject = 'Toán',
    grade = '5',
    description = '',
    gameType = 'quiz',
    themeId = 'nature',
    sampleQuestions = null,
    tags = []
  } = {}) {
    // 1. Create a content document
    const content = {
      id: 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: `Bộ câu hỏi - ${name}`,
      subject,
      grade,
      description,
      questions: sampleQuestions || [
        ContentEngine.createQuestion({
          question: 'Câu hỏi mẫu 1: Thủ đô của Việt Nam là gì?',
          answers: ['Hà Nội', 'Huế', 'Đà Nẵng', 'TP. Hồ Chí Minh'],
          correctAnswer: 0,
          explanation: 'Hà Nội là thủ đô ngàn năm văn hiến của nước CHXHCN Việt Nam.'
        }),
        ContentEngine.createQuestion({
          question: 'Câu hỏi mẫu 2: 7 x 8 bằng bao nhiêu?',
          answers: ['54', '56', '58', '64'],
          correctAnswer: 1,
          explanation: 'Bảng cửu chương 7 x 8 = 56.'
        })
      ]
    };
    await Storage.saveContent(content);

    // 2. Create the project
    const project = {
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name,
      subject,
      grade,
      description,
      gameType,
      contentId: content.id,
      themeId,
      settings: {
        timerEnabled: true,
        timerSeconds: 30,
        shuffleQuestions: false,
        showExplanation: true,
        soundEnabled: true,
        readAloud: true,
        teacherMode: false,
        tugGoal: 50
      },
      viewport: {
        mode: '16:9'
      },
      tags,
      version: 1
    };

    const saved = await Storage.saveProject(project);
    EventBus.emit('project:created', saved);
    return { project: saved, content };
  },

  async duplicateProject(projectId) {
    const original = await Storage.getProject(projectId);
    if (!original) throw new Error('Không tìm thấy dự án gốc để nhân bản');

    const originalContent = await Storage.getContent(original.contentId);
    
    // Copy content
    const newContent = {
      ...JSON.parse(JSON.stringify(originalContent || {})),
      id: 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: `${originalContent?.name || original.name} (Bản sao)`
    };
    await Storage.saveContent(newContent);

    // Copy project
    const clonedProject = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: `${original.name} (Bản sao)`,
      contentId: newContent.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await Storage.saveProject(clonedProject);
    EventBus.emit('project:duplicated', saved);
    return saved;
  },

  async deleteProject(projectId) {
    const project = await Storage.getProject(projectId);
    if (project && project.contentId) {
      await Storage.deleteContent(project.contentId);
    }
    const res = await Storage.deleteProject(projectId);
    EventBus.emit('project:deleted', projectId);
    return res;
  },

  async convertProjectGameType(project, targetGameType) {
    const content = await Storage.getContent(project.contentId);
    const conversion = ContentEngine.convertContentForGame(content, targetGameType);
    
    // Update content and project
    if (conversion.convertedContent) {
      await Storage.saveContent(conversion.convertedContent);
    }
    project.gameType = targetGameType;
    const saved = await Storage.saveProject(project);
    EventBus.emit('project:converted', saved);
    return { project: saved, warnings: conversion.warnings };
  }
};
