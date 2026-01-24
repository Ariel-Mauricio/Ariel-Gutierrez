/* ===============================================
   MAIN JAVASCRIPT - PORTFOLIO
   Core functionality and interactions
   =============================================== */

// ================ DOM ELEMENTS ================
const loader = document.getElementById('loader');
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typing-text');
const projectModal = document.getElementById('project-modal');
const projectsGrid = document.getElementById('projects-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// ================ LOADER ================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 2500);
});

// ================ CUSTOM CURSOR (OPTIMIZED) ================
// Skip cursor on mobile/touch devices
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = null;
    
    // Throttled mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Direct update for main cursor (no animation needed)
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });
    
    // Smooth cursor follower with RAF optimization
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.08;
        cursorY += (mouseY - cursorY) * 0.08;
        
        cursorFollower.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            animateCursor();
        }
    });
    
    // Cursor hover effects (reduced selector list)
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
    });
} else {
    // Hide custom cursor on touch devices
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ================ NAVIGATION ================
// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.add('show');
    document.body.style.overflow = 'hidden';
});

navClose?.addEventListener('click', () => {
    navMenu.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button
    if (currentScroll > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    lastScroll = currentScroll;
});

// Back to top
backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ================ TYPING EFFECT ================
const roles = [
    'Desarrollador Full Stack',
    'Especialista en Bases de Datos',
    'Desarrollador Web',
    'Entusiasta de la IA',
    'Creador de Soluciones Digitales'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeRole, typingSpeed);
}

// Start typing effect
setTimeout(typeRole, 1000);

// ================ COUNTER ANIMATION ================
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = target;
        }
    };
    
    updateCounter();
}

// ================ SCROLL ANIMATIONS (AOS Alternative) ================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Counter animation
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Observe counter elements
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

// ================ PROJECT FILTER ================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                project.style.display = 'block';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 10);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ================ PROJECT MODAL ================
const projectData = [
    {
        id: 1,
        title: "Sistema de Facturación",
        category: "Sistema Empresarial",
        description: "Sistema completo desarrollado para Polimil Escuela de Capacitación Integral. Automatiza la gestión de ingresos y egresos, genera facturas en PDF de forma autónoma y realiza cálculos empresariales avanzados. Incluye módulos de control de inventario, reportes estadísticos y seguridad de acceso por roles.",
        image: "assets/proyecto-1.png",
        tech: ["PHP", "MySQL", "JavaScript", "TCPDF", "Bootstrap"],
        features: [
            "Generación automática de facturas en PDF",
            "Control de inventario en tiempo real",
            "Reportes estadísticos y gráficos",
            "Sistema de roles y permisos",
            "Dashboard administrativo completo"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    },
    {
        id: 2,
        title: "Dashboard Epidemiológico",
        category: "Data Analytics",
        description: "Dashboard interactivo con PowerBI que analiza grandes volúmenes de datos sobre enfermedades en Latinoamérica. Permite segmentar por país y región, identificar tendencias epidemiológicas y visualizar los medicamentos más consumidos.",
        image: "assets/proyecto-2.png",
        tech: ["PowerBI", "Google BigQuery", "SQL", "Python", "DAX"],
        features: [
            "Visualizaciones interactivas en tiempo real",
            "Conexión con BigQuery para datos masivos",
            "Segmentación por país y región",
            "Análisis de tendencias epidemiológicas",
            "Exportación de reportes automáticos"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    },
    {
        id: 3,
        title: "Portal Turístico Ecuador",
        category: "Web + IA",
        description: "Plataforma turística para Ecuador con integración de inteligencia artificial. Los usuarios pueden consultar destinos, restaurantes y actividades, recibiendo respuestas automáticas gracias a un chatbot IA conectado a una API propia.",
        image: "assets/proyecto-3.png",
        tech: ["Laravel", "Vue.js", "OpenAI API", "MySQL", "Google Maps"],
        features: [
            "Chatbot con IA para consultas turísticas",
            "Mapas interactivos con puntos de interés",
            "Sistema de recomendaciones personalizadas",
            "Panel de administración para empresas",
            "Reservas y pagos integrados"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    },
    {
        id: 4,
        title: "Sistema Hospitalario",
        category: "Sistema de Salud",
        description: "Plataforma para clínicas y consultorios que gestiona citas, historial clínico, recetas electrónicas y comunicación con pacientes. Incorpora inteligencia artificial para responder preguntas médicas generales.",
        image: "assets/proyecto-4.png",
        tech: ["Java", "Spring Boot", "PostgreSQL", "WebRTC", "React"],
        features: [
            "Gestión completa de citas médicas",
            "Historial clínico electrónico",
            "Recetas digitales con firma",
            "Módulo de telemedicina con video",
            "Asistente IA para consultas básicas"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    },
    {
        id: 5,
        title: "Sistema de Laboratorio",
        category: "Sistema Académico",
        description: "Solución integral para la gestión de laboratorios académicos y científicos. Permite administrar estudiantes, profesores, equipos y experimentos, con seguimiento de resultados y generación de informes automáticos.",
        image: "assets/proyecto-5.png",
        tech: ["PHP", "Laravel", "MySQL", "Chart.js", "Bootstrap"],
        features: [
            "Gestión de estudiantes y profesores",
            "Inventario de equipos de laboratorio",
            "Registro de experimentos y resultados",
            "Generación de informes PDF",
            "Calendario de prácticas"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    },
    {
        id: 6,
        title: "Sistema de Cursos",
        category: "Plataforma Educativa",
        description: "Sistema avanzado para la gestión de profesores, estudiantes, materias y notas. Utiliza APIs en PHP y Java para sincronización bidireccional de datos, permitiendo administración eficiente y escalable.",
        image: "assets/proyecto-6.png",
        tech: ["PHP", "Java API", "Vue.js", "MySQL", "REST API"],
        features: [
            "Gestión de usuarios multi-rol",
            "Sistema de calificaciones automatizado",
            "APIs sincronizadas PHP-Java",
            "Reportes de rendimiento académico",
            "Notificaciones en tiempo real"
        ],
        github: "https://github.com/Ariel-Mauricio",
        demo: "#"
    }
];

// Open modal
document.querySelectorAll('.project-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = parseInt(btn.getAttribute('data-project'));
        const project = projectData.find(p => p.id === projectId);
        
        if (project) {
            openProjectModal(project);
        }
    });
});

function openProjectModal(project) {
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTech = document.getElementById('modal-tech');
    const modalFeatures = document.getElementById('modal-features');
    const modalGithub = document.getElementById('modal-github');
    const modalDemo = document.getElementById('modal-demo');
    
    modalImg.src = project.image;
    modalImg.alt = project.title;
    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    // Tech tags
    modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');
    
    // Features
    modalFeatures.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');
    
    // Links
    modalGithub.href = project.github;
    modalDemo.href = project.demo;
    
    // Show modal
    projectModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
projectModal?.querySelector('.modal-close')?.addEventListener('click', closeModal);
projectModal?.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('show')) {
        closeModal();
    }
});

function closeModal() {
    projectModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ================ FORM HANDLING ================
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Create mailto link with form data
    const subject = encodeURIComponent(data.subject || 'Contacto desde Portfolio');
    const body = encodeURIComponent(
        `Nombre: ${data.name}\n` +
        `Email: ${data.email}\n\n` +
        `Mensaje:\n${data.message}`
    );
    
    window.location.href = `mailto:ariel241103@hotmail.com?subject=${subject}&body=${body}`;
    
    // Show success message
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Abriendo email!</span>';
    btn.classList.add('success-pulse');
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('success-pulse');
        contactForm.reset();
    }, 3000);
});

// ================ PARTICLES (PROFESSIONAL) ================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Reduced on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 10 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ================ SMOOTH SCROLL ================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================ MAGNETIC BUTTON EFFECT ================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ================ TILT EFFECT FOR CARDS ================
document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ================ CONSOLE MESSAGE ================
console.log(`
%c ¡Hola! 👋 
%c Gracias por revisar mi código. 
%c Si te interesa trabajar conmigo, escríbeme: ariel241103@hotmail.com

`, 
'color: #00f5d4; font-size: 24px; font-weight: bold;',
'color: #a0a0b0; font-size: 14px;',
'color: #7b2cbf; font-size: 12px;'
);
