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

      const catArt = { quiz: 'art-quiz', matching: 'art-matching', interactive: 'art-interactive', tools: 'art-tools' };

      gridEl.innerHTML = filtered.map(g => `
        <div class="game-card">
          <div class="game-card-art ${catArt[g.category] || 'art-default'}">
            ${Icons.get(g.icon || 'gamepad')}
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
      <div class="page-head">
        <div class="eyebrow">Không gian soạn bài</div>
        <h1>Thư viện Trò chơi</h1>
        <p class="page-desc">12 hình thức trò chơi học tập tương tác phù hợp với mọi tiết học tiểu học.</p>
      </div>

      <!-- Categories & Search bar -->
      <div class="toolbar-card">
        <div class="chip-row">
          <button class="chip active" data-cat="all">Tất cả (${allGames.length})</button>
          <button class="chip" data-cat="quiz">Trắc nghiệm</button>
          <button class="chip" data-cat="matching">Ghép & Nối</button>
          <button class="chip" data-cat="interactive">Thi đấu & Lớp học</button>
          <button class="chip" data-cat="tools">Công cụ lớp học</button>
        </div>

        <div class="search-wrap">
          <span class="search-ic">${Icons.get('search')}</span>
          <input type="text" class="input" id="inp-search-games" placeholder="Tìm kiếm trò chơi...">
        </div>
      </div>

      <!-- Game Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;" id="games-cards-grid"></div>
    `;

    renderGrid();

    // Bind category filters
    container.querySelectorAll('.chip').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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
