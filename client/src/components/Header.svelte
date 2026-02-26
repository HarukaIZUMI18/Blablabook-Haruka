<script>
  import { Link } from "svelte-routing";
  import Login from "./Login.svelte";
  import Logo from "../lib/assets/Blablabook.svg?raw";

  let showAuth = false;
  let authMode = "login";

  let token = localStorage.getItem("token");

  // Cette fonction sera appelée par le composant Login après succès
  function handleLoginSuccess(newToken) {
    token = newToken;
    showAuth = false;
  }

  function logout() {
    localStorage.removeItem("token");
    token = null;
  }
</script>

<header>
  <nav class="nav-container">
    <div class="nav-top">
      <a class="logo" href="/">
        {@html Logo}
      </a>

      <div class="buttons">
        <input
          type="text"
          class="search-input"
          placeholder="Rechercher un livre..."
        />
        {#if !token}
          <button
            onclick={() => {
              authMode = "login";
              showAuth = true;
            }}
          >
            Connexion
          </button>
          <button
            onclick={() => {
              authMode = "register";
              showAuth = true;
            }}
          >
            Inscription
          </button>
        {:else}
          <button class="logout-btn" onclick={logout}>Déconnexion</button>
        {/if}
      </div>
    </div>

    {#if token}
      <div class="nav-bottom">
        <button>
          <a href="/profil">Mon Profil</a>
        </button>
        <button>
          <a href="/collection">Ma Collection</a>
        </button>
        <button>
          <a href="/livres">Liste des livres</a>
        </button>
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
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-primary); /* Assurez-vous d'avoir un fond */
    box-shadow: var(--shadow);
    padding: 0.5rem 0; /* Padding vertical réduit ici */
  }

  .nav-bottom a {
    text-decoration: none;
    color: var(--color-text);
    cursor: pointer;
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

  /* Ajustement du logo pour éviter qu'il ne casse la hauteur */
  .logo :global(svg) {
    height: 60px; /* 120px était peut-être un peu grand pour un header à deux lignes */
    width: auto;
    display: block;
  }

  .logo :global(svg path) {
    fill: var(--color-text);
  }

  .buttons {
    display: flex;
    gap: 1rem;
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
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
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

  .search-input:focus {
    outline: none;
    width: 250px; /* S'agrandit légèrement au focus */
    border-color: var(--color-secondary);
    background: white;
    box-shadow: 0 0 0 4px rgba(var(--color-secondary-rgb), 0.1); /* Halo autour */
  }
  /* Styles de la Modale */
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
    width: 100%;
    max-width: 400px;
    z-index: 999;
  }
</style>
