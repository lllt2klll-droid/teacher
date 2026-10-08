# TeacherStudio - Không Gian Sáng Tạo Trò Chơi Học Tập Dành Cho Giáo Viên Tiểu Học

Phiên bản: **1.0.0**  
Định hướng thiết kế: **Quiet Professional** (Thanh lịch, Chuẩn mực Sư phạm, Không rườm rà)  
Kiến trúc: **Client-side, Modular Native ES Modules, Local-First, Zero Backend**

---

## 🌟 Giới thiệu sản phẩm

**TeacherStudio** là ứng dụng web chuyên nghiệp hỗ trợ giáo viên tiểu học tạo các trò chơi và hoạt động học tập tương tác cho lớp học mà **không cần biết lập trình**:
- Soạn câu hỏi nhanh chóng bằng tay hoặc nhập hàng loạt.
- Tự do chuyển đổi linh hoạt giữa nhiều hình thức trò chơi với cùng một bộ câu hỏi (**"Đổi hình thức"**).
- Lựa chọn 9 chủ đề sư phạm học đường (**Lớp học bảng đen, Thiên nhiên, Đại dương, Vũ trụ, Khoa học, Toán học, Việt Nam, Lễ hội, Tối giản**).
- Xem trước trực tiếp đa thiết bị (Máy tính 16:9, Máy tính bảng 4:3, Điện thoại 9:16).
- **Xuất ra 1 file HTML độc lập duy nhất (Single HTML Export)**: Hoạt động offline 100%, không cần internet, không cần máy chủ, không phụ thuộc thư viện CDN bên ngoài, tích hợp âm thanh Web Audio API sinh động.

---

## 🎯 12 Trò chơi & Hoạt động lớp học tích hợp

1. **Quiz (Trắc nghiệm)**: Trắc nghiệm 4 lựa chọn, tính giờ, tính điểm, âm thanh phản hồi và giải thích chi tiết.
2. **Đúng / Sai**: Thẻ lựa chọn kích thước lớn, phản xạ nhanh với phím tắt 1-2 hoặc mũi tên ← →.
3. **Lật thẻ ghi nhớ (Flashcard)**: Thẻ học 3D lật 2 mặt thuật ngữ và định nghĩa, rèn luyện trí nhớ.
4. **Ghép đôi tương ứng (Matching)**: Hai cột dữ liệu đối chiếu, rèn luyện liên kết kiến thức.
5. **Kéo thả phân loại (Drag & Drop)**: Phân loại đồ vật, từ ngữ vào các nhóm chủ đề (chuột & cảm ứng).
6. **Nối ý (Connect)**: Nối các ý nghĩa tương quan trực quan.
7. **Vòng quay may mắn (Wheel)**: Vòng quay vật lý sinh động, gọi tên ngẫu nhiên học sinh hoặc quay câu hỏi.
8. **Lật mảnh ghép bí mật (Jigsaw Reveal)**: Trả lời đúng để mở từng ô tranh bí mật.
9. **Giải ô chữ vui (Crossword)**: Ô chữ theo hàng ngang/dọc củng cố từ vựng và tư duy logic.
10. **Đồng hồ đếm ngược (Classroom Timer)**: Đồng hồ số lớn, có âm thanh chuông kết thúc thảo luận nhóm.
11. **Kéo co đồng đội (Tug of War)**: Thi đua tập thể Đội Xanh vs Đội Đỏ, giải đố để kéo dây về đích.
12. **Đua xe tốc độ (Race Game)**: Tăng tốc về đích theo điểm số trả lời đúng.

---

## 🚀 Hướng dẫn khởi chạy

Do ứng dụng sử dụng chuẩn **Native ES Modules** và công nghệ lưu trữ **Local-First (IndexedDB & LocalStorage)**, bạn có thể chạy bằng bất kỳ máy chủ tĩnh nào:

### Cách 1: Chạy bằng Node.js / npx serve (Khuyên dùng)
```bash
npm start
# Hoặc: npx serve .
```
Sau đó mở trình duyệt tại địa chỉ hiển thị (ví dụ: `http://localhost:3000`).

### Cách 2: Triển khai trực tiếp lên GitHub Pages
Chỉ cần đẩy mã nguồn lên nhánh `main` hoặc `gh-pages` của GitHub Repository, kích hoạt GitHub Pages trong phần Settings là ứng dụng sẽ hoạt động trực tiếp!

---

## 📂 Cấu trúc thư mục mô-đun

```text
/
├── index.html                      # Trang chủ ứng dụng và nạp module bootstrap
├── package.json                    # Cấu hình dự án & npm scripts
├── README.md                       # Hướng dẫn chi tiết
│
├── src/
│   ├── app/
│   │   ├── app.js                  # Khung ứng dụng chính (Sidebar, Topbar)
│   │   ├── bootstrap.js            # Điểm khởi đầu ứng dụng
│   │   ├── router.js               # Điều hướng Hash-based SPA
│   │   ├── state.js                # Trạng thái ứng dụng
│   │   └── i18n.js                 # Hệ thống đa ngôn ngữ (VI/EN)
│   │
│   ├── core/
│   │   ├── game-registry.js        # Đăng ký và quản lý 12 trò chơi
│   │   ├── content-engine.js       # Quản lý câu hỏi, nhập nhanh & chuyển đổi game
│   │   ├── project-manager.js      # Vòng đời dự án, nhân bản & lưu trữ
│   │   ├── theme-engine.js         # Quản lý 9 chủ đề sư phạm
│   │   ├── template-engine.js      # Mẫu hoạt động theo pha dạy học
│   │   ├── export-engine.js        # Phát sinh Single HTML độc lập 100%
│   │   ├── validation-engine.js    # Chẩn đoán tính toàn vẹn dữ liệu
│   │   ├── history.js              # Quản lý Hoàn tác / Làm lại (Undo/Redo)
│   │   └── event-bus.js            # Hệ thống sự kiện Pub/Sub
│   │
│   ├── storage/
│   │   ├── storage.js              # API lưu trữ hợp nhất
│   │   ├── local-storage.js        # Lưu trữ thiết lập giao diện
│   │   ├── indexed-db.js           # Lưu trữ dự án & câu hỏi an toàn
│   │   └── backup.js               # Xuất nhập file sao lưu .tstudio
│   │
│   ├── games/
│   │   ├── base-game.js            # Khung lớp cơ sở trò chơi
│   │   ├── audio-synth.js          # Bộ tổng hợp âm thanh Web Audio API
│   │   ├── quiz/                   # Trò chơi Quiz trắc nghiệm
│   │   ├── true-false/             # Trò chơi Đúng / Sai
│   │   ├── flashcard/              # Trò chơi Lật thẻ ghi nhớ
│   │   ├── matching/               # Trò chơi Ghép đôi 2 cột
│   │   ├── drag-drop/              # Trò chơi Kéo thả phân loại
│   │   ├── connect/                # Trò chơi Nối ý
│   │   ├── wheel/                  # Trò chơi Vòng quay may mắn
│   │   ├── jigsaw/                 # Trò chơi Mảnh ghép bí mật
│   │   ├── crossword/              # Trò chơi Ô chữ
│   │   ├── timer/                  # Đồng hồ đếm ngược lớp học
│   │   ├── classroom/              # Kéo co & Đua xe đồng đội
│   │   └── games-library-view.js   # Màn hình thư viện trò chơi
│   │
│   ├── editor/
│   │   ├── editor.js               # Trình soạn thảo 3 cột
│   │   ├── question-editor.js      # Chỉnh sửa câu hỏi bên trái
│   │   └── game-settings-panel.js  # Chỉnh sửa chủ đề & cài đặt bên phải
│   │
│   ├── dashboard/
│   │   └── dashboard.js            # Màn hình Tổng quan giáo viên
│   ├── projects/
│   │   └── projects-view.js        # Danh sách dự án & thao tác
│   ├── content/
│   │   ├── content-library-view.js # Ngân hàng câu hỏi dùng chung
│   │   └── bulk-import-modal.js    # Modal nhập nhanh hàng loạt
│   ├── templates/
│   │   └── templates-view.js       # Thư viện mẫu sư phạm
│   ├── themes/
│   │   ├── theme-definitions.js    # Khai báo màu sắc 9 chủ đề
│   │   └── themes-gallery-view.js  # Bộ sưu tập xem trước chủ đề
│   ├── settings/
│   │   └── settings-view.js        # Trung tâm Cài đặt & Sao lưu dữ liệu
│   ├── help/
│   │   └── help-view.js            # Trung tâm Trợ giúp giáo viên
│   ├── onboarding/
│   │   └── onboarding-modal.js     # Hướng dẫn nhanh cho người dùng mới
│   │
│   ├── ui/
│   │   ├── icons.js                # Bộ icon SVG chuẩn mực
│   │   ├── notifications.js        # Thông báo Toast
│   │   ├── dialogs.js              # Hộp thoại Modal
│   │   └── command-palette.js      # Bảng lệnh nhanh Ctrl+K
│   │
│   └── styles/
│       ├── tokens.css              # Design tokens (Màu sắc Sáng/Tối, Khoảng cách)
│       ├── global.css              # Typography & CSS reset
│       ├── layout.css              # Bố cục App Shell & Editor 3 cột
│       ├── components.css          # Nút bấm, Bảng, Thẻ, Form
│       └── themes.css              # CSS cho 9 chủ đề trò chơi
│
└── test/
    └── test-engines.js             # Kịch bản kiểm thử tự động
```

---

## ⌨️ Phím tắt tiện ích
- `Ctrl + K`: Mở Bảng lệnh nhanh và tìm kiếm toàn cục.
- `Ctrl + Z`: Hoàn tác thay đổi trong Editor.
- `Ctrl + Shift + Z`: Làm lại thao tác trong Editor.
- `Esc`: Đóng bất kỳ hộp thoại hoặc modal nào.
- `Phím 1, 2, 3, 4`: Chọn đáp án trắc nghiệm trong trò chơi Quiz.
- `Phím 1 hoặc ←`, `Phím 2 hoặc →`: Chọn Đúng / Sai trong trò chơi Đúng/Sai.
- `Phím Space`: Quay vòng quay may mắn.

---

## 🔒 Bản quyền & Giấy phép
TeacherStudio tuân thủ giấy phép mã nguồn mở MIT License. Dành tặng cho các thầy cô giáo tiểu học vì sự phát triển của giáo dục sáng tạo và hạnh phúc.
