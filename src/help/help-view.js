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
            <li><strong>Toàn màn hình:</strong> File đã xuất có nút <strong>⛶ Toàn màn hình</strong> góc phải dưới (hoặc bấm phím <strong>F</strong>) để chiếu máy chiếu.</li>
            <li><strong>Chế độ giáo viên:</strong> Bật trong Thiết kế & Cài đặt → Chế độ giáo viên để hiện đáp án + giải thích ngay trong game; hoặc mở file với <code>?chedo=gv</code> ở cuối link.</li>
            <li><strong>Lưu trữ tiện lợi:</strong> Thầy/Cô có thể copy vào USB, gửi qua Zalo, lưu vào Google Drive.</li>
          </ul>
        </div>

        <!-- 2b. Canva Embed Guidance -->
        <div class="card" style="border-left: 3px solid var(--color-primary);">
          <h3 class="card-title" style="margin-bottom: 8px;">2b. Đưa game vào Canva (3 bước, bắt buộc qua link)</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 12px;">
            Canva <strong>không cho tải file .html lên trực tiếp</strong>. Khi xuất file, cô chọn kiểu
            <strong>🖼️ Nhúng vào Canva</strong> (nền trong suốt, chữ to, tự co giãn), rồi:
          </p>
          <ol style="font-size: 14px; line-height: 1.7; padding-left: 20px; margin: 0;">
            <li><strong>Đăng file lấy link:</strong> mở <strong>app.netlify.com/drop</strong> (miễn phí, không cần tài khoản phức tạp) → kéo file <code>_Canva-Embed.html</code> vào → nhận link https công khai.</li>
            <li><strong>Nhúng vào Canva:</strong> trong thiết kế Canva → <strong>… Thêm → &lt;&gt; Embeds → dán link</strong> → game chạy trực tiếp trong slide/trang.</li>
            <li><strong>QR cho học sinh:</strong> dán link vào ô trong hộp thoại xuất file để lấy mã iframe + QR cho HS quét bằng máy tính bảng.</li>
          </ol>
        </div>

        <!-- 2c. Images, TTS, Word/Excel -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 8px;">2c. Ảnh minh họa, đọc to & nhập từ Word/Excel</h3>
          <ul style="font-size: 14px; color: var(--color-text); line-height: 1.6; padding-left: 20px;">
            <li><strong>Ảnh minh họa:</strong> trong chi tiết từng câu hỏi → <strong>🖼️ Thêm ảnh minh họa</strong> (JPG/PNG, máy tự nén gọn). Ảnh theo vào file xuất, vẫn mở offline.</li>
            <li><strong>Đọc to:</strong> mỗi câu hỏi trong game có nút <strong>🔊 Đọc</strong> (giọng Việt). Bật/tắt trong Thiết kế & Cài đặt → Nút đọc to câu hỏi.</li>
            <li><strong>Từ Word/Excel:</strong> bôi đen bảng câu hỏi trong Word/Excel → Copy → dán thẳng vào <strong>Nhập nhanh</strong> (máy tự tách cột TAB). Hoặc tải file <strong>.csv</strong> lên, có sẵn nút tải file mẫu.</li>
            <li><strong>Danh sách lớp:</strong> tab <strong>👩‍🏫 Danh sách lớp</strong> trong Nhập nhanh — mỗi dòng 1 tên, dùng cho Vòng quay gọi tên.</li>
            <li><strong>Kéo thả phân loại:</strong> soạn theo quy ước <em>mục → nhóm</em>: câu hỏi là tên mục, các phương án là tên nhóm (tối đa 4 nhóm), đáp án đúng là nhóm chứa mục đó. Ví dụ: <code>Gà | Động vật | Thực vật | A</code>.</li>
            <li><strong>Ô chữ:</strong> đáp án đúng của mỗi câu chính là từ khóa (máy tự bỏ dấu khi chấm, HS gõ không dấu). Nối ý/Ghép đôi: câu hỏi → đáp án đúng thành 1 cặp.</li>
          </ul>
        </div>

        <!-- 3. Bulk Import Guidance -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 8px;">3. Hướng dẫn tính năng "Nhập nhanh câu hỏi"</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 12px;">
            Thay vì gõ từng câu hỏi, Thầy/Cô có thể copy từ Word, Excel hoặc tài liệu có sẵn.
            Máy tự nhận diện cả dấu <code>|</code> lẫn cột TAB (paste bảng Word/Excel):
          </p>
          <pre style="padding: 12px; background: var(--color-surface-subtle); border-radius: 8px; font-size: 12px; font-family: monospace; overflow-x: auto; color: var(--color-text);">
Nội dung câu hỏi | Phương án A | Phương án B | Phương án C | Phương án D | Đáp án (A, B, C hoặc D)
Ví dụ:
Thủ đô nước ta là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
Danh sách lớp (tab Vòng quay): mỗi dòng 1 tên học sinh.
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
