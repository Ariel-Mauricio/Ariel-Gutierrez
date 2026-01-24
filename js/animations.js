/* ===============================================
   ANIMATIONS JAVASCRIPT
   Scroll-triggered animations and effects
   =============================================== */

// ================ INTERSECTION OBSERVER FOR ANIMATIONS ================
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Add delay based on data attribute
                    const delay = entry.target.getAttribute('data-aos-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                }
            });
        }, this.observerOptions);
    }
    
    observeElements() {
        document.querySelectorAll('[data-aos]').forEach(el => {
            // Set initial styles based on animation type
            const animation = el.getAttribute('data-aos');
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            switch(animation) {
                case 'fade-up':
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(50px)';
                    break;
                case 'fade-down':
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(-50px)';
                    break;
                case 'fade-right':
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(-50px)';
                    break;
                case 'fade-left':
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(50px)';
                    break;
                case 'zoom-in':
                    el.style.opacity = '0';
                    el.style.transform = 'scale(0.9)';
                    break;
                case 'flip-up':
                    el.style.opacity = '0';
                    el.style.transform = 'perspective(2500px) rotateX(100deg)';
                    break;
            }
            
            this.observer.observe(el);
        });
    }
}

// ================ PARALLAX EFFECT ================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax');
        if (this.elements.length === 0) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    onScroll() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ================ TEXT REVEAL ANIMATION ================
class TextReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text');
        if (this.elements.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 50}ms`;
                el.appendChild(span);
            });
        });
    }
}

// ================ SCROLL PROGRESS ================
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
        if (!this.progressBar) this.createProgressBar();
        
        this.init();
    }
    
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #00f5d4, #7b2cbf);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.progressBar);
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    onScroll() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
    }
}

// ================ SMOOTH ANCHOR SCROLLING ================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    }
    
    handleClick(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ================ STAGGER ANIMATION ================
class StaggerAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        const staggerContainers = document.querySelectorAll('.stagger-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        staggerContainers.forEach(container => observer.observe(container));
    }
}

// ================ NUMBER COUNTER ANIMATION ================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        if (this.counters.length === 0) return;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = this.easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(target * progress);
            
            element.textContent = currentCount;
            
            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = target;
            }
        }, frameDuration);
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
}

// ================ REVEAL ON SCROLL ================
class RevealOnScroll {
    constructor() {
        this.reveals = document.querySelectorAll('.reveal');
        if (this.reveals.length === 0) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.checkReveal());
        this.checkReveal(); // Initial check
    }
    
    checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        this.reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            } else {
                reveal.classList.remove('active');
            }
        });
    }
}

// ================ LAZY LOADING IMAGES ================
class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        if (this.images.length === 0) return;
        
        this.init();
    }
    
    init() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            return;
        }
        
        // Fallback for older browsers
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        this.images.forEach(img => observer.observe(img));
    }
}

// ================ MAGNETIC HOVER EFFECT ================
class MagneticEffect {
    constructor() {
        this.elements = document.querySelectorAll('.magnetic');
        if (this.elements.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.onMouseMove(e, el));
            el.addEventListener('mouseleave', (e) => this.onMouseLeave(e, el));
        });
    }
    
    onMouseMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
    
    onMouseLeave(e, el) {
        el.style.transform = 'translate(0, 0)';
    }
}

// ================ INITIALIZE ALL ANIMATIONS ================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for loader to finish
    setTimeout(() => {
        new AnimationObserver();
        new ParallaxEffect();
        new ScrollProgress();
        new SmoothScroll();
        new StaggerAnimation();
        new CounterAnimation();
        new RevealOnScroll();
        new LazyLoadImages();
        new MagneticEffect();
    }, 2500);
});

// ================ UTILITY: ADD CSS DYNAMICALLY ================
const animationStyles = `
    .aos-animate[data-aos="fade-up"],
    .aos-animate[data-aos="fade-down"],
    .aos-animate[data-aos="fade-right"],
    .aos-animate[data-aos="fade-left"],
    .aos-animate[data-aos="zoom-in"],
    .aos-animate[data-aos="flip-up"] {
        opacity: 1 !important;
        transform: translate(0) scale(1) rotateX(0) !important;
    }
    
    .stagger-container > * {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s ease;
    }
    
    .stagger-container > *.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .magnetic {
        transition: transform 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
