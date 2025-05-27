/**
 * A dynamic particle simulation that creates cymatic visual patterns and transforms
 * into a predefined logo shape on mouse interaction. Particles respond to wave
 * physics and user input with smooth transitions between states.
 * Inspired by: Cymatics: Chladni Plate - Sound, Vibration and Sand by Nigel John Stanford (https://www.youtube.com/watch?v=tFAcYruShow)
 * @class
 */
export default class CymaticsSim {
  /**
   * Creates a CymaticsSim instance
   * @constructor
   * @param {HTMLElement} container - DOM element to contain the simulation
   * @param {Object} [options={}] - Configuration options
   * @param {number} [options.particleCount=300] - Number of particles in simulation
   * @param {number} [options.baseSize=1] - Base particle size in pixels
   * @param {number} [options.glowIntensity=0.9] - Intensity of particle glow (0-1)
   * @param {number} [options.waveFrequency=1] - Frequency of underlying wave patterns
   * @param {number} [options.waveAmplitude=1] - Amplitude of wave motions
   * @param {number} [options.mouseRepelForce=-0.9] - Force of mouse repulsion
   * @param {number} [options.mouseRepelRadius=0.5] - Radius of mouse interaction
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleCount: 300,
      baseSize: 1,
      glowIntensity: 0.9,
      waveFrequency: 1,
      waveAmplitude: 1,
      mouseRepelForce: -0.9,
      mouseRepelRadius: 0.5,
      ...options,
    };
    this.mouseDown = false;
    this.targetShape = []; // Stores logo shape coordinates
    this.shapeFormationSpeed = 0.05;
    this.mousePos = null;
    this.particles = [];
    this.time = 0;

    this.init();
  }

  /**
   * Initializes event listeners for mouse interaction
   * @method
   * @listens mousemove
   * @listens mousedown
   * @listens mouseup
   * @listens mouseleave
   */
  addEventListeners() {
    this.canvas.style.pointerEvents = "auto"; // Enable mouse events

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.particles.forEach((particle, i) => {
        particle.forming = false; // Cancel any forming in progress
      });
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    this.canvas.addEventListener("mousedown", () => (this.mouseDown = true));
    this.canvas.addEventListener("mouseup", () => (this.mouseDown = false));

    this.canvas.addEventListener("mouseleave", () => {
      this.mousePos = { x: -1000, y: -1000 }; // Reset to off-screen
    });
  }
  /**
   * Parses SVG path data and creates target positions for logo formation
   * @method
   * @param {string} [svgPath] - SVG path data string
   */
  createLogoShape() {
    this.targetShape = [];
    const svgPath =
      "m 562.6845,164.9387 v -20.9177 -8.5136 h 17.1383 v -6.0917 h -11.9492 v -14.0263 h -5.1891 v 14.2982 5.8198 h -25.0713 v 8.9127 h 17.4776 v 20.5186 z m 21.7455,14.0269 v -14.2985 -5.8201 h 25.0713 v -8.9132 H 592.0231 V 129.4157 H 584.43 v 20.9172 8.5141 h -17.138 v 6.0928 h 11.9474 v 14.0258 z";

    // Create temporary path element for precise measurement
    const svgNS = "http://www.w3.org/2000/svg";
    const pathEl = document.createElementNS(svgNS, "path");
    pathEl.setAttribute("d", svgPath);

    // Calculate total length and spacing
    const pathLength = pathEl.getTotalLength();
    const spacing = pathLength / this.options.particleCount;

    // Generate points along the path
    for (let i = 0; i < this.options.particleCount; i++) {
      const point = pathEl.getPointAtLength(i * spacing);
      this.targetShape.push({
        x: (point.x - 562) * 1.2, // Adjusted scaling and centering
        y: (point.y - 164) * 1.2,
        size: 1.5,
        color: "rgba(158, 255, 158, 0.9)",
      });
    }
  }

  /**
   * Initializes the simulation by creating all necessary components
   * @method
   */
  init() {
    this.createLogoShape();
    this.createCanvas();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  /**
   * Creates and configures the rendering canvas
   * @method
   */
  createCanvas() {
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 0,
    });
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  /**
   * Generates particles with randomized initial positions and properties
   * @method
   */
  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        baseX: Math.random() * this.width,
        baseY: Math.random() * this.height,
        size: this.options.baseSize * (0.7 + Math.random() * 0.6),
        speed: 0.2 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }
  }
  /**
   * Calculates Euclidean distance between two points
   * @method
   * @param {Object} a - First point with x/y coordinates
   * @param {number} a.x - X coordinate
   * @param {number} a.y - Y coordinate
   * @param {Object} b - Second point with x/y coordinates
   * @param {number} b.x - X coordinate
   * @param {number} b.y - Y coordinate
   * @returns {number} Distance between points
   */
  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /**
   * Main animation loop handling particle movement and rendering
   * @method
   * @description Handles three states:
   *   1. Wave formation (default)
   *   2. Logo formation (mouse down)
   *   3. Transition between states (smooth interpolation)
   */
  animate() {
    this.time++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw particles with glow
    this.ctx.shadowBlur = 15 * this.options.glowIntensity;
    this.ctx.shadowColor = "rgba(255, 255, 255, 0.9)";

    // Determine speed based on mouse state
    const currentFormationSpeed = this.mouseDown
      ? this.shapeFormationSpeed
      : this.shapeFormationSpeed * 0.3; // Slower release

    this.particles.forEach((particle, i) => {
      // Calculate natural wave position
      const wave1 =
        Math.sin(
          this.time * particle.speed * 0.05 +
            particle.baseX * this.options.waveFrequency
        ) * this.options.waveAmplitude;

      const wave2 =
        Math.cos(
          this.time * particle.speed * 0.03 +
            particle.baseY * this.options.waveFrequency
        ) * this.options.waveAmplitude;

      const waveX = particle.baseX + wave1;
      const waveY = particle.baseY + wave2;

      if (this.mouseDown || particle.forming) {
        const targetIdx = Math.floor(
          (i / this.particles.length) * this.targetShape.length
        );
        const target = this.targetShape[targetIdx];
        const targetX = this.mousePos.x + target.x;
        const targetY = this.mousePos.y + target.y;

        // Smooth movement toward target or back to waves
        particle.x += (targetX - particle.x) * currentFormationSpeed;
        particle.y += (targetY - particle.y) * currentFormationSpeed;

        // Track if we're still forming the logo
        particle.forming =
          this.mouseDown ||
          Math.abs(targetX - particle.x) > 1 ||
          Math.abs(targetY - particle.y) > 1;

        particle.size = target.size;
      } else {
        // Normal wave motion with mouse repulsion
        particle.x += (waveX - particle.x) * 0.1; // Gradual return
        particle.y += (waveY - particle.y) * 0.1;

        if (this.mousePos) {
          const mouseDist = this.distance(particle, this.mousePos);
          if (mouseDist < this.options.mouseRepelRadius) {
            const force =
              (this.options.mouseRepelRadius - mouseDist) /
              this.options.mouseRepelRadius;
            particle.x += (particle.x - this.mousePos.x) * 0.01 * force;
            particle.y += (particle.y - this.mousePos.y) * 0.01 * force;
          }
        }
      }

      // Draw particle
      this.ctx.fillStyle = particle.color || "rgba(255, 255, 255, 0.8)";
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Handles canvas resizing and maintains aspect ratio
   * @method
   */
  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Cleans up resources and stops animation
   * @method
   */
  destroy() {
    cancelAnimationFrame(this.animationId);
    this.canvas.remove();
  }
}
