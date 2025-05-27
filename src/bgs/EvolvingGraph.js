export default class EvolvingGraph {
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        initialNodes: 30,
        maxNodes: 100,
        spawnRate: 0.03, // Probability per frame
        clusterCount: 4,
        driftSpeed: 0.3,
        migrationRate: 0.002,
        ...options
      };
      this.nodes = [];
      this.clusterCenters = [];
      this.animationId = null;
      this.time = 0;
      
      this.init();
    }
  
    init() {
      this.createCanvas();
      this.createClusters();
      this.seedInitialNodes();
      this.animate();
    }
  
    createCanvas() {
      this.canvas = document.createElement('canvas');
      Object.assign(this.canvas.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 1,
        pointerEvents: 'none'
      });
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
    }
  
    createClusters() {
        const clusterColors = [
            // Greens
            '#9eff9e', '#01ff70', '#3d9970', '#2ecc40', '#3d9970',
            
            // Blues
            '#7fdbff', '#0074d9', '#39cccc', '#0066cc', '#001f3f',
            
            // Purples
            '#f012be', '#b10dc9', '#85144b', '#6a0dad', '#9400d3',
            
            // Reds/Oranges
            '#ff4136', '#ff851b', '#ff4500', '#ff6b6b', '#ff8c00',
            
            // Yellows
            '#ffdc00', '#ffd700', '#f1c40f', '#f39c12', '#e67e22',
            
            // Specials (teal/pink)
            '#39cccc', '#ff9ff3'
          ];
      
      for (let i = 0; i < this.options.clusterCount; i++) {
        this.clusterCenters.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * this.options.driftSpeed,
          vy: (Math.random() - 0.5) * this.options.driftSpeed,
          color: clusterColors[Math.random() * clusterColors.length | 0],
          targetRadius: 80 
        });
      }
    }
  
    seedInitialNodes() {
      for (let i = 0; i < this.options.initialNodes; i++) {
        this.spawnNode();
      }
    }
  
    spawnNode() {
      if (this.nodes.length >= this.options.maxNodes) return;
      
      const clusterId = Math.floor(Math.random() * this.options.clusterCount);
      const center = this.clusterCenters[clusterId];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * center.targetRadius * 0.3;
      
      this.nodes.push({
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: 0, // Start small (will grow)
        targetSize: 1 + Math.random() * 5,
        growthRate: 0.02 + Math.random() * 0.03,
        cluster: clusterId,
        age: 0,
        spawnGlow: 1 // Start with full glow
      });
    }
  
    animate() {
      this.time++;
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      this.updateClusters();
      this.updateNodes();
      this.handleSpawning();
      this.handleMigrations();
      this.drawNodes();
      this.drawEdges();
      
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  
    updateClusters() {
      this.clusterCenters.forEach(center => {
        // Random walk drift
        center.x += center.vx;
        center.y += center.vy;
        
        // Occasionally change direction
        if (Math.random() < 0.005) {
          center.vx = (Math.random() - 0.5) * this.options.driftSpeed;
          center.vy = (Math.random() - 0.5) * this.options.driftSpeed;
        }
        
        // Boundary bounce
        if (center.x < 0 || center.x > this.width) center.vx *= -1;
        if (center.y < 0 || center.y > this.height) center.vy *= -1;
      });
    }
  
    updateNodes() {
      this.nodes.forEach(node => {
        const center = this.clusterCenters[node.cluster];
        
        // Attraction to cluster center (spring-like)
        const dx = center.x - node.x;
        const dy = center.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = dist / center.targetRadius;
        
        node.vx += dx * 0.0005 * force;
        node.vy += dy * 0.0005 * force;
        
        // Random movement
        node.vx += (Math.random() - 0.5) * 0.05;
        node.vy += (Math.random() - 0.5) * 0.05;
        
        // Apply velocity with friction
        node.x += node.vx *= 0.95;
        node.y += node.vy *= 0.95;
        
        // Grow if not at target size
        if (node.size < node.targetSize) {
          node.size += node.growthRate;
        }
        
        // Fade spawn glow
        if (node.spawnGlow > 0) {
          node.spawnGlow -= 0.01;
        }
        
        node.age++;
      });
    }
  
    handleSpawning() {
      if (this.nodes.length < this.options.maxNodes && 
          Math.random() < this.options.spawnRate) {
        this.spawnNode();
      }
    }
  
    handleMigrations() {
      this.nodes.forEach(node => {
        // Only mature nodes can migrate
        if (node.age > 300 && Math.random() < this.options.migrationRate) {
          const newCluster = Math.floor(Math.random() * this.options.clusterCount);
          if (newCluster !== node.cluster) {
            node.cluster = newCluster;
            // Give a little push toward new cluster
            const center = this.clusterCenters[newCluster];
            node.vx += (center.x - node.x) * 0.02;
            node.vy += (center.y - node.y) * 0.02;
          }
        }
      });
    }
  
    drawEdges() {
      this.ctx.lineWidth = 0.5;
      
      // Only draw connections between nearby nodes
      for (let i = 0; i < this.nodes.length; i++) {
        const a = this.nodes[i];
        const centerA = this.clusterCenters[a.cluster];
        
        for (let j = i + 1; j < Math.min(i + 15, this.nodes.length); j++) {
          const b = this.nodes[j];
          
          // Higher chance to connect within same cluster
          if (a.cluster === b.cluster || Math.random() > 0.7) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
              const centerB = this.clusterCenters[b.cluster];
              const opacity = a.cluster === b.cluster 
                ? 0.8 - (dist / 120 * 0.2)
                : 0.1 - (dist / 120 * 0.08);
              
              this.ctx.strokeStyle = a.cluster === b.cluster
                ? `${centerA.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
                : `rgba(150, 150, 150, ${opacity})`;
              
              this.ctx.beginPath();
              this.ctx.moveTo(a.x, a.y);
              this.ctx.lineTo(b.x, b.y);
              this.ctx.stroke();
            }
          }
        }
      }
    }
  
    drawNodes() {
      this.nodes.forEach(node => {
        const center = this.clusterCenters[node.cluster];
        
        // Glow effect for new nodes
        if (node.spawnGlow > 0) {
          this.ctx.shadowBlur = 20 * node.spawnGlow;
          this.ctx.shadowColor = center.color;
        }
        
        // Node body
        this.ctx.fillStyle = center.color;
        //this.ctx.globalAlpha = 0.6;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset glow
        this.ctx.shadowBlur = 0;
      });
  
      // Draw cluster centers (faint)
      this.clusterCenters.forEach(center => {
        const colorWithAlpha = `${center.color}${Math.floor(0.05 * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fillStyle = colorWithAlpha;
        //this.ctx.globalAlpha = 0.1;
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, center.targetRadius, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
  
    resize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  
    destroy() {
      cancelAnimationFrame(this.animationId);
      this.canvas.remove();
    }
  }