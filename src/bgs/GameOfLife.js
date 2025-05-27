/**
 * Conway's Game of Life simulation with interactive grid
 * @class
 */
export default class GameOfLife {
  /**
   * Creates a GameOfLife instance
   * @constructor
   * @param {HTMLElement} container - DOM element to contain the simulation
   * @param {Object} [options={}] - Configuration options
   * @param {number} [options.cellSize=10] - Size of each cell in pixels
   * @param {string} [options.liveColor='#ffffff'] - Color of live cells
   * @param {string} [options.deadColor='#111111'] - Color of dead cells
   * @param {number} [options.fps=15] - Frames per second for simulation
   * @param {number} [options.randomFill=0.2] - Initial random fill percentage (0-1)
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      cellSize: 10,
      liveColor: "#ffffff",
      deadColor: "#111111",
      fps: 15,
      randomFill: 0.2,
      ...options,
    };

    this.running = false;
    this.grid = [];
    this.nextGrid = [];
    this.rows = 0;
    this.cols = 0;
    this.mouseDown = false;
    this.drawMode = true; // true = add cells, false = remove cells

    this.init();
  }

  /**
   * Initializes the simulation
   * @method
   */
  init() {
    this.createCanvas();
    this.createGrid();
    this.addEventListeners();
    this.render();
  }

  /**
   * Creates and configures the rendering canvas
   * @method
   */
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  /**
   * Handles canvas resizing
   * @method
   */
  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.rows = Math.floor(this.height / this.options.cellSize);
    this.cols = Math.floor(this.width / this.options.cellSize);

    this.createGrid();
  }

  /**
   * Creates the initial grid with random cells
   * @method
   */
  createGrid() {
    this.grid = new Array(this.rows);
    this.nextGrid = new Array(this.rows);

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols).fill(0);
      this.nextGrid[i] = new Array(this.cols).fill(0);

      if (this.options.randomFill > 0) {
        for (let j = 0; j < this.cols; j++) {
          this.grid[i][j] = Math.random() < this.options.randomFill ? 1 : 0;
        }
      }
    }
  }

  /**
   * Adds event listeners for interaction
   * @method
   */
  addEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouseDown = true;
      this.toggleCell(e);
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouseDown) {
        this.toggleCell(e);
      }
    });

    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.drawMode = !this.drawMode;
    });

    window.addEventListener("resize", () => this.resize());

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          this.toggleRunning();
          break;
        case "r":
          this.resetGrid();
          break;
        case "c":
          this.clearGrid();
          break;
      }
    });
  }

  /**
   * Toggles cell state at mouse position
   * @method
   * @param {MouseEvent} e - Mouse event
   */
  toggleCell(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.options.cellSize);
    const y = Math.floor((e.clientY - rect.top) / this.options.cellSize);

    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      this.grid[y][x] = this.drawMode ? 1 : 0;
      //this.render();
    }
  }

  /**
   * Computes the next generation of cells
   * @method
   */
  computeNextGeneration() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.countLiveNeighbors(y, x);

        // Apply Conway's rules
        if (this.grid[y][x] === 1) {
          // Any live cell with fewer than two live neighbors dies (underpopulation)
          // Any live cell with more than three live neighbors dies (overpopulation)
          this.nextGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          // Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
          this.nextGrid[y][x] = neighbors === 3 ? 1 : 0;
        }
      }
    }

    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }

  /**
   * Counts live neighbors for a cell
   * @method
   * @param {number} row - Cell row
   * @param {number} col - Cell column
   * @returns {number} Count of live neighbors
   */
  countLiveNeighbors(row, col) {
    let count = 0;

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) continue; // Skip the cell itself

        const newY = row + y;
        const newX = col + x;

        // Wrap around edges (toroidal grid)
        const wrappedY = (newY + this.rows) % this.rows;
        const wrappedX = (newX + this.cols) % this.cols;

        count += this.grid[wrappedY][wrappedX];
      }
    }

    return count;
  }

  /**
   * Renders the current grid state
   * @method
   */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.ctx.fillStyle = this.grid[y][x]
          ? this.options.liveColor
          : this.options.deadColor;
        this.ctx.fillRect(
          x * this.options.cellSize,
          y * this.options.cellSize,
          this.options.cellSize - 1,
          this.options.cellSize - 1
        );
      }
    }
  }

  /**
   * Animation loop
   * @method
   */
  animate() {
    if (this.running) {
      this.computeNextGeneration();
      this.render();
    }

    setTimeout(() => {
      requestAnimationFrame(() => this.animate());
    }, 1000 / this.options.fps);
  }

  /**
   * Toggles simulation running state
   * @method
   */
  toggleRunning() {
    this.running = !this.running;
    if (this.running && !this.animationId) {
      this.animate();
    }
  }

  /**
   * Resets grid with random cells
   * @method
   */
  resetGrid() {
    this.createGrid();
    this.render();
  }

  /**
   * Clears the grid
   * @method
   */
  clearGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.grid[y][x] = 0;
      }
    }
    this.render();
  }

  /**
   * Cleans up resources
   * @method
   */
  destroy() {
    this.running = false;
    this.canvas.remove();
  }
}
