/* ==========================================================================
   TeacherStudio Game Library View (Section 09)
   ========================================================================== */

import { GameRegistry } from '../core/game-registry.js';
import { ProjectManager } from '../core/project-manager.js';
import { Dialogs } from '../ui/dialogs.js';
import { Notifications } from '../ui/notifications.js';
import { Icons } from '../ui/icons.js';

export const GameLibraryView = {
  render(container) {
    const allGames = GameRegistry.getAll();
    let currentCategory = 'all';
    let searchQuery = '';

    const renderGrid = () => {
      let filtered = allGames;
      if (currentCategory !== 'all') {
        filtered = filtered.filter(g => g.category === currentCategory);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(g => 
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.pedagogy.toLowerCase().includes(q)
        );
      }

      const gridEl = container.querySelector('#games-cards-grid');
      if (!gridEl) return;

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <p class="empty-state-desc">Không tìm thấy trò chơi nào phù hợp.</p>
          </div>
        `;
        return;
      }

      gridEl.innerHTML = filtered.map(g => `
        <div class="game-card">
          <div class="game-card-preview" style="background: var(--color-surface-subtle); display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 40px;">
              ${g.id === 'quiz' ? '📝' : (g.id === 'wheel' ? '🎡' : (g.id === 'true-false' ? '⚖️' : (g.id === 'flashcard' ? '📇' : (g.id === 'matching' ? '🔗' : (g.id === 'tug-of-war' ? '🪢' : (g.id === 'race' ? '🏎️' : (g.id === 'jigsaw' ? '🧩' : (g.id === 'timer' ? '⏱️' : (g.id === 'crossword' ? '🔡' : '🎮')))))))))}
            </div>
          </div>
          <div class="game-card-body">
            <h3 class="game-card-title">${g.name}</h3>
            <p class="game-card-desc">${g.description}</p>
            <div style="margin-bottom: 12px;">
              <span class="badge badge-primary" style="font-size: 11px;">${g.pedagogy}</span>
            </div>
            <div class="game-card-footer">
              <button class="btn btn-primary btn-sm btn-select-game" data-id="${g.id}" style="width: 100%;">
                Dùng trò chơi này →
              </button>
            </div>
          </div>
        </div>
      `).join('');

      gridEl.querySelectorAll('.btn-select-game').forEach(btn => {
        btn.onclick = () => {
          const gameId = btn.getAttribute('data-id');
          Dialogs.showNewProjectModal(async (data) => {
            data.gameType = gameId;
            const { project } = await ProjectManager.createNewProject(data);
            Notifications.success(`Đã tạo dự án ${project.name}`);
            window.location.hash = `#editor?id=${project.id}`;
          });
        };
      });
    };

    container.innerHTML = `
      <div class="view-header flex items-center justify-between" style="margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 700;">Thư viện Trò chơi</h1>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
            12 hình thức trò chơi học tập tương tác phù hợp với mọi tiết học tiểu học.
          </p>
        </div>
      </div>

      <!-- Categories & Search bar -->
      <div class="card flex items-center justify-between gap-3" style="margin-bottom: 24px; padding: 12px 16px;">
        <div class="flex gap-1" style="flex-wrap: wrap;">
          <button class="btn btn-sm btn-cat-filter active" data-cat="all">Tất cả (${allGames.length})</button>
          <button class="btn btn-sm btn-cat-filter" data-cat="quiz">Trắc nghiệm</button>
          <button class="btn btn-sm btn-cat-filter" data-cat="matching">Ghép & Nối</button>
          <button class="btn btn-sm btn-cat-filter" data-cat="interactive">Thi đấu & Lớp học</button>
          <button class="btn btn-sm btn-cat-filter" data-cat="tools">Công cụ lớp học</button>
        </div>

        <div style="min-width: 220px;">
          <input type="text" class="input" id="inp-search-games" placeholder="Tìm kiếm trò chơi..." style="padding: 6px 12px;">
        </div>
      </div>

      <!-- Game Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;" id="games-cards-grid"></div>
    `;

    renderGrid();

    // Bind category filters
    container.querySelectorAll('.btn-cat-filter').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.btn-cat-filter').forEach(b => b.classList.remove('btn-primary', 'active'));
        btn.classList.add('btn-primary', 'active');
        currentCategory = btn.getAttribute('data-cat');
        renderGrid();
      };
    });

    const searchInp = container.querySelector('#inp-search-games');
    if (searchInp) {
      searchInp.oninput = (e) => {
        searchQuery = e.target.value;
        renderGrid();
      };
    }
  }
};
