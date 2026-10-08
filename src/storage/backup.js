/* ==========================================================================
   TeacherStudio Backup & Restore Engine (.tstudio)
   ========================================================================== */

import { Storage } from './storage.js';

export const BackupEngine = {
  async exportBackup() {
    const data = await Storage.exportAllData();
    const backupPayload = {
      format: 'tstudio',
      version: 1,
      createdAt: new Date().toISOString(),
      appName: 'TeacherStudio',
      data
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `TeacherStudio_Backup_${dateStr}.tstudio`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  },

  async validateBackupFile(fileContent) {
    try {
      const parsed = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent;
      if (!parsed || parsed.format !== 'tstudio') {
        return { valid: false, error: 'Định dạng file không hợp lệ (không phải file .tstudio)' };
      }
      if (!parsed.data || !Array.isArray(parsed.data.projects)) {
        return { valid: false, error: 'Cấu trúc dữ liệu bên trong file sao lưu bị lỗi' };
      }
      return {
        valid: true,
        summary: {
          version: parsed.version,
          createdAt: parsed.createdAt,
          projectsCount: parsed.data.projects?.length || 0,
          contentsCount: parsed.data.contents?.length || 0
        },
        payload: parsed
      };
    } catch (e) {
      return { valid: false, error: 'Không thể đọc nội dung file JSON: ' + e.message };
    }
  },

  async restoreBackup(backupPayload, mode = 'merge') {
    // mode: 'merge' (giữ lại và gộp thêm) | 'replace' (xóa trắng và ghi đè)
    if (!backupPayload || !backupPayload.data) {
      throw new Error('Dữ liệu sao lưu không hợp lệ');
    }
    return await Storage.importAllData(backupPayload.data, mode);
  }
};
