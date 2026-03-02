<script>
  import Login from "./Login.svelte";
  import Logo from "../lib/assets/Blablabook.svg?raw";

  let showAuth = $state(false);
  let authMode = $state("login");
  let token = $state(localStorage.getItem("token"));
  let isMenuOpen = $state(false);

  function handleLoginSuccess(newToken) {
    token = newToken;
    showAuth = false;
    isMenuOpen = false;
  }

  function logout() {
    localStorage.removeItem("token");
    token = null;
    isMenuOpen = false;
    window.location.replace("/");
  }
</script>

<header>
  <nav class="nav-container">
    <div class="nav-top">
      <a class="logo" href="/">
        {@html Logo}
      </a>

      <!-- Liens desktop (toujours rendus, cachés via CSS sur mobile) -->
      <div class="desktop-nav">
        <input
          type="text"
          class="search-input"
          placeholder="Rechercher un livre..."
        />

        {#if !token}
          <a href="/livres" class="link">Catalogue</a>
          <button
            onclick={() => {
              authMode = "login";
              showAuth = true;
            }}>Connexion</button
          >
          <button
            onclick={() => {
              authMode = "register";
              showAuth = true;
            }}>Inscription</button
          >
        {:else}
          <a href="/livres" class="link">Catalogue</a>
          <a href="/collection" class="link">Ma collection</a>
          <a href="/profil" class="link">Mon profil</a>
          <button onclick={logout}>Déconnexion</button>
        {/if}
      </div>

      <button
        class="burger-menu"
        class:is-open={isMenuOpen}
        onclick={() => (isMenuOpen = !isMenuOpen)}
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Drawer mobile -->
    <div
      id="mobile-menu"
      class="mobile-drawer"
      class:is-open={isMenuOpen}
      aria-hidden={!isMenuOpen}
    >
      <input
        type="text"
        class="search-input"
        placeholder="Rechercher un livre..."
        tabindex={isMenuOpen ? 0 : -1}
      />

      {#if !token}
        <a
          href="/livres"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Catalogue</a
        >
        <button
          class="mobile-btn"
          onclick={() => {
            authMode = "login";
            showAuth = true;
            isMenuOpen = false;
          }}>Connexion</button
        >
        <button
          class="mobile-btn"
          onclick={() => {
            authMode = "register";
            showAuth = true;
            isMenuOpen = false;
          }}>Inscription</button
        >
      {:else}
        <a
          href="/livres"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Catalogue</a
        >
        <a
          href="/collection"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Ma collection</a
        >
        <a
          href="/profil"
          class="mobile-link"
          onclick={() => (isMenuOpen = false)}>Mon profil</a
        >
        <button class="mobile-btn" onclick={logout}
          >Déconnexion</button
        >
      {/if}
    </div>
  </nav>
</header>

{#if showAuth}
  <div class="overlay" onclick={() => (showAuth = false)} role="none"></div>
  <div class="auth-modal">
    <Login isLogin={authMode === "login"} onSuccess={handleLoginSuccess} />
  </div>
{/if}

<style>
  header {
    width: 100%;
    background: var(--color-primary);
    box-shadow: var(--shadow);
    padding: 0.5rem 0;
    /* sticky + z-index pour que le drawer ne passe pas sous le contenu */
    position: sticky;
    top: 0;
    z-index: 900;
  }

  .nav-container {
    width: 100%;
    margin: 0 auto;
  }

  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }

  /* ── Logo ── */
  .logo :global(svg) {
    height: 60px;
    width: auto;
    display: block;
  }
  .logo :global(svg path) {
    fill: var(--color-text);
  }

  /* ── Desktop nav ── */
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-input {
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    border: 2px solid var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-primary);
    font-size: 0.9rem;
    width: 200px;
    background: transparent;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }
  .search-input:focus {
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--color-secondary) 20%, transparent);
  }

  .link {
    position: relative;
    font-family: var(--font-primary);
    color: var(--color-text);
    text-decoration: none;
    padding: 0.2rem 0.1rem;
    opacity: 0.75;
    transition: opacity 0.2s;
  }
  .link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--color-secondary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .link:hover {
    opacity: 1;
  }
  .link:hover::after {
    transform: scaleX(1);
  }

  .burger-menu {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    padding: 6px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: none;
    transition: background 0.2s;
  }
  .burger-menu:hover {
    background: color-mix(in srgb, var(--color-text) 8%, transparent);
    transform: none;
    box-shadow: none;
  }

  .burger-menu span {
    display: block;
    width: 100%;
    height: 2.5px;
    background: var(--color-text);
    border-radius: 999px;
    transform-origin: center center;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease;
  }

  .burger-menu.is-open span:nth-child(1) {
    transform: translateY(7.5px) rotate(45deg);
  }
  .burger-menu.is-open span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .burger-menu.is-open span:nth-child(3) {
    transform: translateY(-7.5px) rotate(-45deg);
  }

  .mobile-drawer {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    padding: 0 1rem;
    transition:
      max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease,
      padding 0.3s ease;
  }
  .mobile-drawer.is-open {
    max-height: 480px;
    opacity: 1;
    padding: 0.75rem 1rem 1.25rem;
    border-top: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
  }
  .mobile-drawer .search-input {
    width: 100%;
    box-sizing: border-box;
  }

  .mobile-link {
    display: block;
    font-family: var(--font-primary);
    font-size: 1rem;
    color: var(--color-text);
    text-decoration: none;
    padding: 0.6rem 0.5rem;
    border-radius: var(--radius);
    opacity: 0.8;
    transition:
      opacity 0.2s,
      background 0.2s;
  }
  .mobile-link:hover {
    opacity: 1;
    background: color-mix(in srgb, var(--color-text) 6%, transparent);
  }

  .mobile-btn {
    background: none;
    box-shadow: none;
    text-align: left;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius);
  }
  

  /* ── Modale ── */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 998;
  }
  .auth-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-primary);
    padding: 2.5rem;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    z-index: 999;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .desktop-nav {
      display: none;
    }
    .burger-menu {
      display: flex;
    }
  }
</style>

