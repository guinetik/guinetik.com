import { TerminalOverlay } from "../components/TerminalOverlay";
export class Transition {
  // Start enter transition
  static in() {
    setTimeout(() => {
      new TerminalOverlay();
      document.querySelector(".page")?.classList.add("active");
    }, 100); // Match animation duration
  }

  // Setup leave transition (returns handler for useBeforeLeave)
  static out(e) {
    new TerminalOverlay();
    document.querySelector(".page")?.classList.remove("active");
    e.preventDefault();
    setTimeout(() => e.retry(true), 300); // Match animation duration
  }
}
