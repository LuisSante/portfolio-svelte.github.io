<script>
  export let username;
  let user = null;
  let error = null;
  const TOKEN_API = import.meta.env.TOKEN_API;

  async function fetchGitHubData() {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `token ${TOKEN_API}`,
        },
      });

      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      user = await response.json();
    } catch (err) {
      error = err.message;
    }
  }

  import { onMount } from "svelte";
  onMount(() => {
    if (username) fetchGitHubData();
  });
</script>

{#if error}
  <div class="error-message">
    <p>Error: {error}</p>
    <p>Request failed in GitHub</p>
  </div>
{:else if user}
  <div class="github-profile">
    <div class="github-header">
      <img src={user.avatar_url} alt={user.login} class="github-avatar" />
      <div class="github-info">
        <h3>{user.name || user.login}</h3>
        <p class="github-username">@{user.login}</p>
      </div>
    </div>

    <div class="github-stats-grid">
      <div class="stat-item">
        <div class="stat-value">{user.public_repos}</div>
        <div class="stat-label">Repositories</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{user.followers}</div>
        <div class="stat-label">Followers</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{user.following}</div>
        <div class="stat-label">Following</div>
      </div>
    </div>

    {#if user.bio}
      <p class="github-bio">{user.bio}</p>
    {/if}

    <a href={user.html_url} target="_blank" class="github-link">View Profile</a>
  </div>
{:else}
  <div class="loading">
    <p>Loading GitHub data...</p>
    <div class="loading-spinner"></div>
  </div>
{/if}

<style>
  /* GitHub stats section */
.github-stats {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 5px 15px var(--shadow);
}

.github-stats img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.github-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-item {
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* GitHub component specific styles */
.github-profile {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.github-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.github-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--card-bg);
  box-shadow: 0 3px 10px var(--shadow);
}

.github-info h3 {
  margin-bottom: 0.25rem;
  font-size: 1.3rem;
}

.github-username {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.github-bio {
  color: var(--text-color);
  font-style: italic;
  line-height: 1.6;
}

.github-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  align-self: flex-start;
}

.github-link:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(58, 134, 255, 0.3);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  padding: 1rem;
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 3px solid #ff3333;
  border-radius: 6px;
  color: #d32f2f;
}
</style>