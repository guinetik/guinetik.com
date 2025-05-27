// utils/TerminalOverlay.js
export class TerminalOverlay {
  constructor(options = {}) {
    // Default options
    const {
      parentSelector = ".terminal-content",
      className = "transition-overlay",
      duration = 1000,
      styles = {},
    } = options;

    // Create overlay element
    this.overlay = document.createElement("div");
    this.overlay.className = className;

    // Apply custom styles
    Object.assign(this.overlay.style, {
      display: "block",
      ...styles,
    });

    // Insert into DOM
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      console.warn(`Parent element "${parentSelector}" not found`);
      return;
    }
    parent.appendChild(this.overlay);

    // Schedule self-destruction
    this.timeout = setTimeout(() => {
      this.destroy();
    }, duration);
  }

  destroy() {
    if (this.overlay?.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.overlay = null;
  }

  // Optional: Chainable method for immediate removal
  removeNow() {
    this.destroy();
    return this;
  }
}
