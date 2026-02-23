document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-menu');

    if (navToggle && navLinksContainer) {
        navToggle.onclick = () => {
            const isOpen = navLinksContainer.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', isOpen);

            const icon = navToggle.querySelector('i, svg');
            if (icon && window.lucide) {
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                window.lucide.createIcons();
            }
        };

        // Close menu when clicking links
        navLinksContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinksContainer.classList.remove('is-open');
                document.body.classList.remove('menu-open');
                const icon = navToggle.querySelector('i, svg');
                if (icon && window.lucide) {
                    icon.setAttribute('data-lucide', 'menu');
                    window.lucide.createIcons();
                }
            }
        });
    }

    // --- Featured Projects Tab Switcher ---
    const tabBtns = document.querySelectorAll('.featured-tab-btn');
    const tabPanels = document.querySelectorAll('.featured-tab-panel');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab);
            if (target) {
                target.classList.add('active');
                if (window.lucide) window.lucide.createIcons();
            }
        });
    });

    // --- Projects Render ---
    const projectsContainer = document.getElementById('projects-grid');
    function renderProjects() {
        if (!projectsContainer) return;
        const projectData = window.projects || (typeof projects !== 'undefined' ? projects : null);
        if (!projectData) return;

        projectsContainer.innerHTML = '';

        const categories = [
            { key: 'data', label: 'Data Analysis', icon: 'bar-chart-3' },
            { key: 'dev', label: 'Development', icon: 'code-2' }
        ];

        categories.forEach(cat => {
            const filtered = projectData.filter(p => p.category === cat.key);
            if (!filtered.length) return;

            // Subheading
            const heading = document.createElement('div');
            heading.classList.add('projects-category-heading');
            heading.innerHTML = `<i data-lucide="${cat.icon}"></i> ${cat.label}`;
            projectsContainer.appendChild(heading);

            // Grid wrapper
            const grid = document.createElement('div');
            grid.classList.add('projects-category-grid');
            projectsContainer.appendChild(grid);

            filtered.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('project-card-new');
                const isPrivate = project.type === 'private' || project.link === '#';
                card.innerHTML = `
                <div class="project-content">
                    <div class="project-header">
                        <div class="project-icon"><i data-lucide="${isPrivate ? 'lock' : 'external-link'}"></i></div>
                        ${isPrivate ? '<span class="status-badge private">NDA Protected</span>' : '<span class="status-badge public">Live Project</span>'}
                    </div>
                    <h3 class="project-title-new">${project.title}</h3>
                    <p class="project-description-new">${project.description}</p>
                    <div class="project-tech-stack">
                        ${project.tech.map(t => `<span class="tech-tag-mini">${t}</span>`).join('')}
                    </div>
                </div>
                ${!isPrivate ? `<a href="${project.link}" target="_blank" class="project-link-overlay" aria-label="View ${project.title}"></a>` : ''}
            `;
                grid.appendChild(card);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }
    renderProjects();
    setTimeout(renderProjects, 500);


    // --- Observer & Active Links ---
    try {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: "-4.5rem 0px 0px 0px" });
        sections.forEach(s => observer.observe(s));
    } catch (e) { console.error('Observer error:', e); }
});