<script>
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import ThemeSwitcher from "./ThemeSwitcher.svelte";

  function isActive(path) {
    const currentPath = $page.url.pathname;
    const basePath = base || "";

    if (path === "/") {
      return currentPath === basePath + "/" || currentPath === basePath;
    }

    return (
      currentPath === basePath + path ||
      currentPath.startsWith(basePath + path + "/")
    );
  }
</script>

<header>
  <nav class="navbar">
    <div class="logo">
      <a href="{base}/">
        <img
          src="https://educacao-executiva.fgv.br/sites/educacao-executiva.fgv.br/files/fvg-educacao-executiva_0.png"
          alt="FGV Logo"
        />
      </a>
    </div>
    <ul class="nav-links">
      <li>
        <a href="{base}/" class:active={isActive("/")}>Home</a>
      </li>
      <li>
        <a href="{base}/projects" class:active={isActive("/projects")}
          >Projects</a
        >
      </li>
      <li>
        <a href="{base}/contact" class:active={isActive("/contact")}>Contact</a>
      </li>
      <li>
        <a href="{base}/meta" class:active={isActive("/meta")}>Meta</a>
      </li>
      <li>
        <a href="{base}/meta2" class:active={isActive("/meta2")}>Meta2</a>
      </li>
      <li>
        <a href="https://github.com/LuisSante/" target="_blank" rel="noopener"
          >GitHub</a
        >
      </li>
    </ul>
    <div class="theme-toggle">
      <ThemeSwitcher />
    </div>
  </nav>
</header>

<style>
  /* Modern navbar */
header {
  background-color: var(--card-bg);
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
}

.logo a {
  display: flex;
  align-items: center;
}

.logo a img {
  max-width: 140px;
  height: auto;
  transition: transform 0.3s ease;
}

.logo a:hover img {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links li {
  position: relative;
}

.nav-links li a {
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-links li a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.nav-links li a:hover {
  color: var(--primary);
}

.nav-links li a:hover::after,
.nav-links li a.active::after {
  width: 100%;
}

.nav-links li a.active {
  color: var(--primary);
  font-weight: 600;
}

.theme-toggle {
  margin-left: 1rem;
}


/* Mobile navigation */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.75rem 1rem;
  }

  .logo {
    margin-bottom: 0.5rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .theme-toggle {
    order: 2;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-links li a {
    padding: 0.25rem 0.5rem;
  }
}

</style>