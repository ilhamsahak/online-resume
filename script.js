document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-grid');

    function renderProjects() {
        const projectData = window.projects || (typeof projects !== 'undefined' ? projects : null);

        if (!projectsContainer || !projectData) return;

        projectsContainer.innerHTML = '';
        projectData.forEach(project => {
            const card = createProjectCard(project);
            projectsContainer.appendChild(card);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Initialize with retries to handle potential script loading race conditions
    renderProjects();
    setTimeout(renderProjects, 100);
    setTimeout(renderProjects, 500);

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card-new');

        const isPrivate = project.type === 'private' || project.link === '#';

        card.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <div class="project-icon">
                        <i data-lucide="${isPrivate ? 'lock' : 'external-link'}"></i>
                    </div>
                    ${isPrivate ? '<span class="status-badge private">NDA Protected</span>' : '<span class="status-badge public">Live Project</span>'}
                </div>
                <h3 class="project-title-new">${project.title}</h3>
                <p class="project-description-new">${project.description}</p>
                <div class="project-tech-stack">
                    ${project.tech.map(t => `<span class="tech-tag-mini">${t}</span>`).join('')}
                </div>
            </div>
            ${!isPrivate ? `
                <a href="${project.link}" target="_blank" class="project-link-overlay" aria-label="View ${project.title}"></a>
            ` : ''}
        `;

        return card;
    }

    // Navigation Active State
    const sections = document.querySelectorAll('section[id], div[id="skills"]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: "-4.5rem 0px 0px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('is-open');
            const icon = navToggle.querySelector('i, svg');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('is-open');
                const icon = navToggle.querySelector('i, svg');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                }
            });
        });
    }

    sections.forEach(section => observer.observe(section));


});