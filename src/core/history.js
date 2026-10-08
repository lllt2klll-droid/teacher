/* ==========================================================================
   TeacherStudio History Stack - Undo / Redo Manager
   ========================================================================== */

export class HistoryManager {
  constructor(limit = 30) {
    this.limit = limit;
    this.undoStack = [];
    this.redoStack = [];
  }

  push(state) {
    // Clone state deeply
    const snapshot = JSON.stringify(state);
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === snapshot) {
      return; // No change
    }
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo stack on new action
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  undo() {
    if (!this.canUndo()) return null;
    const current = this.undoStack.pop();
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1];
    return JSON.parse(previous);
  }

  redo() {
    if (!this.canRedo()) return null;
    const next = this.redoStack.pop();
    this.undoStack.push(next);
    return JSON.parse(next);
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
