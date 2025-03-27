<script>
  export let username;
  let user = null;
  let error = null;
  const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
  console.log("GitHub Token:", GITHUB_TOKEN);
  console.log("Username:", username);

  async function fetchGitHubData() {
    console.log("Username:", username);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });

      console.log("API response status:", response.status);

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
  <p>Error: {error} Request failed in GitHub</p>
{:else if user}
  <div>
    <img src={user.avatar_url} alt={user.login} width="100" />
    <p>Nombre: {user.name}</p>
    <p>Repositorios públicos: {user.public_repos}</p>
    <p>Seguidores: {user.followers}</p>
    <p>Siguiendo: {user.following}</p>
  </div>
{:else}
  <p>Cargando datos de GitHub...</p>
{/if}
