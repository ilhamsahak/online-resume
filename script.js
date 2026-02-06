document.addEventListener('DOMContentLoaded', () => {
    const githubProjectsContainer = document.getElementById('github-projects');
    const username = 'ilhamsahak';
    const githubToken = ''; // Optional: Add token if needed for higher rate limits
    const initialDisplayCount = 6;
    let allRepos = [];

    async function fetchRepositories() {
        try {
            githubProjectsContainer.innerHTML = '<p class="loading-message body-text">Fetching projects from GitHub...</p>';
            const headers = githubToken ? { 'Authorization': `token ${githubToken}` } : {};
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`, { headers });

            if (reposResponse.status === 403) {
                throw new Error("GitHub API rate limit reached. Please try again in an hour or add a personal access token.");
            }

            if (!reposResponse.ok) throw new Error(`GitHub API error: ${reposResponse.status}`);

            allRepos = await reposResponse.json();

            if (allRepos.length === 0) {
                githubProjectsContainer.innerHTML = '<p class="body-text">No public repositories found.</p>';
                return;
            }

            githubProjectsContainer.innerHTML = '';
            await displayProjects(allRepos.slice(0, initialDisplayCount));

            if (allRepos.length > initialDisplayCount) {
                const seeMoreButton = document.createElement('button');
                seeMoreButton.textContent = 'View More Projects';
                seeMoreButton.classList.add('see-more-button');
                githubProjectsContainer.after(seeMoreButton);

                seeMoreButton.addEventListener('click', async () => {
                    seeMoreButton.disabled = true;
                    seeMoreButton.textContent = 'Loading...';
                    await displayProjects(allRepos.slice(initialDisplayCount));
                    seeMoreButton.remove();
                });
            }

        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            githubProjectsContainer.innerHTML = `
                <div class="error-container" style="padding: 2rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 1rem; background: rgba(239, 68, 68, 0.05);">
                    <p class="body-text" style="color: #ef4444; margin-bottom: 1rem;">Failed to load projects: ${error.message}</p>
                    <button onclick="location.reload()" class="see-more-button" style="margin: 0;">Retry Loading</button>
                </div>
            `;
        }
    }

    async function displayProjects(reposToDisplay) {
        const headers = githubToken ? { 'Authorization': `token ${githubToken}` } : {};

        for (const repo of reposToDisplay) {
            if (!repo.languages) {
                try {
                    const langRes = await fetch(repo.languages_url, { headers });
                    repo.languages = langRes.ok ? await langRes.json() : {};
                } catch (e) {
                    repo.languages = {};
                }
            }
            appendRepositoryCard(repo);
        }
    }

    function appendRepositoryCard(repo) {
        const card = document.createElement('div');
        card.classList.add('github-project-card');

        const title = document.createElement('h3');
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = repo.name.replace(/-/g, ' ');
        title.appendChild(link);
        card.appendChild(title);

        if (repo.description) {
            const desc = document.createElement('p');
            desc.textContent = repo.description.length > 100
                ? repo.description.substring(0, 100) + '...'
                : repo.description;
            card.appendChild(desc);
        }

        const langList = document.createElement('ul');
        langList.classList.add('language-list');

        const languages = Object.keys(repo.languages).slice(0, 3);
        if (languages.length > 0) {
            languages.forEach(lang => {
                const item = document.createElement('li');
                item.classList.add('language-item');
                item.textContent = lang;
                langList.appendChild(item);
            });
        } else if (repo.language) {
            const item = document.createElement('li');
            item.classList.add('language-item');
            item.textContent = repo.language;
            langList.appendChild(item);
        }

        card.appendChild(langList);
        githubProjectsContainer.appendChild(card);
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

    sections.forEach(section => observer.observe(section));

    fetchRepositories();
});