<script>
  import { onMount } from "svelte";

  let theme = "light";

  onMount(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      theme = storedTheme;
      document.documentElement.classList.add(theme);
    }
  });

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
    theme = newTheme;
  }
</script>

<button
  on:click={toggleTheme}
  class="theme-switcher"
  aria-label="Toggle dark mode"
>
  {#if theme === "light"}
    <span>🌙</span>
  {:else}
    <span>☀️</span>
  {/if}
</button>

<style>

button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(58, 134, 255, 0.3);
}

button:active {
  transform: translateY(0);
}

/* Theme switcher button */
button.theme-switcher {
  background-color: transparent;
  color: var(--text-color);
  box-shadow: none;
  padding: 0.5rem;
  border-radius: 50%;
}

button.theme-switcher:hover {
  background-color: var(--border-color);
  transform: rotate(15deg);
}
</style>