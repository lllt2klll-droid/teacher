# TeacherStudio --- Complete AI Agent Development Specification

Version: 1.0\
Product: TeacherStudio\
Target: Static web application for primary-school teachers\
Deployment: GitHub Pages / static hosting\
Primary language: Vietnamese\
Architecture: Client-side, modular, local-first, no backend required for
MVP

------------------------------------------------------------------------

# 01. PRODUCT VISION

## 1.1. Product definition

TeacherStudio là một ứng dụng web dành cho giáo viên tiểu học, cho phép
giáo viên:

-   tạo trò chơi/hoạt động tương tác;
-   nhập câu hỏi và nội dung mà không cần biết lập trình;
-   chọn giao diện/theme;
-   chỉnh các thiết lập của trò chơi;
-   xem trước trực tiếp;
-   lưu dự án;
-   sao chép/chuyển đổi nội dung sang trò chơi khác;
-   xuất thành một file HTML độc lập;
-   mở file HTML đã xuất mà không cần TeacherStudio.

TeacherStudio phải ưu tiên trải nghiệm giáo viên. Người dùng không được
yêu cầu hiểu JSON, JavaScript, API, package manager hoặc cấu trúc code.

## 1.2. Product philosophy

TeacherStudio phải giống một phần mềm chuyên nghiệp dành cho giáo viên,
không giống một AI playground.

Design direction:

> Quiet Professional

Cảm giác tổng thể:

-   tinh tế;
-   đơn giản;
-   hiện đại;
-   chuyên nghiệp;
-   nhẹ nhàng;
-   dễ hiểu;
-   ít nhiễu;
-   ưu tiên nội dung;
-   không phô trương công nghệ.

## 1.3. Core workflow

Luồng chính:

TEACHER → chọn trò chơi → nhập/tạo nội dung → chọn theme → cấu hình →
preview → kiểm tra → export → SINGLE HTML

## 1.4. Core product principles

1.  Simple before decorative.
2.  Content before decoration.
3.  Consistency before novelty.
4.  Clear before clever.
5.  Professional before futuristic.
6.  Teacher-friendly before technical.
7.  Quiet UI, expressive games.
8.  Light and Dark themes are first-class.
9.  Advanced options must remain available but unobtrusive.
10. No AI-looking visual language.
11. No unnecessary gradients.
12. No excessive glow/neon effects.
13. No excessive rounded cards.
14. No excessive emoji.
15. No decorative animation in the application shell.
16. Games may be colorful and animated.
17. Every important action must have clear Vietnamese wording.
18. Data-heavy views should use tables.
19. Visual/game libraries should use cards.
20. Settings should use grouped sections.
21. Editor should maximize workspace.
22. Preview and export must use the same rendering logic.
23. Adding a new game must not require rewriting existing games.
24. Question/content data must be reusable across games.
25. Do not remove working features when expanding the application.

------------------------------------------------------------------------

# 02. NON-NEGOTIABLE RULES FOR THE AI AGENT

The coding agent MUST follow these rules.

## 2.1. Do not make the product look like an AI tool

DO NOT introduce:

-   futuristic dashboard;
-   holographic UI;
-   neon UI;
-   glowing borders;
-   animated gradient backgrounds;
-   particle backgrounds;
-   AI sparkles everywhere;
-   robot illustrations;
-   floating AI orbs;
-   excessive glassmorphism;
-   excessive blur;
-   excessive purple/blue AI gradients;
-   giant marketing headlines;
-   unnecessary words such as "Magic", "AI Magic", "Copilot",
    "Intelligence".

Do not put an AI icon beside ordinary actions.

Example:

BAD: `✨ AI Magic Generate`

GOOD: `Tạo trò chơi`

## 2.2. Do not overuse technical language

Normal teacher-facing UI should avoid:

-   JSON;
-   schema;
-   payload;
-   runtime;
-   API;
-   component;
-   renderer;
-   plugin;
-   manifest;
-   dependency.

If a technical concept must be exposed, translate it into
teacher-friendly wording.

Examples:

-   `Export` → `Xuất file`
-   `Preview` → `Xem trước`
-   `Template` → `Mẫu`
-   `Theme` → `Chủ đề`
-   `Settings` → `Cài đặt`
-   `Question Bank` → `Thư viện câu hỏi`
-   `Backup` → `Sao lưu`
-   `Restore` → `Khôi phục`

## 2.3. No destructive shortcuts

Never:

-   delete existing projects without confirmation;
-   overwrite a project without warning when the action can cause data
    loss;
-   silently discard unsaved changes;
-   clear all data from a normal button;
-   execute imported arbitrary HTML with full application privileges.

## 2.4. No hard-coded game content

Game mechanics must never own a hard-coded teacher question set.

Questions/content must come from the Content Engine.

## 2.5. No theme hard-coding inside games

Games must consume Theme Tokens.

A game may define semantic slots such as:

-   background;
-   primary;
-   secondary;
-   success;
-   danger;
-   text;
-   card;
-   accent.

It must not permanently hard-code a particular theme's visual values.

------------------------------------------------------------------------

# 03. APPLICATION ARCHITECTURE

TeacherStudio consists of the following layers:

1.  Application Shell
2.  Dashboard
3.  Project Manager
4.  Content Engine
5.  Game Registry
6.  Game Engine
7.  Theme Engine
8.  Template Engine
9.  Editor
10. Preview Renderer
11. Export Engine
12. Storage Layer
13. Diagnostics
14. Accessibility Layer
15. Help / Onboarding
16. Settings

Conceptual architecture:

TEACHER ↓ APPLICATION SHELL ↓ PROJECT ├── CONTENT ├── GAME ├── THEME ├──
SETTINGS └── VIEWPORT ↓ GAME ENGINE ↓ RENDERER ↓ PREVIEW ↓ VALIDATION ↓
EXPORT ENGINE ↓ SINGLE HTML

------------------------------------------------------------------------

# 04. RECOMMENDED PROJECT STRUCTURE

Use a modular structure similar to:

``` text
/
├── index.html
├── README.md
├── package.json
│
├── src/
│   ├── app/
│   │   ├── app.js
│   │   ├── router.js
│   │   ├── state.js
│   │   └── bootstrap.js
│   │
│   ├── core/
│   │   ├── game-engine.js
│   │   ├── game-registry.js
│   │   ├── project-manager.js
│   │   ├── content-engine.js
│   │   ├── theme-engine.js
│   │   ├── template-engine.js
│   │   ├── export-engine.js
│   │   ├── validation-engine.js
│   │   ├── history.js
│   │   └── event-bus.js
│   │
│   ├── storage/
│   │   ├── storage.js
│   │   ├── local-storage.js
│   │   ├── indexed-db.js
│   │   └── backup.js
│   │
│   ├── dashboard/
│   ├── projects/
│   ├── content/
│   ├── editor/
│   ├── preview/
│   ├── settings/
│   ├── help/
│   ├── onboarding/
│   ├── diagnostics/
│   │
│   ├── games/
│   │   ├── quiz/
│   │   ├── true-false/
│   │   ├── flashcard/
│   │   ├── matching/
│   │   ├── drag-drop/
│   │   ├── connect/
│   │   ├── wheel/
│   │   ├── jigsaw/
│   │   ├── crossword/
│   │   ├── timer/
│   │   ├── minefield/
│   │   ├── race/
│   │   ├── boat-race/
│   │   ├── tug-of-war/
│   │   ├── train/
│   │   ├── secret-lock/
│   │   ├── flying-words/
│   │   ├── duck-race/
│   │   ├── turn-based/
│   │   ├── mind-map/
│   │   ├── treasure-hunt/
│   │   ├── journey/
│   │   ├── battle/
│   │   ├── zombie/
│   │   ├── fruit/
│   │   ├── catch/
│   │   ├── interactive-image/
│   │   ├── interactive-video/
│   │   ├── camera-paper/
│   │   ├── gesture/
│   │   ├── microphone/
│   │   ├── panorama/
│   │   └── gallery-3d/
│   │
│   ├── themes/
│   │   ├── minimal/
│   │   ├── classroom/
│   │   ├── nature/
│   │   ├── ocean/
│   │   ├── space/
│   │   ├── science/
│   │   ├── mathematics/
│   │   ├── vietnam/
│   │   └── festival/
│   │
│   ├── ui/
│   │   ├── components/
│   │   ├── icons/
│   │   ├── dialogs/
│   │   ├── forms/
│   │   └── feedback/
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   ├── themes.css
│   │   └── responsive.css
│   │
│   └── utils/
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── sounds/
│   └── illustrations/
│
└── docs/
```

If the existing environment uses another framework, preserve the same
architectural separation even if filenames differ.

------------------------------------------------------------------------

# 05. DESIGN SYSTEM

## 5.1. Visual direction

Application shell:

-   quiet;
-   clean;
-   professional;
-   restrained;
-   neutral;
-   content-focused.

Game output:

-   can be colorful;
-   playful;
-   animated;
-   child-friendly;
-   theme-specific.

Do not confuse the two.

## 5.2. Light theme

Recommended base tokens:

``` text
Background:       #F7F7F5
Surface:          #FFFFFF
Surface subtle:   #F2F2EF
Border:           #E4E4DF
Text:             #242424
Text secondary:   #6B6B67
Primary:          #3F5F55
Primary hover:    #354F47
Success:          #4D7A5A
Warning:          #A67832
Danger:           #B45454
```

These are defaults, not immutable values.

## 5.3. Dark theme

``` text
Background:       #171816
Surface:          #20221F
Surface subtle:   #292B27
Border:           #373934
Text:             #F0F0EA
Text secondary:   #A7A9A2
Primary:          #8DAE9F
Success:          #83A68A
Warning:          #C5A266
Danger:           #C98282
```

Never use pure black as the default dark background.

## 5.4. UI themes

At minimum:

-   Light
-   Dark
-   System

Optional accent presets:

-   Forest
-   Blue
-   Terracotta
-   Violet
-   Amber
-   Slate

Accent color must be restrained.

## 5.5. Typography

Preferred:

-   Be Vietnam Pro
-   system fallback

Fallback:

``` text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Recommended scale:

``` text
Page title:       24px / 600
Section title:    16px / 600
Body:             14px / 400
Secondary:        13px / 400
Metadata:         12px / 400
```

Do not use oversized marketing typography.

## 5.6. Spacing

Use a consistent spacing scale:

``` text
4
8
12
16
20
24
32
40
48
```

## 5.7. Radius

Recommended:

``` text
Button:       8px
Input:        8px
Card:         10–12px
Dialog:       12px
Chip:         6px
```

Do not make every object heavily rounded.

## 5.8. Shadows

Use borders first.

Shadows only when needed for:

-   dropdown;
-   modal;
-   floating toolbar;
-   popup;
-   elevated interactive surfaces.

## 5.9. Icons

Use one consistent line-icon family.

Prefer Lucide or equivalent.

Do not mix several icon libraries.

Emoji must not be used as the main application navigation icon system.

## 5.10. Motion

Default transition:

``` text
150–250ms
```

Use motion for:

-   hover;
-   focus;
-   opening/closing;
-   state changes;
-   feedback.

Do not animate the application background continuously.

Support:

``` text
Reduced motion
```

------------------------------------------------------------------------

# 06. APPLICATION SHELL

## 6.1. Desktop layout

``` text
┌───────────────────────────────────────────────────────────────┐
│ TeacherStudio     Search              Notifications   Profile │
├───────────────┬───────────────────────────────────────────────┤
│ Tổng quan     │                                               │
│ Trò chơi      │                                               │
│ Dự án         │                    MAIN CONTENT               │
│ Nội dung      │                                               │
│ Chủ đề        │                                               │
│ Mẫu           │                                               │
│ Lớp học       │                                               │
│ Hoạt động     │                                               │
│               │                                               │
│ Cài đặt       │                                               │
│ Trợ giúp      │                                               │
└───────────────┴───────────────────────────────────────────────┘
```

## 6.2. Sidebar

Primary sections:

Workspace: - Tổng quan - Trò chơi - Dự án - Thư viện nội dung - Chủ đề -
Mẫu

Teaching: - Lớp học - Hoạt động

System: - Cài đặt - Trợ giúp - Giới thiệu

Sidebar must support collapsed mode.

Collapsed mode:

-   icons;
-   tooltip;
-   active indicator.

## 6.3. Top bar

Contains:

-   TeacherStudio logo/name;
-   global search;
-   optional command palette shortcut;
-   notification center;
-   save status when editing;
-   profile/preferences.

Avoid unnecessary decorative elements.

------------------------------------------------------------------------

# 07. DASHBOARD

Dashboard is a major product surface and must not be treated as an
afterthought.

## 7.1. Dashboard objective

Teacher should immediately understand:

-   what can be done;
-   what was recently edited;
-   what can be continued;
-   what templates are available;
-   how many projects exist.

## 7.2. Dashboard layout

``` text
TeacherStudio

Chào Thầy/Cô 👋

Tạo nhanh
[ + Tạo trò chơi ]
[ Tạo từ bộ câu hỏi ]
[ Dùng mẫu ]
[ Nhập dự án ]

Tiếp tục
[ project gần nhất ]

Dự án của tôi
────────────────────────────────────────

Tên                 Môn       Loại      Cập nhật

Làm tròn số          Toán 5    Quiz      Hôm nay
Ô nhiễm đất          Khoa học  Kéo thả   Hôm qua

Mẫu thường dùng
[ Quiz ] [ Vòng quay ] [ Ô chữ ] [ Kho báu ]

Hoạt động gần đây
...
```

## 7.3. Dashboard statistics

Optional lightweight statistics:

-   số dự án;
-   số trò chơi;
-   số mẫu;
-   số lần xuất HTML.

Do not make statistics the focus.

## 7.4. Teaching workflow

Dashboard may suggest games by teaching phase:

Khởi động: - Quiz nhanh - Đúng/Sai - Vòng quay - Randomizer

Khám phá: - Kéo thả - Ảnh tương tác - Video tương tác - Sơ đồ tư duy

Luyện tập: - Quiz - Ghép đôi - Nối ý - Ô chữ

Vận dụng: - Kho báu - Hành trình - Đua xe - Game theo lượt

Củng cố: - Lật mảnh ghép - Vòng quay - Đua thuyền - Kéo co

This is guidance, not mandatory automation.

## 7.5. Empty state

Never show a blank dashboard.

If no project:

``` text
Chưa có dự án

Tạo trò chơi đầu tiên để bắt đầu.

[ + Tạo trò chơi ]
[ Xem mẫu ]
```

------------------------------------------------------------------------

# 08. PROJECT MANAGEMENT

## 8.1. Project fields

``` js
{
  id,
  name,
  subject,
  grade,
  description,
  gameType,
  contentId,
  themeId,
  settings,
  viewport,
  tags,
  createdAt,
  updatedAt,
  version
}
```

## 8.2. Project list

Use table by default.

Columns:

-   Tên
-   Môn
-   Khối
-   Trò chơi
-   Chủ đề
-   Cập nhật
-   Trạng thái
-   Thao tác

Actions:

-   Mở
-   Chỉnh sửa
-   Nhân bản
-   Đổi tên
-   Xuất
-   Xóa

## 8.3. Project tags

Examples:

``` text
#Toán5
#ÔnTập
#KhởiĐộng
#35phút
#Nhóm
```

Tags must be optional.

## 8.4. Recent projects

Show the most recently updated projects first.

------------------------------------------------------------------------

# 09. GAME LIBRARY

Game library should use cards because visual preview is useful.

Each game card:

``` text
[Preview]

Tên game
Mô tả ngắn

Phù hợp:
Quiz / Luyện tập / Củng cố

[ Dùng game ]
```

Filters:

-   Tất cả
-   Trắc nghiệm
-   Ghép/nối
-   Kéo thả
-   Trò chơi
-   Tương tác
-   Nâng cao

Search must work.

Sort:

-   Phổ biến
-   Gần đây
-   Tên A-Z

No fake popularity numbers unless real data exists.

------------------------------------------------------------------------

# 10. CONTENT ENGINE

The Content Engine is one of the most important architectural layers.

## 10.1. Purpose

Store reusable teacher content separately from game mechanics.

The same content should be usable in multiple games.

Example:

One question set can become:

-   Quiz;
-   Vòng quay;
-   Dò mìn;
-   Đua xe;
-   Kéo co;
-   Đoàn tàu;
-   Kho báu.

Teacher must not re-enter questions.

## 10.2. Content types

At minimum:

-   Question
-   Task
-   Information
-   Media

## 10.3. Question schema

``` js
{
  id,
  type,
  question,
  answers,
  correctAnswer,
  explanation,
  image,
  audio,
  video,
  points,
  timeLimit,
  difficulty,
  tags,
  metadata
}
```

## 10.4. Supported question types

At minimum:

-   single choice;
-   multiple choice;
-   true/false;
-   short answer;
-   ordering;
-   matching;
-   drag/drop;
-   open task.

Each game may support only a subset.

## 10.5. Content editor

Teacher should see:

``` text
Câu 1

Câu hỏi
[........................................]

Phương án
○ A [.........................]
○ B [.........................]
○ C [.........................]
○ D [.........................]

Đáp án đúng
[ A ▼ ]

Giải thích
[........................................]

Điểm
[10]

Thời gian
[30] giây
```

Never expose JSON.

## 10.6. Bulk input

Provide a convenient bulk editor.

Example:

``` text
Câu 1 | Thủ đô Việt Nam là gì? | Hà Nội | Huế | Đà Nẵng | Cần Thơ | A
Câu 2 | ...
```

Also provide paste-and-parse assistance.

Parser must preview results before importing.

------------------------------------------------------------------------

# 11. CHANGE GAME / CONVERT CONTENT

A critical feature.

Button:

> Đổi hình thức

When clicked:

``` text
Bộ câu hỏi hiện tại

[ Quiz ]
[ Vòng quay ]
[ Dò mìn ]
[ Đua xe ]
[ Kéo co ]
[ Ô chữ ]
...
```

Teacher selects another game.

System should:

1.  keep the same content;
2.  map compatible fields;
3.  report incompatible fields;
4.  ask for only missing settings;
5.  create a new project or preserve the original based on user choice.

Never silently destroy the original game.

------------------------------------------------------------------------

# 12. GAME REGISTRY

Games must be registered through a central registry.

Conceptual API:

``` js
registerGame({
  id: "quiz",
  name: "Quiz",
  category: "quiz",
  description: "...",
  supportedContentTypes: [...],
  settingsSchema: {...},
  editor: ...,
  renderer: ...,
  validator: ...,
  exporter: ...
});
```

Game registry must support:

-   discovery;
-   lazy loading;
-   metadata;
-   compatibility checking;
-   validation;
-   rendering;
-   export.

Adding a new game must not require modifying unrelated game code.

------------------------------------------------------------------------

# 13. GAME ENGINE

Game engine responsibilities:

-   load content;
-   initialize game state;
-   handle user input;
-   manage score;
-   manage timer;
-   randomize;
-   manage rounds;
-   trigger feedback;
-   render states;
-   emit events;
-   finish game;
-   reset/restart.

Game-specific logic stays inside its module.

------------------------------------------------------------------------

# 14. INPUT ADAPTERS

Separate input from game logic.

Supported adapters:

``` text
Mouse
Touch
Keyboard
Camera
Microphone
```

Architecture:

``` text
Mouse / Touch / Keyboard / Camera / Microphone
                    ↓
              Input Adapter
                    ↓
               Game Engine
```

Do not put camera or microphone logic directly into ordinary games.

------------------------------------------------------------------------

# 15. MINI-GAME ROADMAP

## Phase 1 --- Core MVP

1.  Quiz
2.  Đúng/Sai
3.  Lật thẻ
4.  Ghép đôi
5.  Kéo thả
6.  Nối ý
7.  Vòng quay
8.  Lật mảnh ghép
9.  Ô chữ
10. Đồng hồ đếm ngược

## Phase 2 --- Classroom Games

11. Dò mìn
12. Đua xe
13. Đua thuyền
14. Kéo co
15. Đoàn tàu
16. Khóa bí mật
17. Từ ngữ biết bay
18. Đua vịt
19. Game theo lượt
20. Sơ đồ tư duy

## Phase 3 --- Advanced Interactive

21. Săn kho báu
22. Hành trình học tập
23. Game đối kháng
24. Chặn Zombie
25. Chém hoa quả
26. Bắt bóng
27. Ảnh tương tác
28. Video tương tác

## Phase 4 --- Advanced Hardware/Media

29. Chế độ giấy
30. Camera quiz
31. Nhận diện thẻ
32. Game nghiêng đầu
33. Gesture control
34. Microphone / noise game
35. Phòng tranh 3D
36. Bảo tàng Panorama

## Future

37. AI tạo câu hỏi
38. AI chuyển nội dung thành trò chơi
39. AI gợi ý theme
40. AI phân loại độ khó

AI features are NOT part of the core MVP.

------------------------------------------------------------------------

# 16. UNIVERSAL GAME SPECIFICATION

Every game must document and implement:

-   GAME_ID
-   name;
-   category;
-   pedagogical purpose;
-   supported players;
-   supported content;
-   input schema;
-   configuration;
-   game rules;
-   game flow;
-   start state;
-   playing state;
-   correct state;
-   incorrect state;
-   paused state;
-   finished state;
-   win condition;
-   lose condition;
-   scoring;
-   timer;
-   randomization;
-   animation;
-   sound;
-   mouse;
-   touch;
-   keyboard;
-   mobile;
-   desktop;
-   theme;
-   accessibility;
-   validation;
-   preview;
-   export;
-   edge cases.

------------------------------------------------------------------------

# 17. CORE GAME DETAILS

## 17.1. Quiz

Purpose: - question answering.

Features: - one/multiple choice; - optional timer; - score; - question
counter; - shuffle; - feedback; - explanation; - final result.

Flow:

Start → Question → Answer → Feedback → Next → Result

Settings:

-   number of questions;
-   timer;
-   shuffle;
-   show answer;
-   show explanation;
-   score;
-   lives.

## 17.2. True/False

Two large choices:

``` text
ĐÚNG
SAI
```

Must support keyboard:

-   Left/Right
-   1/2

## 17.3. Flashcard

Front: - question/term/image.

Back: - answer/explanation.

Controls:

-   Lật thẻ
-   Trước
-   Sau
-   Hoàn thành

## 17.4. Matching

Two columns.

Teacher maps pairs.

Game:

-   select item A;
-   select item B;
-   correct → matched;
-   incorrect → feedback;
-   complete → result.

## 17.5. Drag & Drop

Objects can be dragged into targets.

Must support touch.

Important: - visible drop target; - snap animation; - incorrect
placement feedback; - reset.

## 17.6. Connect

Connect related items.

Must support:

-   mouse;
-   touch.

Connection line should be clear and accessible.

## 17.7. Wheel

Input:

-   options;
-   labels;
-   optional questions.

Features:

-   spin;
-   random result;
-   sound;
-   animation;
-   remove used option;
-   reset.

## 17.8. Jigsaw Reveal

Teacher supplies:

-   image;
-   optional questions.

Each correct answer reveals a tile.

Completion reveals the full image.

## 17.9. Crossword

Input:

-   words;
-   clues;
-   answers.

Validation:

-   no duplicate conflicts;
-   grid must be valid;
-   show useful error before preview.

## 17.10. Timer

Features:

-   count down;
-   count up;
-   preset duration;
-   sound;
-   pause;
-   resume;
-   reset.

Must not require a question set.

------------------------------------------------------------------------

# 18. CLASSROOM GAME DETAILS

## 18.1. Minefield

Input:

``` js
{
  questions,
  boardSize,
  mineCount,
  lives,
  scoring
}
```

Flow:

Question → grid → selection → correct/wrong/mine → update state → next →
result

Mine hit:

-   visual feedback;
-   sound;
-   life decreases.

No lives:

-   Game Over.

All objectives completed:

-   Victory.

## 18.2. Race

Represent players as:

-   cars;
-   animals;
-   stars;
-   other theme objects.

Correct answer moves player forward.

Settings:

-   player count;
-   distance;
-   question count;
-   scoring;
-   speed animation.

## 18.3. Boat Race

Same core mechanic as race but visualized as boats.

Keep mechanic separate from visual skin.

## 18.4. Tug of War

Correct answer adds force to a team.

Settings:

-   teams;
-   points;
-   rounds;
-   tie behavior.

## 18.5. Train

Used for:

-   ordering;
-   sequence;
-   classification.

Objects can be placed into train cars.

## 18.6. Secret Lock

Questions generate numbers/symbols.

Correct answers reveal code components.

Game ends when the code is complete.

## 18.7. Flying Words

Words fly across the screen.

Teacher may configure:

-   speed;
-   word list;
-   correct target;
-   distractors.

Must include reduced-motion mode.

## 18.8. Duck Race

Same race engine with duck visuals.

## 18.9. Turn-Based

Supports:

-   Team A;
-   Team B;
-   multiple teams.

Each turn:

-   show task;
-   answer;
-   update score;
-   next team.

## 18.10. Mind Map

Support:

-   root node;
-   branches;
-   child nodes;
-   drag;
-   rename;
-   delete;
-   add node;
-   export.

------------------------------------------------------------------------

# 19. ADVANCED GAME DETAILS

## 19.1. Treasure Hunt

Game consists of sequential clues.

Flow:

Start → clue → answer → unlock next location → final treasure.

Support:

-   images;
-   text;
-   optional audio;
-   optional password.

## 19.2. Learning Journey

Map with stages.

Each stage contains an activity.

Progress must be saved in the current session.

## 19.3. Battle

Team or player versus player.

Do not imply internet multiplayer in MVP.

Use local/classroom interaction.

## 19.4. Zombie

Questions stop or defeat approaching objects.

Must remain appropriate for primary students.

Allow theme customization.

## 19.5. Fruit

Correct objects are selected/chopped.

Avoid violent visual excess.

## 19.6. Catch

Player catches correct answer objects.

Support keyboard fallback because camera/gesture should not be required.

## 19.7. Interactive Image

Teacher uploads image.

Can add hotspots.

Each hotspot can contain:

-   text;
-   image;
-   audio;
-   question.

## 19.8. Interactive Video

Teacher adds video and markers.

At marker:

-   pause;
-   question;
-   information;
-   action.

Video must work in exported HTML as far as browser file restrictions
permit.

If a browser restriction prevents local playback, show a clear
compatibility warning.

------------------------------------------------------------------------

# 20. CAMERA / MICROPHONE / GESTURE FEATURES

These are advanced features.

## 20.1. Permission

Never request camera/microphone permission on app startup.

Only request when a feature explicitly needs it.

## 20.2. Privacy

Camera and microphone data:

-   processed locally whenever possible;
-   never uploaded by MVP;
-   no hidden recording;
-   no persistence unless explicitly required and consented to.

## 20.3. Fallback

If camera is unavailable:

``` text
Không thể sử dụng camera.

Bạn vẫn có thể chơi bằng:
[ Chuột / Cảm ứng / Bàn phím ]
```

If microphone unavailable:

Use manual interaction fallback.

## 20.4. Gesture

Architecture:

Camera → local detection → gesture adapter → game engine

Never couple camera detection directly to a game.

------------------------------------------------------------------------

# 21. THEME ENGINE

Themes must be data-driven.

Example:

``` js
{
  id: "nature",
  name: "Thiên nhiên",
  colors: {...},
  typography: {...},
  components: {...},
  background: {...},
  animation: {...},
  sounds: {...}
}
```

## 21.1. Initial themes

-   Minimal
-   Classroom
-   Nature
-   Ocean
-   Space
-   Science
-   Mathematics
-   Vietnam
-   Festival

## 21.2. Theme principles

Themes may change:

-   colors;
-   background;
-   illustration;
-   button style;
-   card style;
-   sound;
-   animation;
-   decorative assets.

Themes must NOT change:

-   core game rules;
-   content data;
-   scoring logic;
-   accessibility requirements.

------------------------------------------------------------------------

# 22. TEMPLATE SYSTEM

Templates are reusable starting points.

Template contains:

-   game;
-   example structure;
-   theme;
-   default settings;
-   optional sample content.

Teacher selecting a template should create a new project.

Never modify the original template.

Categories:

-   Khởi động
-   Luyện tập
-   Củng cố
-   Ôn tập
-   Trò chơi nhóm
-   Trò chơi cá nhân

------------------------------------------------------------------------

# 23. EDITOR

## 23.1. Editor layout

Desktop:

``` text
┌──────────────────────────────────────────────────────────┐
│ ← Dự án      [Xem trước] [Hoàn tác] [Làm lại] [Xuất]   │
├──────────────┬───────────────────────────┬───────────────┤
│ Nội dung     │                           │ Thiết kế      │
│ Câu hỏi      │         PREVIEW           │ Chủ đề        │
│ Cài đặt      │                           │ Màu           │
│              │                           │ Chữ           │
│              │                           │ Hiệu ứng      │
└──────────────┴───────────────────────────┴───────────────┘
```

## 23.2. Left panel

Tabs:

-   Nội dung
-   Câu hỏi
-   Cài đặt

## 23.3. Right panel

Tabs:

-   Chủ đề
-   Màu sắc
-   Chữ
-   Hiệu ứng

Advanced controls must be collapsed by default.

## 23.4. Toolbar

At minimum:

-   Back;
-   project name;
-   undo;
-   redo;
-   preview;
-   save status;
-   export.

------------------------------------------------------------------------

# 24. PREVIEW

Preview must be powered by the same renderer used by export.

Modes:

-   Desktop
-   Tablet
-   Mobile
-   Fit
-   100%

Optional:

-   safe area;
-   grid;
-   interaction test.

Preview should not require exporting first.

------------------------------------------------------------------------

# 25. VIEWPORT SYSTEM

App viewport and game viewport are different concepts.

Game presets:

-   16:9
-   4:3
-   1:1
-   Mobile portrait
-   Custom

Example:

``` js
{
  width: 1280,
  height: 720,
  mode: "16:9"
}
```

Game should scale responsively inside its viewport.

Do not distort aspect ratio.

------------------------------------------------------------------------

# 26. RESPONSIVE DESIGN

Desktop: - full editor workspace.

Tablet: - collapsible panels.

Mobile: - stacked editor; - bottom/tab navigation for panels; - preview
prioritized.

Do not merely shrink desktop UI.

Touch targets:

Minimum practical target around 44px.

------------------------------------------------------------------------

# 27. AUTOSAVE

Show state:

``` text
Đang lưu...
Đã lưu
Đã lưu lúc 22:14
```

Autosave should be enabled by default.

Autosave must not freeze the UI.

If save fails:

``` text
Không thể tự động lưu.

[ Thử lại ]
```

Do not silently lose data.

------------------------------------------------------------------------

# 28. UNDO / REDO

Support:

-   Ctrl+Z
-   Ctrl+Shift+Z

History should operate at meaningful editor actions, not every keystroke
if that causes excessive memory use.

------------------------------------------------------------------------

# 29. SETTINGS CENTER

Settings is a major product subsystem.

Categories:

1.  Giao diện
2.  Trình chỉnh sửa
3.  Xem trước
4.  Trò chơi
5.  Xuất
6.  Dữ liệu
7.  Phím tắt
8.  Trợ năng
9.  Ngôn ngữ
10. Nâng cao

## 29.1. Giao diện

Options:

-   Sáng;
-   Tối;
-   Theo hệ thống;
-   accent color;
-   sidebar collapsed;
-   density;
-   animation.

Density:

-   Thoải mái
-   Gọn

Animation:

-   Đầy đủ
-   Giảm
-   Tắt

## 29.2. Trình chỉnh sửa

Options:

-   tự động lưu;
-   khoảng thời gian autosave;
-   mở dự án gần nhất;
-   hướng dẫn;
-   grid;
-   snap to grid;
-   xác nhận trước khi xóa.

## 29.3. Xem trước

Options:

-   thiết bị mặc định;
-   zoom mặc định;
-   safe area;
-   grid;
-   autoplay animation;
-   autoplay sound.

Autoplay sound should default to OFF due browser restrictions.

## 29.4. Trò chơi

Default settings:

-   sound;
-   correct effect;
-   wrong effect;
-   default timer;
-   default timer seconds;
-   allow skip;
-   show score;
-   shuffle.

These are defaults only.

Individual games may override them.

## 29.5. Xuất

Options:

-   Single HTML;
-   embed assets;
-   remove external dependencies;
-   optimize;
-   minify;
-   preserve viewport;
-   compatibility check.

Profiles:

-   Canva
-   Standalone
-   Lightweight

Do not claim that every external platform will support every exported
feature.

## 29.6. Dữ liệu

Show:

-   storage usage;
-   project count;
-   content count;
-   theme count;
-   template count.

Actions:

-   Export Backup
-   Import Backup
-   Clear Cache
-   Reset Application

Reset requires strong confirmation.

## 29.7. Accessibility

Options:

-   reduced motion;
-   high contrast;
-   large text;
-   keyboard navigation;
-   screen reader-friendly labels.

## 29.8. Language

Initial:

-   Vietnamese
-   English

All UI strings must be internationalized from the beginning.

Do not hard-code visible strings across components.

## 29.9. Advanced

Options:

-   debug mode;
-   experimental features;
-   performance information;
-   app version;
-   storage backend information.

Advanced section should not be visible to normal users unless expanded.

------------------------------------------------------------------------

# 30. KEYBOARD SHORTCUTS

Default:

``` text
Ctrl+S              Save
Ctrl+Z              Undo
Ctrl+Shift+Z        Redo
Ctrl+K              Command Palette
Ctrl+P              Preview
Ctrl+E              Export
Delete              Delete selected item
Esc                 Close dialog/popup
```

Display shortcuts in tooltips/help.

------------------------------------------------------------------------

# 31. GLOBAL SEARCH

Search should find:

-   projects;
-   games;
-   templates;
-   content;
-   themes;
-   settings.

Example:

User types:

`toán 5`

Results:

``` text
Dự án
- Làm tròn số

Nội dung
- Bộ câu hỏi Toán 5

Mẫu
- Quiz Toán
```

------------------------------------------------------------------------

# 32. COMMAND PALETTE

Shortcut:

`Ctrl+K`

Actions:

``` text
Tạo trò chơi
Mở dự án
Xem trò chơi
Mở thư viện câu hỏi
Mở theme
Mở cài đặt
Xem trước
Xuất HTML
Sao lưu dữ liệu
```

Command palette must be simple and fast.

------------------------------------------------------------------------

# 33. NOTIFICATIONS

Use toast notifications for:

-   saved;
-   exported;
-   imported;
-   deleted;
-   error;
-   warning.

Avoid spam.

Optional notification center for important persistent notices.

------------------------------------------------------------------------

# 34. ONBOARDING

First launch:

``` text
Chào mừng đến TeacherStudio 👋

Tạo hoạt động tương tác cho lớp học
mà không cần lập trình.

[ Tạo trò chơi ]
[ Dùng mẫu ]
[ Mở dự án ]
[ Xem hướng dẫn 1 phút ]
```

No account required.

Do not force onboarding every time.

------------------------------------------------------------------------

# 35. HELP CENTER

Sections:

-   Bắt đầu
-   Tạo trò chơi
-   Nhập câu hỏi
-   Chọn theme
-   Xem trước
-   Xuất HTML
-   Sao lưu dữ liệu
-   Hướng dẫn từng trò chơi
-   Khắc phục lỗi
-   Tương thích khi xuất

Help content should use screenshots/diagrams where useful.

------------------------------------------------------------------------

# 36. LOCAL STORAGE ARCHITECTURE

MVP must be local-first.

Use:

-   LocalStorage for lightweight settings;
-   IndexedDB for projects/content/assets when necessary.

Do not put large media directly into LocalStorage if IndexedDB is more
appropriate.

Data should be versioned.

Example:

``` js
{
  schemaVersion: 1,
  projects: [],
  contents: [],
  themes: [],
  templates: [],
  settings: {}
}
```

------------------------------------------------------------------------

# 37. BACKUP / RESTORE

Backup file:

``` text
TeacherStudio_Backup.tstudio
```

Conceptually:

``` json
{
  "format": "tstudio",
  "version": 1,
  "createdAt": "...",
  "projects": [],
  "contents": [],
  "templates": [],
  "themes": [],
  "settings": {}
}
```

User should never have to edit this file manually.

Import flow:

1.  select file;
2.  validate;
3.  show summary;
4.  choose merge/replace;
5.  confirm;
6.  import;
7.  report result.

------------------------------------------------------------------------

# 38. EXPORT ENGINE

This is a core feature.

## 38.1. Primary export

Export one standalone HTML.

Output:

``` text
my-game.html
```

The HTML should contain:

-   HTML;
-   CSS;
-   JS;
-   game data;
-   theme data;
-   embedded SVG/images;
-   embedded audio where practical.

## 38.2. No external runtime dependency

Prefer:

-   no CDN;
-   no external JS;
-   no external CSS;
-   no API calls;
-   no server dependency.

If an imported media/resource cannot be embedded, diagnostics must
identify it before export.

## 38.3. Preview/export parity

The same rendering/runtime code should be used for preview and export.

Do not create a separate visual implementation only for export.

## 38.4. File size

Show estimated size before export.

Example:

``` text
Kích thước dự kiến: 48 MB

File lớn do:
- 3 hình ảnh
- 1 video

Bạn vẫn có thể xuất.

[ Tối ưu ] [ Xuất ]
```

## 38.5. Export profiles

### Canva

-   single HTML;
-   embedded assets;
-   no external dependency;
-   compatible viewport;
-   minimal runtime requirements.

Important: do not promise universal Canva support. Show compatibility
notes.

### Standalone

Maximum feature preservation.

### Lightweight

-   optimize images;
-   reduce unnecessary assets;
-   reduce effects where possible.

------------------------------------------------------------------------

# 39. EXPORT DIAGNOSTICS

Before export run:

1.  project validation;
2.  content validation;
3.  theme validation;
4.  media validation;
5.  dependency validation;
6.  runtime validation;
7.  accessibility warnings;
8.  file size estimate.

Example:

``` text
Kiểm tra trước khi xuất

✓ Câu hỏi đầy đủ
✓ Đáp án đầy đủ
✓ Chủ đề hợp lệ
✓ Hình ảnh hợp lệ
⚠ File khá lớn: 48 MB
✓ Không phát hiện tài nguyên ngoài

[ Xem chi tiết ] [ Xuất ]
```

Errors must block export only when necessary.

Warnings should usually allow export.

------------------------------------------------------------------------

# 40. VALIDATION RULES

Examples:

Quiz:

-   must have at least one question;
-   every question must have answers;
-   correct answer must exist;
-   no broken media.

Matching:

-   every pair must be complete;
-   IDs must be unique.

Crossword:

-   grid must be valid.

Wheel:

-   at least two options unless configured otherwise.

Timer:

-   duration \> 0.

Interactive image:

-   image must exist;
-   hotspot coordinates must be valid.

------------------------------------------------------------------------

# 41. SECURITY

## 41.1. Imported HTML

Never execute arbitrary imported HTML with app privileges.

If "Game tự tạo" supports HTML import:

-   sandbox it;
-   isolate it;
-   sanitize where appropriate;
-   prevent access to parent application state;
-   prevent arbitrary storage access;
-   prevent unexpected navigation.

## 41.2. Content sanitization

Sanitize user-entered HTML where HTML input is supported.

Do not inject raw untrusted HTML with unrestricted `innerHTML`.

## 41.3. Media

Validate file types and sizes.

## 41.4. Camera/microphone

-   permission only when needed;
-   local processing;
-   explicit controls;
-   graceful fallback;
-   no hidden recording.

------------------------------------------------------------------------

# 42. ACCESSIBILITY

Must support:

-   keyboard navigation;
-   visible focus;
-   semantic labels;
-   screen reader labels;
-   sufficient contrast;
-   reduced motion;
-   large text option;
-   touch-friendly controls.

Game output must not rely on color alone.

Example:

BAD: Correct = green Wrong = red

GOOD: Correct = green + ✓ + "Đúng" Wrong = red + ✕ + "Chưa đúng"

------------------------------------------------------------------------

# 43. PERFORMANCE

Requirements:

-   lazy load game modules;
-   do not load every game at startup;
-   avoid unnecessary re-render;
-   optimize large images;
-   use IndexedDB for large data;
-   debounce search;
-   debounce autosave;
-   avoid memory leaks;
-   clean event listeners when leaving game/editor.

Dashboard should load quickly even when there are many projects.

------------------------------------------------------------------------

# 44. GITHUB PAGES

The app must work as a static application.

Do not require:

-   backend;
-   server-side rendering;
-   database server;
-   authentication server;
-   API key.

Use relative asset paths.

Handle GitHub Pages base paths correctly.

Avoid assumptions that the app is hosted at `/`.

------------------------------------------------------------------------

# 45. OFFLINE / LOCAL-FIRST BEHAVIOR

After the application is loaded and its static assets are available:

-   projects should remain usable locally;
-   editing should not require network;
-   preview should not require network;
-   export should not require network;
-   saved projects should remain available.

External network calls should not be required for core functionality.

------------------------------------------------------------------------

# 46. ERROR HANDLING

Never show raw technical errors to normal teachers.

BAD:

``` text
TypeError: Cannot read properties of undefined
```

GOOD:

``` text
Không thể mở trò chơi này.

Dữ liệu của trò chơi có thể đã bị lỗi.

[ Thử lại ]
[ Khôi phục bản sao ]
```

Developer/debug mode may expose technical details separately.

------------------------------------------------------------------------

# 47. DESIGN QA

Before considering a screen complete, the agent must check:

``` text
[ ] Không có gradient AI không cần thiết
[ ] Không có glow/neon
[ ] Không có particle background
[ ] Không có quá nhiều card
[ ] Không có quá nhiều emoji
[ ] Không có thuật ngữ kỹ thuật không cần thiết
[ ] Typography nhất quán
[ ] Spacing nhất quán
[ ] Border radius nhất quán
[ ] Light theme hoàn chỉnh
[ ] Dark theme hoàn chỉnh
[ ] Hover/focus/disabled đầy đủ
[ ] Mobile hợp lý
[ ] Primary action rõ ràng
[ ] Empty state rõ ràng
[ ] Error state rõ ràng
[ ] Loading state rõ ràng
[ ] Visual hierarchy rõ
[ ] Không có khoảng trống vô nghĩa
[ ] Không có UI clutter
[ ] Không tạo cảm giác như AI playground
```

------------------------------------------------------------------------

# 48. GAME QA

For every game:

``` text
[ ] Start works
[ ] Restart works
[ ] Reset works
[ ] Correct answer works
[ ] Wrong answer works
[ ] End condition works
[ ] Score works
[ ] Timer works if enabled
[ ] Shuffle works if enabled
[ ] Touch works
[ ] Mouse works
[ ] Keyboard works where applicable
[ ] Mobile works
[ ] Desktop works
[ ] Theme changes work
[ ] Reduced motion works
[ ] Audio failure does not break game
[ ] Missing media handled
[ ] Export works
[ ] Preview matches export
```

------------------------------------------------------------------------

# 49. PROJECT QA

Test:

-   create;
-   rename;
-   duplicate;
-   edit;
-   autosave;
-   undo;
-   redo;
-   close;
-   reopen;
-   delete;
-   export;
-   import backup;
-   restore;
-   search;
-   filter.

------------------------------------------------------------------------

# 50. EXPORT QA

For every exported game:

1.  Export.
2.  Open generated HTML independently.
3.  Disable network.
4.  Run game.
5.  Test all interactions.
6.  Test mobile viewport.
7.  Test desktop viewport.
8.  Verify assets.
9.  Verify audio.
10. Verify theme.
11. Verify game completion.
12. Verify restart.
13. Verify no console-critical errors.

------------------------------------------------------------------------

# 51. CONTENT COMPATIBILITY MATRIX

The system should know which games support which content.

Example:

  Game          Single choice   True/False   Matching   Ordering   Media
  ----------- --------------- ------------ ---------- ---------- -------
  Quiz                      ✓            ✓         \-         \-       ✓
  Đúng/Sai                 \-            ✓         \-         \-       ✓
  Flashcard                 ✓            ✓         \-         \-       ✓
  Matching                 \-           \-          ✓         \-       ✓
  Drag Drop                \-           \-          ✓          ✓       ✓
  Wheel                     ✓            ✓         \-         \-       ✓
  Crossword                \-           \-         \-          ✓      \-

The actual matrix should be extensible.

------------------------------------------------------------------------

# 52. TEACHER-FIRST LANGUAGE

Use Vietnamese labels naturally.

Preferred:

-   Tạo trò chơi
-   Chỉnh sửa
-   Xem trước
-   Xuất file
-   Lưu
-   Đổi hình thức
-   Dùng mẫu
-   Sao chép
-   Nhân bản
-   Cài đặt
-   Thư viện
-   Nội dung
-   Chủ đề
-   Câu hỏi
-   Đáp án
-   Giải thích
-   Thời gian
-   Điểm
-   Bắt đầu
-   Chơi lại
-   Hoàn thành

Avoid unnecessary English UI.

English support can be implemented through i18n, but Vietnamese is the
default.

------------------------------------------------------------------------

# 53. APP UI VS GAME UI

This distinction is mandatory.

## Application UI

Should be:

-   minimal;
-   neutral;
-   professional;
-   restrained;
-   quiet.

## Game UI

May be:

-   colorful;
-   expressive;
-   animated;
-   playful;
-   thematic.

Example:

TeacherStudio editor can be gray/cream/forest.

Exported children's game can be colorful.

------------------------------------------------------------------------

# 54. NO-CODE REQUIREMENT

Teacher must never need to:

-   write code;
-   edit JSON;
-   understand schemas;
-   paste JavaScript;
-   install dependencies;
-   configure a server;
-   understand APIs.

Advanced developer diagnostics can exist behind:

`Cài đặt → Nâng cao → Chế độ nhà phát triển`

but must not interfere with normal use.

------------------------------------------------------------------------

# 55. TEMPLATE / CONTENT REUSABILITY

Separate:

``` text
Content
Game
Theme
Project
```

Example:

``` text
Question Set A
      ↓
Quiz
      ↓
Nature Theme
```

The same:

``` text
Question Set A
      ↓
Wheel
      ↓
Ocean Theme
```

This is a core product capability.

------------------------------------------------------------------------

# 56. FUTURE AI ARCHITECTURE

AI is future-facing, not core.

Potential future actions:

-   tạo câu hỏi;
-   chuyển SGK thành câu hỏi;
-   tạo game từ nội dung;
-   phân loại độ khó;
-   đề xuất theme.

When implemented, AI must appear as an optional tool.

Do not redesign the entire application around AI.

Preferred UI:

``` text
Công cụ hỗ trợ

[ Tạo câu hỏi tự động ]
```

Not:

``` text
✨ ENTER THE AI WORKSPACE
```

------------------------------------------------------------------------

# 57. DEVELOPMENT PHASES

## Phase 0 --- Foundation

Build:

-   project structure;
-   design tokens;
-   application shell;
-   routing;
-   storage;
-   i18n;
-   theme system;
-   reusable UI components.

Do not start with 30 games.

## Phase 1 --- Core Builder

Build:

-   dashboard;
-   projects;
-   content library;
-   game library;
-   editor;
-   preview;
-   settings;
-   backup/restore.

Games:

1.  Quiz
2.  True/False
3.  Flashcard
4.  Matching
5.  Drag Drop
6.  Connect
7.  Wheel
8.  Jigsaw
9.  Crossword
10. Timer

## Phase 2 --- Export

Build:

-   single HTML export;
-   asset embedding;
-   diagnostics;
-   compatibility checks;
-   export profiles.

## Phase 3 --- Classroom Games

Implement:

-   minefield;
-   race;
-   boat race;
-   tug of war;
-   train;
-   secret lock;
-   flying words;
-   duck race;
-   turn-based;
-   mind map.

## Phase 4 --- Advanced Interaction

Implement:

-   treasure hunt;
-   learning journey;
-   battle;
-   zombie;
-   fruit;
-   catch;
-   interactive image;
-   interactive video.

## Phase 5 --- Hardware/Media

Implement:

-   paper mode;
-   camera;
-   gesture;
-   microphone;
-   panorama;
-   3D gallery.

## Phase 6 --- AI

Only after core architecture is stable:

-   AI question generation;
-   AI content conversion;
-   AI game generation;
-   AI recommendations.

------------------------------------------------------------------------

# 58. ACCEPTANCE CRITERIA

TeacherStudio is considered MVP-ready only when:

## UX

-   teacher can create a game without technical knowledge;
-   teacher can understand every major action;
-   dashboard is usable;
-   settings are organized;
-   dark/light themes work;
-   mobile UI works.

## Content

-   questions are reusable;
-   content can be converted between compatible games;
-   bulk input works.

## Games

-   at least core games work reliably;
-   game modules are isolated;
-   theme changes do not break mechanics.

## Preview

-   preview works without export;
-   preview reflects actual exported behavior.

## Export

-   single HTML is generated;
-   no required external runtime dependency;
-   exported game works independently;
-   diagnostics run before export.

## Storage

-   projects survive reload;
-   autosave works;
-   backup/restore works.

## Security

-   imported content is isolated/sanitized;
-   camera/microphone permissions are explicit.

## Design

-   no AI-style visual overload;
-   no neon/glow/futuristic shell;
-   consistent spacing;
-   consistent typography;
-   consistent components;
-   professional dashboard;
-   professional settings;
-   clean dark mode;
-   clean light mode.

------------------------------------------------------------------------

# 59. DEFINITION OF DONE FOR EACH FEATURE

A feature is not complete merely because its main button works.

A feature is DONE only when:

1.  UI exists.
2.  Empty state exists.
3.  Loading state exists if relevant.
4.  Error state exists.
5.  Success feedback exists.
6.  Keyboard behavior is considered.
7.  Touch behavior is considered.
8.  Light theme works.
9.  Dark theme works.
10. Accessibility is considered.
11. Data persists.
12. Undo/redo is considered.
13. Preview works.
14. Export works if applicable.
15. Documentation/help exists where needed.
16. No unrelated feature is broken.

------------------------------------------------------------------------

# 60. AI AGENT WORKING METHOD

The coding agent must work in this order.

## Step 1

Inspect the repository.

Determine:

-   framework;
-   build system;
-   existing files;
-   current dependencies;
-   deployment method.

Do not rewrite blindly.

## Step 2

Create or normalize the design system.

Implement:

-   tokens;
-   typography;
-   spacing;
-   colors;
-   light/dark;
-   components.

## Step 3

Build application shell.

Implement:

-   sidebar;
-   top bar;
-   routing;
-   responsive behavior.

## Step 4

Build Dashboard.

Do not proceed until Dashboard looks professional and coherent.

## Step 5

Build Project Manager.

## Step 6

Build Content Engine.

## Step 7

Build Game Registry.

## Step 8

Implement first 3--5 core games.

Validate architecture.

## Step 9

Build Editor.

## Step 10

Build Preview.

## Step 11

Build Export Engine.

## Step 12

Build Settings and Backup/Restore.

## Step 13

Add remaining games progressively.

## Step 14

Run full QA.

Do not add advanced AI/camera features before core stability.

------------------------------------------------------------------------

# 61. AGENT RULE: DO NOT OVER-ENGINEER THE UI

The UI should not become complicated simply because the architecture is
complex.

Internal architecture may be sophisticated.

Teacher-facing UI must remain simple.

For example:

Internal:

``` text
GameDefinition
ContentSchema
Renderer
Validator
ThemeTokens
ExportPipeline
```

Teacher sees:

``` text
Trò chơi
Nội dung
Chủ đề
Cài đặt
Xem trước
Xuất
```

------------------------------------------------------------------------

# 62. AGENT RULE: DO NOT MAKE EVERY SCREEN A CARD GRID

Use the correct layout for the information.

-   Dashboard → sections + selective cards
-   Project list → table
-   Content list → table
-   Game library → cards
-   Settings → grouped forms
-   Editor → workspace
-   Preview → canvas/viewport
-   Help → article/navigation layout

------------------------------------------------------------------------

# 63. AGENT RULE: DO NOT USE AI-STYLE COPY

Avoid:

``` text
✨ Unleash your creativity
✨ Magic workspace
✨ AI-powered experience
✨ Supercharge your teaching
```

Prefer:

``` text
Tạo hoạt động
Chọn trò chơi
Nhập câu hỏi
Xem trước
Xuất file
```

------------------------------------------------------------------------

# 64. AGENT RULE: VISUAL HIERARCHY

When a screen feels crowded:

1.  remove unnecessary decoration;
2.  reduce secondary information;
3.  group related controls;
4.  improve spacing;
5.  use typography;
6.  use color only after hierarchy is established.

Do not solve clutter by adding more cards.

------------------------------------------------------------------------

# 65. AGENT RULE: MOBILE

Mobile is not a scaled-down desktop.

For mobile:

-   prioritize primary action;
-   collapse secondary settings;
-   use bottom sheets/drawers where appropriate;
-   make controls touch-friendly;
-   avoid horizontal overflow;
-   preserve readable text.

------------------------------------------------------------------------

# 66. AGENT RULE: DARK MODE

Dark mode must be designed, not mechanically inverted.

Do not simply:

``` css
filter: invert(...)
```

Use semantic color tokens.

Check:

-   borders;
-   disabled state;
-   focus;
-   selected state;
-   tables;
-   dialogs;
-   inputs;
-   previews;
-   game themes.

------------------------------------------------------------------------

# 67. AGENT RULE: THEME INDEPENDENCE

Changing application theme must not unexpectedly change exported game
theme.

Changing game theme must not change application shell theme.

------------------------------------------------------------------------

# 68. AGENT RULE: DATA SAFETY

Before destructive operations:

-   explain what will happen;
-   offer cancel;
-   confirm if irreversible.

For project deletion:

``` text
Xóa dự án?

Dự án sẽ được xóa khỏi thiết bị này.

[ Hủy ] [ Xóa dự án ]
```

If possible, support undo.

------------------------------------------------------------------------

# 69. AGENT RULE: NO SILENT FAILURE

If something cannot be done:

Explain:

-   what happened;
-   why;
-   what the user can do next.

Example:

``` text
Không thể xuất trò chơi.

Video này không thể được nhúng trực tiếp
vào file HTML hiện tại.

[ Xem chi tiết ]
[ Quay lại chỉnh sửa ]
```

------------------------------------------------------------------------

# 70. AGENT RULE: PRESERVE WORK

If a feature cannot be implemented immediately:

-   do not remove the UI or data model blindly;
-   mark it as planned/experimental;
-   preserve project compatibility.

Schema versions must support migrations.

------------------------------------------------------------------------

# 71. TESTING STRATEGY

## Unit tests

Test:

-   content validation;
-   scoring;
-   randomization;
-   game state;
-   theme token resolution;
-   export packaging;
-   backup parsing.

## Integration tests

Test:

-   create project;
-   add content;
-   select game;
-   preview;
-   export;
-   reload;
-   restore.

## Visual QA

Check:

-   Light;
-   Dark;
-   Desktop;
-   Tablet;
-   Mobile.

## Browser QA

At minimum test modern:

-   Chrome/Edge;
-   Firefox;
-   Safari where available.

------------------------------------------------------------------------

# 72. PERFORMANCE TARGETS

Targets:

-   application shell should feel immediate;
-   avoid loading all game assets on startup;
-   lazy-load heavy games;
-   avoid unnecessary animations;
-   keep dashboard responsive with hundreds of projects;
-   avoid blocking the main thread with large imports.

Large media should be handled progressively.

------------------------------------------------------------------------

# 73. FUTURE CLASSROOM FEATURES

Possible later features:

-   class list;
-   student/team randomizer;
-   local score board;
-   lesson workflow;
-   activity sequence;
-   classroom presentation mode;
-   projector mode;
-   teacher control panel.

These should remain modular.

------------------------------------------------------------------------

# 74. PROJECT EXPORT / SHARING

Teacher should be able to:

-   export HTML;
-   export backup;
-   duplicate project;
-   move project through backup.

No account should be required for these MVP actions.

------------------------------------------------------------------------

# 75. PROJECT IMPORT

Supported:

-   TeacherStudio backup;
-   compatible content formats;
-   optionally future game package.

Always validate before importing.

Show:

``` text
Phát hiện:

12 dự án
4 bộ câu hỏi
2 theme
```

Then:

``` text
[ Hủy ] [ Nhập dữ liệu ]
```

------------------------------------------------------------------------

# 76. DESIGN REVIEW CHECKPOINT

After completing the first full UI shell, stop and visually inspect.

Ask:

-   Does it look like a professional educational tool?
-   Does it feel calm?
-   Is it easy to scan?
-   Is there enough whitespace?
-   Is there too much whitespace?
-   Are controls obvious?
-   Does it look like an AI application?
-   Is there excessive color?
-   Are there too many cards?
-   Is dark mode equally polished?

If the answer to "Does it look like an AI application?" is YES, redesign
before continuing.

------------------------------------------------------------------------

# 77. FINAL PRODUCT CHARACTER

TeacherStudio should feel like:

``` text
Professional
     +
Simple
     +
Teacher-focused
     +
Quiet visual language
     +
Powerful internal engine
     +
Playful exported games
```

Not:

``` text
AI
+
Neon
+
Gradient
+
Glow
+
Cards everywhere
+
Unnecessary animation
```

------------------------------------------------------------------------

# 78. FINAL IMPLEMENTATION COMMAND TO THE AI AGENT

Implement TeacherStudio according to this specification.

Important priorities, in order:

1.  Architecture quality.
2.  Design system consistency.
3.  Professional Dashboard.
4.  Professional Settings.
5.  Stable project/content system.
6.  Reusable game engine.
7.  Theme system.
8.  Preview/export parity.
9.  Single HTML export.
10. Core games.
11. Accessibility.
12. Performance.
13. Advanced games.
14. Camera/microphone.
15. Future AI.

Do not sacrifice architecture for speed.

Do not sacrifice teacher usability for technical sophistication.

Do not turn TeacherStudio into an AI-looking product.

Do not add decorative UI just to make the interface appear more modern.

The final result should feel like a mature, carefully designed
educational productivity application made for real teachers.

The teacher should be able to open TeacherStudio and understand what to
do within a few seconds:

> Chọn trò chơi → nhập nội dung → chọn chủ đề → xem trước → xuất file.

That simplicity is the primary UX goal.
