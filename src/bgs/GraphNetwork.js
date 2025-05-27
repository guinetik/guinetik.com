export default class GraphNetwork {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      nodeCount: 100,
      clusterCount: 5,
      mouseRepelForce: 0.8,
      clusterAttraction: 0.2,
      ...options
    };
    this.nodes = [];
    this.clusterCenters = [];
    this.mousePos = { x: -1000, y: -1000 };
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.createClusters();
    this.createNodes();
    this.addEventListeners();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
      opacity: 0.2,
      pointerEvents: 'none'
    });
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  createClusters() {
    // Create invisible cluster centers
    for (let i = 0; i < this.options.clusterCount; i++) {
      this.clusterCenters.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1
      });
    }
  }

  createNodes() {
    const clusterColors = [
      '#9eff9e', '#7fdbff', '#ff851b', 
      '#f012be', '#3d9970', '#b10dc9'
    ];
    
    for (let i = 0; i < this.options.nodeCount; i++) {
      const clusterId = i % this.options.clusterCount;
      const center = this.clusterCenters[clusterId];
      
      this.nodes.push({
        x: center.x + (Math.random() * 100 - 50),
        y: center.y + (Math.random() * 100 - 50),
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        radius: 2 + Math.random() * 3,
        cluster: clusterId,
        color: clusterColors[clusterId],
        baseOpacity: 0.4 + Math.random() * 0.3
      });
    }
  }

  addEventListeners() {
    this.container.addEventListener('mousemove', e => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.mousePos = { x: -1000, y: -1000 };
    });
    
    window.addEventListener('resize', () => this.resize());
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update cluster centers
    this.updateClusters();
    
    // Update and draw nodes
    this.updateNodes();
    this.drawNodes();
    
    // Draw connections
    this.drawConnections();
    
    requestAnimationFrame(() => this.animate());
  }

  updateClusters() {
    this.clusterCenters.forEach(center => {
      center.x += center.vx;
      center.y += center.vy;
      
      if (center.x < 0 || center.x > this.width) center.vx *= -1;
      if (center.y < 0 || center.y > this.height) center.vy *= -1;
    });
  }

  updateNodes() {
    const mouseInfluenceRadius = 200;
    
    this.nodes.forEach(node => {
      const clusterCenter = this.clusterCenters[node.cluster];
      
      // Attraction to cluster center
      const dx = clusterCenter.x - node.x;
      const dy = clusterCenter.y - node.y;
      const distToCluster = Math.sqrt(dx * dx + dy * dy);
      
      node.vx += dx * 0.0005 * this.options.clusterAttraction;
      node.vy += dy * 0.0005 * this.options.clusterAttraction;
      
      // Mouse repulsion
      const mouseDx = node.x - this.mousePos.x;
      const mouseDy = node.y - this.mousePos.y;
      const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      
      if (mouseDist < mouseInfluenceRadius) {
        const force = (mouseInfluenceRadius - mouseDist) / mouseInfluenceRadius;
        node.vx += (mouseDx / mouseDist) * force * this.options.mouseRepelForce;
        node.vy += (mouseDy / mouseDist) * force * this.options.mouseRepelForce;
        node.highlight = force * 0.8;
      } else {
        node.highlight = 0;
      }
      
      // Apply velocity with friction
      node.x += node.vx *= 0.9;
      node.y += node.vy *= 0.9;
      
      // Boundary check
      if (node.x < 0 || node.x > this.width) node.vx *= -0.5;
      if (node.y < 0 || node.y > this.height) node.vy *= -0.5;
    });
  }

  drawNodes() {
    this.nodes.forEach(node => {
      // Glow effect
      if (node.highlight > 0) {
        this.ctx.shadowBlur = 15 * node.highlight;
        this.ctx.shadowColor = node.color;
      }
      
      // Node body
      this.ctx.fillStyle = node.color;
      this.ctx.globalAlpha = node.baseOpacity + node.highlight * 0.3;
      this.ctx.beginPath();
      this.ctx.arc(
        node.x, 
        node.y, 
        node.radius * (1 + node.highlight * 0.5), 
        0, 
        Math.PI * 2
      );
      this.ctx.fill();
      
      // Reset glow
      this.ctx.shadowBlur = 0;
    });
  }

  drawConnections() {
    this.ctx.lineWidth = 0.8;
    
    // Only check nearby nodes for performance
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < Math.min(i + 20, this.nodes.length); j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const sameCluster = a.cluster === b.cluster;
          this.ctx.strokeStyle = sameCluster 
            ? `${a.color}${Math.floor(0.3 * 255).toString(16).padStart(2, '0')}`
            : `rgba(158, 255, 158, ${0.1})`;
          
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }
  }

  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  destroy() {
    this.canvas.remove();
  }
}