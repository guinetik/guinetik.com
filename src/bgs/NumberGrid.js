export default class NumberGrid {
  constructor(container) {
    this.container = container;
    this.numbers = [];
    this.contentRect = this.container.getBoundingClientRect();
    this.mouseX = this.contentRect.width / 2;
    this.mouseY = this.contentRect.height / 2;
    this.lastMoveTime = 0;
    this.autoMouseX = this.mouseX;
    this.autoMouseY = this.mouseY;
    this.targetX = Math.random() * this.contentRect.width;
    this.targetY = Math.random() * this.contentRect.height;
    this.animationFrame = null;

    this.init();
  }

  init() {
    // Create number grid
    for (let i = 0; i < 112; i++) {
      const num = document.createElement("div");
      num.className = "number";
      num.textContent = Math.floor(Math.random() * 9);
      this.container.appendChild(num);
      this.numbers.push({
        element: num,
        baseX: Math.random(),
        baseY: Math.random(),
      });
    }

    this.setupEventListeners();
    this.updateAutoMouse();
    this.updateNumbers();
  }

  setupEventListeners() {
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
    this.lastMoveTime = Date.now();
  }

  handleResize() {
    this.contentRect = this.container.getBoundingClientRect();
  }

  updateAutoMouse() {
    const now = Date.now();
    const timeSinceMove = now - this.lastMoveTime;

    if (timeSinceMove > 1000) {
      const wanderSpeed = 0.5;
      const dx = this.targetX - this.autoMouseX;
      const dy = this.targetY - this.autoMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 10) {
        this.targetX =
          this.contentRect.width * 0.25 +
          Math.random() * (this.contentRect.width * 0.5);
        this.targetY =
          this.contentRect.height * 0.25 +
          Math.random() * (this.contentRect.height * 0.5);
      } else {
        this.autoMouseX += (dx / distance) * wanderSpeed;
        this.autoMouseY += (dy / distance) * wanderSpeed;
      }
    } else {
      this.autoMouseX = this.lastMouseX;
      this.autoMouseY = this.lastMouseY;
    }

    this.animationFrame = requestAnimationFrame(
      this.updateAutoMouse.bind(this)
    );
  }

  updateNumbers() {
    const currentX =
      Date.now() - this.lastMoveTime > 1000 ? this.autoMouseX : this.mouseX;
    const currentY =
      Date.now() - this.lastMoveTime > 1000 ? this.autoMouseY : this.mouseY;

    this.numbers.forEach((numObj) => {
      const xPos = numObj.baseX * this.contentRect.width;
      const yPos = numObj.baseY * this.contentRect.height;
      const dx = currentX - xPos;
      const dy = currentY - yPos;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = 0.5 + (1 - Math.min(1, distance / 150));
      const floatX = Math.sin(Date.now() / 1500 + numObj.baseX * 10) * 2;
      const floatY = Math.cos(Date.now() / 1800 + numObj.baseY * 10) * 2;

      numObj.element.style.transform = `translate(${floatX}px, ${floatY}px) scale(${scale})`;
      numObj.element.style.opacity =
        0.2 + 0.8 * (1 - Math.min(1, distance / 200));
    });

    this.animationFrame = requestAnimationFrame(this.updateNumbers.bind(this));
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    document.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
    this.numbers.forEach((num) => num.element.remove());
    this.numbers = [];
  }
}
