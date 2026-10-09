/* ==========================================================================
   TeacherStudio Modal Dialogs & Sheets
   ========================================================================== */

import { Icons } from './icons.js';
import { GameRegistry } from '../core/game-registry.js';
import { ExportEngine } from '../core/export-engine.js';
import { THEMES } from '../themes/theme-definitions.js';

export const Dialogs = {
  createModal({ title, contentHtml, footerHtml = '', maxWidth = '560px' }) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    const content = document.createElement('div');
    content.className = 'modal-content';
    if (maxWidth) content.style.maxWidth = maxWidth;

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title font-semibold" style="font-size: 17px;">${title}</h3>
        <button class="btn btn-icon btn-close" aria-label="Đóng">${Icons.get('x')}</button>
      </div>
      <div class="modal-body">
        ${contentHtml}
      </div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    const close = () => {
      if (backdrop.parentElement) {
        document.body.removeChild(backdrop);
      }
    };

    content.querySelector('.btn-close').onclick = close;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };

    return { backdrop, content, close };
  },

  confirm({ title = 'Xác nhận thao tác', message, confirmText = 'Xác nhận', isDanger = false, onConfirm }) {
    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} btn-confirm">${confirmText}</button>
    `;

    const modal = this.createModal({
      title,
      contentHtml: `<p style="font-size: 15px; line-height: 1.5; color: var(--color-text);">${message}</p>`,
      footerHtml
    });

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();
    modal.content.querySelector('.btn-confirm').onclick = () => {
      modal.close();
      if (onConfirm) onConfirm();
    };

    return modal;
  },

  showNewProjectModal(onCreated) {
    const games = GameRegistry.getAll();
    const themes = THEMES;

    const contentHtml = `
      <form id="form-new-project">
        <div class="form-group">
          <label class="form-label">Tên hoạt động / Trò chơi *</label>
          <input type="text" class="input" id="inp-proj-name" placeholder="Ví dụ: Ôn tập Làm tròn số thập phân" required autofocus>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Môn học</label>
            <select class="select" id="inp-proj-subject">
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
              <option value="Đạo đức">Đạo đức</option>
              <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Khối lớp</label>
            <select class="select" id="inp-proj-grade">
              <option value="Lớp 1">Lớp 1</option>
              <option value="Lớp 2">Lớp 2</option>
              <option value="Lớp 3">Lớp 3</option>
              <option value="Lớp 4">Lớp 4</option>
              <option value="Lớp 5" selected>Lớp 5</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Hình thức trò chơi</label>
          <select class="select" id="inp-proj-game">
            ${games.map(g => `<option value="${g.id}">${g.name} - ${g.pedagogy}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Chủ đề giao diện (Theme)</label>
          <select class="select" id="inp-proj-theme">
            ${themes.map(t => `<option value="${t.id}">${t.name} (${t.description.slice(0, 32)}...)</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Ghi chú / Mô tả ngắn</label>
          <input type="text" class="input" id="inp-proj-desc" placeholder="Dành cho hoạt động khởi động 5 phút">
        </div>
      </form>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn btn-primary btn-submit">Tạo trò chơi</button>
    `;

    const modal = this.createModal({
      title: 'Tạo trò chơi mới',
      contentHtml,
      footerHtml
    });

    const form = modal.content.querySelector('#form-new-project');
    const submitBtn = modal.content.querySelector('.btn-submit');
    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();

    const handleSubmit = (e) => {
      e.preventDefault();
      const name = modal.content.querySelector('#inp-proj-name').value.trim();
      if (!name) return;
      const subject = modal.content.querySelector('#inp-proj-subject').value;
      const grade = modal.content.querySelector('#inp-proj-grade').value;
      const gameType = modal.content.querySelector('#inp-proj-game').value;
      const themeId = modal.content.querySelector('#inp-proj-theme').value;
      const description = modal.content.querySelector('#inp-proj-desc').value.trim();

      modal.close();
      if (onCreated) {
        onCreated({ name, subject, grade, gameType, themeId, description });
      }
    };

    form.onsubmit = handleSubmit;
    submitBtn.onclick = handleSubmit;
    return modal;
  },

  showChangeGameModal(currentGameType, onSelect) {
    const games = GameRegistry.getAll();
    const contentHtml = `
      <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px;">
        Toàn bộ câu hỏi và nội dung hiện tại sẽ được giữ nguyên và tự động ánh xạ sang định dạng trò chơi mới.
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 380px; overflow-y: auto;">
        ${games.map(g => `
          <button class="btn btn-secondary game-select-card ${g.id === currentGameType ? 'active' : ''}" 
            data-id="${g.id}" 
            style="display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding: 12px; gap: 4px; border: 2px solid ${g.id === currentGameType ? 'var(--color-primary)' : 'var(--color-border)'};">
            <div class="font-semibold" style="font-size: 15px;">${g.name}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">${g.pedagogy}</div>
          </button>
        `).join('')}
      </div>
    `;

    const modal = this.createModal({
      title: 'Đổi hình thức trò chơi',
      contentHtml
    });

    modal.content.querySelectorAll('.game-select-card').forEach(card => {
      card.onclick = () => {
        const selectedId = card.getAttribute('data-id');
        modal.close();
        if (onSelect) onSelect(selectedId);
      };
    });

    return modal;
  },

  showDiagnosticsModal(validationResult, onConfirmExport, project = {}) {
    const { isValid, checks } = validationResult;
    const gameName = project.gameType || 'quiz';
    const contentHtml = `
      <div style="font-size: 14px; margin-bottom: 16px; color: var(--color-text-secondary);">
        Hệ thống tự động kiểm tra tính toàn vẹn của dữ liệu và đảm bảo file HTML độc lập có thể hoạt động hoàn hảo:
      </div>
      <div class="flex flex-col gap-2" style="margin-bottom: 20px;">
        ${checks.map(c => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 14px; background: ${c.status === 'ok' ? 'var(--color-success-subtle)' : (c.status === 'warning' ? 'var(--color-warning-subtle)' : 'var(--color-danger-subtle)')}; color: ${c.status === 'ok' ? 'var(--color-success)' : (c.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)')};">
            <span style="font-weight: 700;">${c.status === 'ok' ? '✓' : (c.status === 'warning' ? '⚠' : '✕')}</span>
            <span style="flex: 1; color: var(--color-text);">${c.message}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-bottom: 16px; border: 1px solid var(--color-border); border-radius: 10px; padding: 14px 16px;">
        <div class="font-semibold" style="font-size: 14px; margin-bottom: 4px;">Chọn kiểu file xuất (game: ${gameName})</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 12px;">
          Cả 2 kiểu đều xuất đúng hình thức trò chơi đã chọn. Khác nhau ở cách trình bày để hợp với nơi trình chiếu.
        </div>
        <label style="display: flex; gap: 10px; align-items: flex-start; padding: 10px; border: 2px solid var(--color-primary); border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
          <input type="radio" name="export-profile" value="standalone" checked style="margin-top: 4px;">
          <span>
            <strong style="font-size: 14px;">💻 Trình chiếu Offline (khuyên dùng trên lớp)</strong><br>
            <span style="font-size: 12px; color: var(--color-text-secondary);">Khung 16:9 nền đen, mở bằng Chrome/Cốc Cốc, copy USB, không cần mạng.</span>
          </span>
        </label>
        <label style="display: flex; gap: 10px; align-items: flex-start; padding: 10px; border: 1px solid var(--color-border); border-radius: 8px; cursor: pointer;">
          <input type="radio" name="export-profile" value="canva" style="margin-top: 4px;">
          <span>
            <strong style="font-size: 14px;">🖼️ Nhúng vào Canva / Website</strong><br>
            <span style="font-size: 12px; color: var(--color-text-secondary);">Nền trong suốt, full chiều rộng iframe, chữ to, tự co giãn. Cần đăng file lên link https công khai rồi dán vào Canva → Embeds.</span>
          </span>
        </label>
      </div>
      <div class="card" style="padding: 12px 16px; background: var(--color-surface-subtle);">
        <div style="font-size: 13px; color: var(--color-text-secondary);">
          💡 <strong>Lưu ý Canva:</strong> Canva không cho tải file .html lên trực tiếp. Sau khi tải file ở đây,
          cô đăng file lên Netlify Drop / itch.io / GitHub Pages để lấy link https, rồi vào Canva → Embeds → dán link.
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary btn-cancel">Hủy</button>
      <button class="btn btn-primary btn-export" ${!isValid ? 'disabled' : ''}>
        ${Icons.get('download')} Tải file HTML ngay
      </button>
    `;

    const modal = this.createModal({
      title: 'Kiểm tra chẩn đoán trước khi xuất file',
      contentHtml,
      footerHtml,
      maxWidth: '620px'
    });

    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();
    const exportBtn = modal.content.querySelector('.btn-export');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const checked = modal.content.querySelector('input[name="export-profile"]:checked');
        const profile = checked ? checked.value : 'standalone';
        modal.close();
        if (onConfirmExport) onConfirmExport(profile);
      };
    }

    return modal;
  },

  showExportSuccessModal({ filename, profile, gameType }) {
    const isCanva = profile === 'canva';
    const contentHtml = `
      <div style="font-size: 14px; margin-bottom: 12px;">
        ✅ Đã tải <strong>"${filename}"</strong> (${gameType}, kiểu ${isCanva ? 'Canva Embed' : 'Offline 16:9'}).
      </div>
      ${isCanva ? `
      <div style="border: 1px solid var(--color-border); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px;">
        <div class="font-semibold" style="font-size: 14px; margin-bottom: 8px;">3 bước đưa game vào Canva (bắt buộc qua link https):</div>
        <ol style="font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0;">
          <li>Mở <strong>Netlify Drop</strong> (app.netlify.com/drop) → kéo file <strong>${filename}</strong> vào → nhận link https công khai.</li>
          <li>Trong Canva: <strong>Ứng dụng → Embeds → dán link</strong> → game hiện trực tiếp trong thiết kế. Nếu bị chặn toàn màn hình, HS bấm nút <strong>↗ Mở tab mới</strong> trong game.</li>
          <li>Dán link vào ô bên dưới để lấy mã nhúng & QR cho HS quét:</li>
        </ol>
        <div class="form-group" style="margin-top: 12px;">
          <label class="form-label">Link https của game sau khi đăng:</label>
          <div style="display: flex; gap: 8px;">
            <input type="url" class="input" id="inp-public-url" placeholder="https://ten-game.netlify.app/..." style="flex: 1;">
            <button class="btn btn-secondary btn-sm" id="btn-make-embed">Tạo mã</button>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
            <label style="font-size: 12px;">Rộng <input id="inp-embed-w" type="number" value="1280" min="320" max="2560" style="width: 76px; padding: 4px 6px; border: 1px solid var(--color-border); border-radius: 6px;"></label>
            <label style="font-size: 12px;">Cao <input id="inp-embed-h" type="number" value="720" min="240" max="1440" style="width: 72px; padding: 4px 6px; border: 1px solid var(--color-border); border-radius: 6px;"></label>
          </div>
        </div>
        <div id="embed-result" style="display: none; margin-top: 12px;">
          <label class="form-label">Mã iframe (dán vào website / LMS):</label>
          <pre id="embed-code" style="padding: 10px; background: var(--color-surface-subtle); border-radius: 8px; font-size: 11px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;"></pre>
          <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" id="btn-copy-embed">📋 Sao chép mã nhúng</button>
            <button class="btn btn-secondary btn-sm" id="btn-copy-link">🔗 Sao chép link</button>
            <a class="btn btn-secondary btn-sm" id="btn-open-link" target="_blank" rel="noopener">↗ Mở thử game</a>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 12px; align-items: flex-start; flex-wrap: wrap;">
            <img id="img-qr" alt="QR game cho học sinh quét" style="width: 140px; height: 140px; border: 1px solid var(--color-border); border-radius: 8px; background: #fff;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px; color: var(--color-text-secondary);">QR cho HS quét bằng máy tính bảng. Tải PNG để dán vào slide Canva / in phiếu.</span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" id="btn-dl-qr">⬇ Tải QR PNG</button>
                <a class="btn btn-secondary btn-sm" id="link-qr" target="_blank" rel="noopener">🔳 Mở QR lớn</a>
              </div>
              <span id="qr-status" style="font-size: 12px;"></span>
            </div>
          </div>
        </div>
      </div>
      ` : `
      <div style="font-size: 13px; color: var(--color-text-secondary); border: 1px solid var(--color-border); border-radius: 10px; padding: 12px 16px;">
        💻 Mở file bằng Chrome / Cốc Cốc / Edge, bấm nút <strong>⛶ Toàn màn hình</strong> (phím F) để chiếu máy chiếu. Copy vào USB là dạy được, không cần mạng.
        Muốn nhúng vào Canva thì xuất lại và chọn kiểu <strong>🖼️ Nhúng vào Canva</strong>.
      </div>
      `}
    `;
    const footerHtml = `<button class="btn btn-primary btn-cancel">Xong</button>`;
    const modal = this.createModal({ title: 'Xuất file thành công', contentHtml, footerHtml, maxWidth: '640px' });
    modal.content.querySelector('.btn-cancel').onclick = () => modal.close();

    const urlInp = modal.content.querySelector('#inp-public-url');
    const mkBtn = modal.content.querySelector('#btn-make-embed');
    if (mkBtn && urlInp) {
      const renderEmbed = () => {
        const url = (urlInp.value || '').trim();
        if (!url.startsWith('https://')) {
          urlInp.style.borderColor = '#B45454';
          urlInp.focus();
          return;
        }
        urlInp.style.borderColor = '';
        const wEl = modal.content.querySelector('#inp-embed-w');
        const hEl = modal.content.querySelector('#inp-embed-h');
        const code = ExportEngine.getEmbedCode(url, wEl ? wEl.value : 1280, hEl ? hEl.value : 720);
        const box = modal.content.querySelector('#embed-result');
        const pre = modal.content.querySelector('#embed-code');
        const qr = modal.content.querySelector('#link-qr');
        const img = modal.content.querySelector('#img-qr');
        const openLink = modal.content.querySelector('#btn-open-link');
        const qrUrl = ExportEngine.buildQrUrl(url, 300);
        if (box && pre) { box.style.display = 'block'; pre.textContent = code; }
        if (qr) qr.href = qrUrl;
        if (img) img.src = qrUrl;
        if (openLink) openLink.href = url;
      };
      mkBtn.onclick = renderEmbed;
      urlInp.onkeydown = (e) => { if (e.key === 'Enter') renderEmbed(); };

      const setBtnDone = (btn, okText = '✓ Đã sao chép!') => {
        if (!btn) return;
        const old = btn.textContent;
        btn.textContent = okText;
        setTimeout(() => { btn.textContent = old; }, 1800);
      };
      const cp = modal.content.querySelector('#btn-copy-embed');
      if (cp) cp.onclick = async () => {
        const code = modal.content.querySelector('#embed-code')?.textContent || '';
        try { await ExportEngine.copyText(code); setBtnDone(cp); }
        catch (e) { cp.textContent = 'Không sao chép được'; }
      };
      const cpLink = modal.content.querySelector('#btn-copy-link');
      if (cpLink) cpLink.onclick = async () => {
        try { await ExportEngine.copyText((urlInp.value || '').trim()); setBtnDone(cpLink); }
        catch (e) { cpLink.textContent = 'Không sao chép được'; }
      };
      const dlQr = modal.content.querySelector('#btn-dl-qr');
      if (dlQr) dlQr.onclick = async () => {
        const status = modal.content.querySelector('#qr-status');
        const url = (urlInp.value || '').trim();
        try {
          if (status) status.textContent = 'Đang tải QR...';
          await ExportEngine.downloadQrPng(url, 'QR-Game-Canva.png', 600);
          if (status) status.textContent = '✓ Đã tải QR PNG!';
          setBtnDone(dlQr, '✓ Đã tải!');
        } catch (e) {
          if (status) status.textContent = 'Không tải được, cô bấm "Mở QR lớn" rồi lưu ảnh.';
        }
      };
    }
    return modal;
  }
};
