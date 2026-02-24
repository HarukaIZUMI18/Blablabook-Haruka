<script>
  import {api} from "./service/api.service.js";

  let email = "";
  let password = "";
  let message = "";

  async function handleLogin() {
    try {
      const response = await api.login({ email, password });
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }
      message = " Connecté !";
    } catch (err) {
      message = " " + err.message;
    }
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Mot de passe" required />
  <button type="submit">Se connecter</button>
</form>

{#if message}
  <p>{message}</p>
{/if}
<p>Token : {localStorage.getItem("token") ?? "aucun"}</p>
