/* ==========================================================================
   TeacherStudio Theme Engine
   ========================================================================== */

import { THEMES } from '../themes/theme-definitions.js';

export const ThemeEngine = {
  getAllThemes() {
    return THEMES;
  },

  getTheme(id) {
    return THEMES.find(t => t.id === id) || THEMES[0];
  },

  applyThemeToElement(element, themeId) {
    if (!element) return;
    const theme = this.getTheme(themeId);
    
    // Clear other theme classes
    THEMES.forEach(t => element.classList.remove(t.cssClass));
    element.classList.add(theme.cssClass);

    // Apply inline CSS variables for maximum portability
    const c = theme.colors;
    element.style.setProperty('--theme-bg', c.bg);
    element.style.setProperty('--theme-surface', c.surface);
    element.style.setProperty('--theme-text', c.text);
    element.style.setProperty('--theme-text-subtle', c.textSubtle);
    element.style.setProperty('--theme-primary', c.primary);
    element.style.setProperty('--theme-accent', c.accent);
    element.style.setProperty('--theme-border', c.border);
    element.style.setProperty('--theme-header-bg', c.headerBg);
    element.style.setProperty('--theme-footer-bg', c.footerBg);
  },

  generateThemeCssRules(themeId) {
    const theme = this.getTheme(themeId);
    const c = theme.colors;
    return `
      .${theme.cssClass} {
        --theme-bg: ${c.bg};
        --theme-surface: ${c.surface};
        --theme-text: ${c.text};
        --theme-text-subtle: ${c.textSubtle};
        --theme-primary: ${c.primary};
        --theme-accent: ${c.accent};
        --theme-border: ${c.border};
        --theme-header-bg: ${c.headerBg};
        --theme-footer-bg: ${c.footerBg};
      }
    `;
  }
};
