<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";

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
            <a href="index.html">
                <img
                    src="https://educacao-executiva.fgv.br/sites/educacao-executiva.fgv.br/files/fvg-educacao-executiva_0.png"
                />
            </a>
        </div>
        <ul class="nav-links">
            <li><a href="{base}/" class:active={isActive("/")}>Home</a></li>
            <li>
                <a href="{base}/projects" class:active={isActive("/projects")}
                    >Projects</a
                >
            </li>
            <li>
                <a href="{base}/contact" class:active={isActive("/contact")}
                    >Contact me</a
                >
            </li>
        </ul>
    </nav>
</header>
