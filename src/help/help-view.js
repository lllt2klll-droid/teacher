/* ==========================================================================
   TeacherStudio Help Center (Section 35)
   ========================================================================== */

import { Icons } from '../ui/icons.js';

export const HelpView = {
  render(container) {
    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Trung tâm Trợ giúp & Hướng dẫn</h1>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
          Tài liệu hướng dẫn trực quan dành riêng cho giáo viên tiểu học.
        </p>
      </div>

      <div style="max-width: 820px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- 1. Quickstart -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 8px;">1. Quy trình 4 bước tạo trò chơi học tập</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px;">
            Thầy/Cô chỉ cần thực hiện theo luồng sư phạm đơn giản sau:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px;">
            <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border-left: 3px solid var(--color-primary);">
              <div class="font-semibold" style="font-size: 13px; margin-bottom: 4px;">Bước 1: Chọn hình thức</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Chọn Quiz, Đúng/Sai, Vòng quay, Kéo co...</div>
            </div>
            <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border-left: 3px solid var(--color-primary);">
              <div class="font-semibold" style="font-size: 13px; margin-bottom: 4px;">Bước 2: Soạn câu hỏi</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Nhập từng câu hoặc dán hàng loạt bằng nút Nhập nhanh.</div>
            </div>
            <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border-left: 3px solid var(--color-primary);">
              <div class="font-semibold" style="font-size: 13px; margin-bottom: 4px;">Bước 3: Chọn chủ đề</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Đổi màu sắc: Lớp học bảng đen, Thiên nhiên, Vũ trụ...</div>
            </div>
            <div style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; border-left: 3px solid var(--color-primary);">
              <div class="font-semibold" style="font-size: 13px; margin-bottom: 4px;">Bước 4: Xuất file HTML</div>
              <div style="font-size: 12px; color: var(--color-text-secondary);">Tải về 1 file độc lập duy nhất để trình chiếu lớp học.</div>
            </div>
          </div>
        </div>

        <!-- 2. Export HTML Guidance -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 8px;">2. Cách sử dụng file HTML đã xuất</h3>
          <ul style="font-size: 14px; color: var(--color-text); line-height: 1.6; padding-left: 20px;">
            <li><strong>Không cần Internet:</strong> File HTML chứa trọn vẹn mã nguồn, âm thanh Web Audio và dữ liệu câu hỏi. Thầy/Cô có thể mở trong lớp học dù không có wifi.</li>
            <li><strong>Trình duyệt tương thích:</strong> Mở tốt trên Google Chrome, Microsoft Edge, Cốc Cốc, Safari trên máy tính, tivi thông minh hoặc máy tính bảng.</li>
            <li><strong>Lưu trữ tiện lợi:</strong> Thầy/Cô có thể copy vào USB, gửi qua Zalo, lưu vào Google Drive hoặc tích hợp vào bài giảng PowerPoint/Canva.</li>
          </ul>
        </div>

        <!-- 3. Bulk Import Guidance -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 8px;">3. Hướng dẫn tính năng "Nhập nhanh câu hỏi"</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 12px;">
            Thay vì gõ từng câu hỏi, Thầy/Cô có thể copy từ Word hoặc tài liệu có sẵn theo mẫu phân cách bởi dấu gạch đứng (<code>|</code>):
          </p>
          <pre style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; font-size: 12px; font-family: monospace; overflow-x: auto; color: var(--color-text);">
Nội dung câu hỏi | Phương án A | Phương án B | Phương án C | Phương án D | Đáp án (A, B, C hoặc D)
Ví dụ:
Thủ đô nước ta là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
          </pre>
        </div>

        <!-- 4. Game Modes Summary -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 12px;">4. Hướng dẫn các trò chơi theo từng hoạt động học</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Quiz & Đúng/Sai:</strong> Phù hợp kiểm tra nhanh đầu giờ hoặc ôn tập giữa tiết.
            </div>
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Vòng quay may mắn:</strong> Chọn học sinh ngẫu nhiên phát biểu bài hoặc nhận thưởng.
            </div>
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Kéo co & Đua xe:</strong> Chia đội thi đua tập thể, tăng cường tương tác đồng đội.
            </div>
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Lật mảnh ghép bí mật:</strong> Khơi gợi hứng thú giới thiệu bài học mới.
            </div>
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Ghép đôi & Kéo thả:</strong> Phân loại nhóm sự vật, rèn luyện tư duy đối chiếu.
            </div>
            <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: 6px;">
              <strong>Đồng hồ đếm ngược:</strong> Giúp học sinh quản lý thời gian thảo luận nhóm hiệu quả.
            </div>
          </div>
        </div>

      </div>
    `;
  }
};
