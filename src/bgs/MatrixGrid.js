export default class MatrixGrid {
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        fadeSpeed: 0.05,  // How fast numbers fade
        updateInterval: 50, // How often numbers change (ms)
        symbols: "01アイウエオカキクケコ", // Extended character set
        ...options
      };
      this.columns = Math.floor(container.clientWidth / 20); // Column count based on width
      this.rows = Math.floor(container.clientHeight / 24);
      this.drops = Array(this.columns).fill(0);
      this.chars = [];
      
      this.init();
    }
  
    init() {
      // Create grid container
      this.grid = document.createElement('div');
      this.grid.className = 'matrix-grid';
      this.grid.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(${this.columns}, 1fr);
        z-index: 0;
        opacity: 0.5;
      `;
      this.container.appendChild(this.grid);
  
      // Create characters
      for (let i = 0; i < this.columns * this.rows; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.style.cssText = `
          color: #00ff41;
          font-family: 'Courier New', monospace;
          text-align: center;
          transition: color 0.1s, opacity 0.5s;
        `;
        this.grid.appendChild(char);
        this.chars.push(char);
      }
  
      this.startRain();
    }
  
    startRain() {
      // Initial reset
      this.drops = Array(this.columns).fill(-this.rows);
  
      // Animation loop
      this.interval = setInterval(() => {
        this.chars.forEach((char, index) => {
          const col = index % this.columns;
          const row = Math.floor(index / this.columns);
          const dropPos = this.drops[col];
          
          // Head of drop - bright
          if (row === Math.floor(dropPos)) {
            char.textContent = this.getRandomSymbol();
            char.style.opacity = '1';
            char.style.color = '#ffffff';
          } 
          // Tail of drop - fading
          else if (row < dropPos && row > dropPos - 8) {
            char.style.opacity = (0.5 - (dropPos - row) * 0.1).toString();
            char.style.color = '#00ff41';
          } 
          // Empty space
          else {
            if (Math.random() > 0.95) {
              char.textContent = this.getRandomSymbol();
            }
            char.style.opacity = '0.1';
          }
        });
  
        // Move drops down
        this.drops = this.drops.map((drop, i) => {
          if (drop > this.rows + 10 || Math.random() > 0.975) {
            return -Math.floor(Math.random() * this.rows);
          }
          return drop + 1;
        });
      }, this.options.updateInterval);
    }
  
    getRandomSymbol() {
      return this.options.symbols[
        Math.floor(Math.random() * this.options.symbols.length)
      ];
    }
  
    destroy() {
      clearInterval(this.interval);
      this.grid.remove();
    }
  }