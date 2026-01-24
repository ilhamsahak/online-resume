document.addEventListener('DOMContentLoaded', () => {
    const githubProjectsContainer = document.getElementById('github-projects');
    const githubUsername = 'ilhamsahak'; // Your GitHub username

    fetch(`https://api.github.com/users/${githubUsername}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            if (repositories.length === 0) {
                githubProjectsContainer.innerHTML = '<p class="body-text">No public GitHub repositories found.</p>';
                return;
            }

            githubProjectsContainer.innerHTML = ''; // Clear "Loading..." message

            // Sort repositories by update date, newest first
            repositories.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            repositories.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('github-project-card');

                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description provided.'}</p>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                `;
                githubProjectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error fetching GitHub repositories:', error);
            githubProjectsContainer.innerHTML = `<p class="body-text">Failed to load GitHub projects. ${error.message}</p>`;
        });
});
