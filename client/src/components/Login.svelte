<script>
  import { api } from "../service/api.service.js";

  export let isLogin = true;
  export let onSuccess; 

  let email = "";
  let password = "";
  let name = "";
  let confirm = "";
  let message = "";
  let loading = false;

  async function handleSubmit() {
    message = "";
    loading = true;

    try {
      let response;
      if (isLogin) {
        response = await api.login({ email, password });
      } else {
        if (password !== confirm)
          throw new Error("Les mots de passe ne correspondent pas");
        response = await api.register({ name, email, password, confirm });
      }

      if (response?.token) {
        localStorage.setItem("token", response.token);
        if (onSuccess) {
          onSuccess(response.token);
        }
        window.location.href = "/";

        message = isLogin ? "Connecté !" : "Compte créé !";
      }
    } catch (err) {
      message = "Erreur : " + err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <h2>{isLogin ? "Se connecter" : "Créer un compte"}</h2>

  <form on:submit|preventDefault={handleSubmit}>
    {#if !isLogin}
      <div class="field">
        <label for="name">Nom</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Votre nom"
          required
        />
      </div>
    {/if}

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="nom@exemple.com"
        required
      />
    </div>

    <div class="field">
      <label for="password">Mot de passe</label>
      <input id="password" type="password" bind:value={password} required />
    </div>

    {#if !isLogin}
      <div class="field">
        <label for="confirm">Confirmer le mot de passe</label>
        <input id="confirm" type="password" bind:value={confirm} required />
      </div>
    {/if}

    <button type="submit">
      {isLogin ? "Connexion" : "S'inscrire"}
    </button>
  </form>

  {#if message}
    <p class="status-message" class:error={message.includes("Erreur")}>
      {message}
    </p>
  {/if}
</div>

<style>
  .auth-container h2 {
    margin-top: 0;
    text-align: center;
    color: #1a1a1a;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
  }

  button[type="submit"] {
    border: none;
    padding: 0.8rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    background: var(--color-secondary);
    color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }

  button[type="submit"]:hover {
    box-shadow: var(--shadow-btn-hover);
    transform: translateY(-1px);
  }

  .status-message {
    margin-top: 0.5rem;
    text-align: center;
    color: green;
  }

  .status-message.error {
    color: #d32f2f;
  }
</style>