<script>
  import { Link } from "svelte-routing";
  import Login from "./Login.svelte";
  import Logo from "../lib/assets/Blablabook.svg?raw";

  let showAuth = $state(false);
  let authMode = $state("login");
  let token = $state(localStorage.getItem("token"));

  // État pour gérer l'ouverture du menu mobile
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

      <button
        class="burger-menu"
        onclick={() => (isMenuOpen = !isMenuOpen)}
        aria-label="Menu"
      >
        <span class={isMenuOpen ? "open" : ""}></span>
        <span class={isMenuOpen ? "open" : ""}></span>
        <span class={isMenuOpen ? "open" : ""}></span>
      </button>

      <div class="nav-content {isMenuOpen ? 'mobile-open' : ''}">
        <div class="buttons">
          <input
            type="text"
            class="search-input"
            placeholder="Rechercher un livre..."
          />

          {#if !token}
            <button><a href="/livres">Liste des livres</a></button>
            <button
              onclick={() => {
                authMode = "login";
                showAuth = true;
                isMenuOpen = false;
              }}
            >
              Connexion
            </button>
            <button
              onclick={() => {
                authMode = "register";
                showAuth = true;
                isMenuOpen = false;
              }}
            >
              Inscription
            </button>
          {:else}
            <div class="mobile-nav-links">
              <button onclick={() => (isMenuOpen = false)}>
                <a href="/profil">Mon Profil</a>
              </button>
              <button onclick={() => (isMenuOpen = false)}>
                <a href="/collection">Ma Collection</a>
              </button>
              <button onclick={() => (isMenuOpen = false)}>
                <a href="/livres">Liste des livres</a>
              </button>
            </div>
            
            <button class="logout-btn" onclick={logout}> Déconnexion </button>
          {/if}
        </div>
      </div>
    </div>

    {#if token}
      <div class="nav-bottom desktop-only">
        <button><a href="/profil">Mon Profil</a></button>
        <button><a href="/collection">Ma Collection</a></button>
        <button><a href="/livres">Liste des livres</a></button>
      </div>
    {/if}
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
    position: relative;
  }
  .mobile-nav-links {
    display: none;
  }
  .nav-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
  }
  .nav-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
  .nav-bottom {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 0.5rem;
  }
  .logo :global(svg) {
    height: 60px;
    width: auto;
    display: block;
  }
  .logo :global(svg path) {
    fill: var(--color-text);
  }
  .buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  button {
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    background: var(--color-secondary);
    border: none;
    color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition:
      box-shadow 0.15s ease,
      transform 0.15s ease;
  }
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  .search-input {
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    border: 2px solid var(--color-bg);
    backdrop-filter: blur(5px);
    color: var(--color-text);
    font-size: 0.9rem;
    width: 200px;
    transition: all 0.2s ease;
  }

  /* --- MODALE --- */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 998;
  }
  .auth-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 2.5rem;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    z-index: 999;
  }

  /* --- BURGER MENU --- */
  .burger-menu {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    box-shadow: none;
    padding: 5px;
  }
  .burger-menu span {
    display: block;
    width: 25px;
    height: 3px;
    background: var(--color-text);
    transition: 0.3s ease;
  }

  /* --- RESPONSIVE 900px --- */
  @media (max-width: 900px) {
    .burger-menu {
      display: flex;
    }

    .desktop-only {
      display: none;
    }

    .nav-content {
      display: none; /* Caché par défaut */
      position: absolute;
      top: 100%; /* Juste en dessous du header */
      left: 0;
      width: 100%;
      background: var(--color-primary);
      flex-direction: column;
      padding: 1.5rem;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      box-sizing: border-box;
    }

    .nav-content.mobile-open {
      display: flex;
    }

    .buttons {
      flex-direction: column;
      width: 100%;
      gap: 1.2rem;
    }

    .search-input {
      width: 100% !important;
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.8rem;
    }

    .mobile-nav-links button {
      width: 100%;
    }

    .logout-btn {
      width: 100%;
      margin-top: 0.5rem;
      background: #b64752;
      color: white;
    }

    .burger-menu span.open:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    .burger-menu span.open:nth-child(2) {
      opacity: 0;
    }
    .burger-menu span.open:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
</style>
