/* ==========================================================================
   TeacherStudio Hash Router
   ========================================================================== */

import { DashboardView } from '../dashboard/dashboard.js';
import { ProjectsView } from '../projects/projects-view.js';
import { GameLibraryView } from '../games/games-library-view.js';
import { ContentLibraryView } from '../content/content-library-view.js';
import { TemplatesView } from '../templates/templates-view.js';
import { ThemesGalleryView } from '../themes/themes-gallery-view.js';
import { EditorView } from '../editor/editor.js';
import { SettingsView } from '../settings/settings-view.js';
import { HelpView } from '../help/help-view.js';

export const Router = {
  container: null,

  init(container) {
    this.container = container;
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || 'dashboard';
    const [route, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      const href = el.getAttribute('href');
      if (href && href === `#${route}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Special layout styling for editor
    const viewContainer = document.getElementById('view-container');
    if (route === 'editor') {
      viewContainer.classList.add('no-padding');
    } else {
      viewContainer.classList.remove('no-padding');
    }

    switch (route) {
      case 'dashboard':
        await DashboardView.render(this.container);
        break;
      case 'projects':
        await ProjectsView.render(this.container);
        break;
      case 'games':
        GameLibraryView.render(this.container);
        break;
      case 'content':
        await ContentLibraryView.render(this.container);
        break;
      case 'templates':
        TemplatesView.render(this.container);
        break;
      case 'themes':
        ThemesGalleryView.render(this.container);
        break;
      case 'editor':
        const projectId = params.get('id');
        await EditorView.render(this.container, projectId);
        break;
      case 'settings':
        await SettingsView.render(this.container);
        break;
      case 'help':
        HelpView.render(this.container);
        break;
      default:
        await DashboardView.render(this.container);
        break;
    }
  }
};
