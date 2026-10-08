/* ==========================================================================
   TeacherStudio Application Bootstrap Entry Point
   ========================================================================== */

import { App } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  App.init().catch(err => {
    console.error('Fatal initialization error:', err);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:sans-serif;padding:20px;text-align:center;">
        <h2 style="color:#B45454;margin-bottom:12px;">Đã xảy ra lỗi khi khởi động ứng dụng</h2>
        <p style="color:#666;max-width:480px;margin-bottom:20px;">${err.message}</p>
        <button onclick="location.reload()" style="padding:10px 20px;background:#3F5F55;color:#FFF;border:none;border-radius:6px;cursor:pointer;">Tải lại trang</button>
      </div>
    `;
  });
});
