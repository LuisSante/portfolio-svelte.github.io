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
  
  <button on:click={toggleTheme}>
    {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
  </button>
  