/* ===============================================
   GITHUB PROJECTS - CARGA AUTOMÁTICA
   Conecta con la API de GitHub para mostrar repos
   =============================================== */

const GITHUB_USERNAME = 'Ariel-Mauricio';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Cache para evitar llamadas excesivas a la API
const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Colores de lenguajes (GitHub style)
const languageColors = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'PHP': '#777bb4',
    'Java': '#ed8b00',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#42b883',
    'Blade': '#f7523f',
    'Shell': '#89e051',
    'C#': '#239120',
    'C++': '#00599c',
    'Ruby': '#cc342d',
    'Go': '#00add8',
    'Rust': '#dea584',
    'Swift': '#f05138',
    'Kotlin': '#7f52ff',
    'Dart': '#00b4ab',
    'SCSS': '#c6538c',
    'Dockerfile': '#2496ed'
};

// Íconos para categorías
const categoryIcons = {
    'web': 'fas fa-globe',
    'sistema': 'fas fa-cogs',
    'data': 'fas fa-chart-bar',
    'mobile': 'fas fa-mobile-alt',
    'api': 'fas fa-server',
    'default': 'fas fa-code'
};

// Detectar categoría basada en lenguaje/nombre
function detectCategory(repo) {
    const name = repo.name.toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    
    if (name.includes('api') || desc.includes('api')) return 'api';
    if (name.includes('mobile') || name.includes('app') || lang === 'dart' || lang === 'kotlin' || lang === 'swift') return 'mobile';
    if (name.includes('dashboard') || name.includes('data') || name.includes('analytics') || lang === 'python' || desc.includes('powerbi')) return 'data';
    if (name.includes('sistema') || name.includes('system') || name.includes('erp') || name.includes('crm') || desc.includes('sistema') || name.includes('finanzas') || name.includes('ecommerce')) return 'sistema';
    if (lang === 'html' || lang === 'css' || lang === 'javascript' || lang === 'typescript' || lang === 'vue' || lang === 'php' || lang === 'blade' || desc.includes('web') || desc.includes('laravel')) return 'web';
    
    return 'web';
}

// Obtener repos de cache o API
async function fetchGitHubRepos() {
    // Verificar cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('📦 Cargando repos desde cache');
                return data;
            }
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
        }
    }
    
    try {
        console.log('🔄 Obteniendo repos de GitHub...');
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filtrar: no forks, con descripción preferentemente
        const filteredRepos = repos.filter(repo => !repo.fork);
        
        // Guardar en cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: filteredRepos,
            timestamp: Date.now()
        }));
        
        console.log(`✅ ${filteredRepos.length} repos cargados`);
        return filteredRepos;
        
    } catch (error) {
        console.error('❌ Error al cargar repos:', error);
        
        // Intentar usar cache expirado si existe
        if (cached) {
            const { data } = JSON.parse(cached);
            console.log('⚠️ Usando cache expirado');
            return data;
        }
        
        return [];
    }
}

// Obtener lenguajes del repo (con cache)
async function fetchRepoLanguages(repo) {
    const cacheKey = `repo_langs_${repo.name}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
        return JSON.parse(cached);
    }
    
    try {
        const response = await fetch(repo.languages_url);
        if (response.ok) {
            const languages = await response.json();
            sessionStorage.setItem(cacheKey, JSON.stringify(languages));
            return languages;
        }
    } catch (e) {
        console.warn(`No se pudieron cargar lenguajes para ${repo.name}`);
    }
    
    return repo.language ? { [repo.language]: 100 } : {};
}

// Formatear número (1000 -> 1k)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

// Formatear fecha relativa
function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
    return `hace ${Math.floor(diffDays / 365)} años`;
}

// Crear tarjeta de proyecto
function createProjectCard(repo, index) {
    const category = detectCategory(repo);
    const langColor = languageColors[repo.language] || '#8b8b8b';
    const delay = (index % 6) * 100;
    
    const card = document.createElement('article');
    card.className = 'project-card github-project';
    card.setAttribute('data-category', category);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', delay);
    
    // Generar placeholder de imagen basado en nombre
    const placeholderBg = `linear-gradient(135deg, ${langColor}20 0%, var(--bg-card) 100%)`;
    
    card.innerHTML = `
        <div class="project-image github-project-header" style="background: ${placeholderBg}">
            <div class="github-project-icon">
                <i class="${categoryIcons[category] || categoryIcons.default}"></i>
            </div>
            <div class="project-overlay">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn" title="Ver código">
                    <i class="fab fa-github"></i>
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-btn" title="Ver demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
            <div class="github-stats-badge">
                <span class="stat-item" title="Stars">
                    <i class="fas fa-star"></i> ${formatNumber(repo.stargazers_count)}
                </span>
                <span class="stat-item" title="Forks">
                    <i class="fas fa-code-branch"></i> ${formatNumber(repo.forks_count)}
                </span>
            </div>
        </div>
        <div class="project-content">
            <div class="project-meta">
                ${repo.language ? `
                    <span class="project-language">
                        <span class="lang-dot" style="background-color: ${langColor}"></span>
                        ${repo.language}
                    </span>
                ` : ''}
                <span class="project-updated">
                    <i class="fas fa-clock"></i>
                    ${formatRelativeDate(repo.updated_at)}
                </span>
            </div>
            <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
            <p class="project-description">
                ${repo.description || 'Proyecto sin descripción disponible.'}
            </p>
            <div class="project-tech" id="langs-${repo.id}">
                ${repo.language ? `<span>${repo.language}</span>` : '<span>Code</span>'}
            </div>
            <div class="project-actions">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
                    <i class="fab fa-github"></i>
                    <span>Ver código</span>
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                        <i class="fas fa-rocket"></i>
                        <span>Demo</span>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Actualizar lenguajes en la tarjeta (carga diferida)
async function updateCardLanguages(repo) {
    const languages = await fetchRepoLanguages(repo);
    const langContainer = document.getElementById(`langs-${repo.id}`);
    
    if (langContainer && Object.keys(languages).length > 0) {
        const langNames = Object.keys(languages).slice(0, 4);
        langContainer.innerHTML = langNames.map(lang => `<span>${lang}</span>`).join('');
    }
}

// Renderizar todos los proyectos
async function renderGitHubProjects() {
    const container = document.getElementById('github-projects-grid');
    const loader = document.getElementById('github-loader');
    const errorMsg = document.getElementById('github-error');
    
    if (!container) return;
    
    // Mostrar loader
    if (loader) loader.style.display = 'flex';
    if (errorMsg) errorMsg.style.display = 'none';
    
    try {
        const repos = await fetchGitHubRepos();
        
        if (repos.length === 0) {
            throw new Error('No se encontraron repositorios');
        }
        
        // Limpiar container
        container.innerHTML = '';
        
        // Crear tarjetas
        repos.forEach((repo, index) => {
            const card = createProjectCard(repo, index);
            container.appendChild(card);
            
            // Cargar lenguajes de forma diferida (mejora rendimiento)
            setTimeout(() => updateCardLanguages(repo), 100 * index);
        });
        
        // Reinicializar efectos de hover
        initProjectEffects();
        
        // Actualizar filtros
        updateFilterButtons(repos);
        
        // Ocultar loader
        if (loader) loader.style.display = 'none';
        
        // Reinicializar AOS si existe
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
    } catch (error) {
        console.error('Error renderizando proyectos:', error);
        if (loader) loader.style.display = 'none';
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudieron cargar los proyectos</p>
                <button class="btn btn-sm btn-outline" onclick="renderGitHubProjects()">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            `;
        }
    }
}

// Actualizar contadores de filtros
function updateFilterButtons(repos) {
    const categories = {};
    repos.forEach(repo => {
        const cat = detectCategory(repo);
        categories[cat] = (categories[cat] || 0) + 1;
    });
    
    // Actualizar badges en botones de filtro
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        const count = filter === 'all' ? repos.length : (categories[filter] || 0);
        
        let badge = btn.querySelector('.filter-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'filter-count';
            btn.appendChild(badge);
        }
        badge.textContent = count;
    });
}

// Inicializar efectos en tarjetas (OPTIMIZED)
function initProjectEffects() {
    // Skip heavy effects on mobile
    if (window.innerWidth < 768) return;
    
    document.querySelectorAll('.github-project').forEach(card => {
        // Simplified tilt - only on desktop
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Reduced tilt intensity
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Filtrar proyectos de GitHub
function initGitHubFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const projects = document.querySelectorAll('.github-project');
            
            projects.forEach((project, index) => {
                const category = project.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50 * (index % 6));
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
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar proyectos cuando el DOM esté listo
    renderGitHubProjects();
    
    // Inicializar filtros
    initGitHubFilters();
});

// Refrescar proyectos (función pública)
window.refreshGitHubProjects = () => {
    localStorage.removeItem(CACHE_KEY);
    renderGitHubProjects();
};
