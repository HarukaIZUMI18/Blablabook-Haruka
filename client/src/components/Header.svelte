<script>
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
  <nav>
    <a class="logo" href="/">
      {@html Logo}
    </a>
    <div class="buttons">
      {#if !token}
        <button
          on:click={() => {
            authMode = "login";
            showAuth = true;
          }}
        >
          Connexion
        </button>
        <button
          on:click={() => {
            authMode = "register";
            showAuth = true;
          }}
        >
          Inscription
        </button>
      {:else}
        <button class="logout-btn" on:click={logout}>Déconnexion</button>
      {/if}
    </div>
  </nav>
</header>

{#if showAuth}
  <div class="overlay" on:click={() => (showAuth = false)} role="none"></div>
  <div class="auth-modal">
    <Login isLogin={authMode === "login"} onSuccess={handleLoginSuccess} />
  </div>
{/if}

<style>
  header {
    padding: 0 2rem;
    height: 70px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
  }

  nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo :global(svg path) {
    fill: var(--color-text);
  }

  .logo :global(svg) {
    height: 120px;
    width: auto;
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
