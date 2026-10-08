/* ==========================================================================
   TeacherStudio Toast Notification System
   ========================================================================== */

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

export const Notifications = {
  show(message, type = 'info', duration = 3500) {
    const container = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSymbol = 'ℹ️';
    if (type === 'success') iconSymbol = '✓';
    else if (type === 'warning') iconSymbol = '⚠';
    else if (type === 'danger') iconSymbol = '✕';

    toast.innerHTML = `
      <span style="font-weight: 700; font-size: 14px;">${iconSymbol}</span>
      <span style="flex: 1;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 250);
    }, duration);
  },

  success(msg, dur) { this.show(msg, 'success', dur); },
  warning(msg, dur) { this.show(msg, 'warning', dur); },
  danger(msg, dur) { this.show(msg, 'danger', dur); },
  info(msg, dur) { this.show(msg, 'info', dur); }
};
