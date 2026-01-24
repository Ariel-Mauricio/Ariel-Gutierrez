/* ===============================================
   THREE.JS BACKGROUND - OPTIMIZED PARTICLES
   Lightweight 3D background with performance focus
   =============================================== */

class ThreeBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        // Check for reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Performance: Skip on mobile or low-end devices
        if (this.isMobileOrLowEnd()) {
            this.canvas.style.display = 'none';
            return;
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: false, // Disable for performance
            powerPreference: 'low-power'
        });
        
        this.particles = [];
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.frameCount = 0;
        
        this.init();
    }
    
    isMobileOrLowEnd() {
        // Check mobile
        if (window.innerWidth < 768) return true;
        // Check for low-end device hints
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
        return false;
    }
    
    init() {
        // Renderer setup - limit pixel ratio for performance
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        
        // Camera position
        this.camera.position.z = 30;
        
        // Create elements (reduced count)
        this.createParticles();
        this.createFloatingShapes();
        
        // Events (throttled)
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        // OPTIMIZED: 80 particles (good balance)
        const particleCount = 80;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Premium blue/purple colors
        const color1 = new THREE.Color(0x3b82f6); // Blue
        const color2 = new THREE.Color(0x8b5cf6); // Purple
        const color3 = new THREE.Color(0xec4899); // Pink accent
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 80;
            positions[i3 + 1] = (Math.random() - 0.5) * 80;
            positions[i3 + 2] = (Math.random() - 0.5) * 40;
            
            // Mix between three colors
            const rand = Math.random();
            let mixedColor;
            if (rand < 0.5) {
                mixedColor = color1.clone().lerp(color2, Math.random());
            } else {
                mixedColor = color2.clone().lerp(color3, Math.random() * 0.5);
            }
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    createFloatingShapes() {
        // 4 shapes with good variety
        const shapes = [
            { geometry: new THREE.TorusGeometry(2, 0.5, 12, 48), position: { x: -15, y: 10, z: -10 } },
            { geometry: new THREE.OctahedronGeometry(2, 0), position: { x: 15, y: -10, z: -5 } },
            { geometry: new THREE.IcosahedronGeometry(1.5, 0), position: { x: -10, y: -15, z: -8 } },
            { geometry: new THREE.TorusKnotGeometry(1.2, 0.3, 48, 8), position: { x: 18, y: 8, z: -12 } }
        ];
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        
        shapes.forEach((shapeData, index) => {
            const mesh = new THREE.Mesh(shapeData.geometry, material.clone());
            mesh.position.set(shapeData.position.x, shapeData.position.y, shapeData.position.z);
            mesh.userData = {
                originalPosition: { ...shapeData.position },
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.005, // Slower rotation
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                },
                floatSpeed: Math.random() * 0.3 + 0.2, // Slower float
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.shapes.push(mesh);
            this.scene.add(mesh);
        });
    }
    
    addEventListeners() {
        // Throttled resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.onResize(), 150);
        });
        
        // Throttled mouse move
        let lastMoveTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime < 50) return; // 20fps for mouse
            lastMoveTime = now;
            
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Skip frames for performance (render at ~30fps instead of 60)
        this.frameCount++;
        if (this.frameCount % 2 !== 0) return;
        
        const time = Date.now() * 0.0005; // Slower time
        
        // Smooth mouse follow (slower)
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03;
        
        // Rotate particle system (slower, subtler)
        if (this.particleSystem) {
            this.particleSystem.rotation.y = this.mouse.x * 0.15;
            this.particleSystem.rotation.x = this.mouse.y * 0.15;
            this.particleSystem.rotation.y += 0.0003;
        }
        
        // Animate floating shapes (simplified)
        this.shapes.forEach((shape) => {
            const userData = shape.userData;
            
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            
            // Simplified floating motion
            shape.position.y = userData.originalPosition.y + 
                Math.sin(time * userData.floatSpeed + userData.floatOffset) * 1.5;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js background
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded and not on mobile
    if (typeof THREE !== 'undefined' && window.innerWidth >= 768) {
        // Delay initialization to not block page load
        setTimeout(() => {
            new ThreeBackground();
        }, 100);
    }
});

// Simplified fallback for mobile - just hide canvas
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (canvas && window.innerWidth < 768) {
        canvas.style.display = 'none';
    }
});
