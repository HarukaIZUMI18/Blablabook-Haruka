<script>
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";

  let user = null;
  let loading = true;
  let message = "";
  let messageType = "";

  let newName = "";
  let confirmName = "";
  let newEmail = "";
  let confirmEmail = "";
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";

  let savingName = false;
  let savingEmail = false;
  let savingPassword = false;

  onMount(async () => {
    await loadUserInfo();
  });

  async function loadUserInfo() {
    try {
      loading = true;
      user = await api.getUserInfo();
    } catch (err) {
      message = "Erreur lors du chargement du profil";
      messageType = "error";
    } finally {
      loading = false;
    }
  }

  function showMessage(text, type) {
    message = text;
    messageType = type;
    setTimeout(() => {
      message = "";
    }, 3000);
  }

  async function handleUpdateName() {
    if (!newName || !confirmName) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }
    if (newName !== confirmName) {
      showMessage("Les noms ne correspondent pas", "error");
      return;
    }

    try {
      savingName = true;
      await api.updateProfile({ name: newName });
      user.name = newName;
      newName = "";
      confirmName = "";
      showMessage("Nom mis à jour avec succès", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingName = false;
    }
  }

  async function handleUpdateEmail() {
    if (!newEmail || !confirmEmail) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }
    if (newEmail !== confirmEmail) {
      showMessage("Les emails ne correspondent pas", "error");
      return;
    }

    try {
      savingEmail = true;
      await api.updateProfile({ email: newEmail });
      user.email = newEmail;
      newEmail = "";
      confirmEmail = "";
      showMessage("Email mis à jour avec succès", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingEmail = false;
    }
  }

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas", "error");
      return;
    }
    if (newPassword.length < 8) {
      showMessage("Le mot de passe doit contenir au moins 8 caractères", "error");
      return;
    }

    try {
      savingPassword = true;
      await api.updateProfile({ 
        password: newPassword, 
        currentPassword: currentPassword 
      });
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
      showMessage("Mot de passe mis à jour avec succès", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingPassword = false;
    }
  }
</script>

<section class="profil-container">
  <h2>Mon profil</h2>

  {#if message}
    <div class="message" class:success={messageType === "success"} class:error={messageType === "error"}>
      {message}
    </div>
  {/if}

  {#if loading}
    <p class="loading">Chargement...</p>
  {:else if user}
    <div class="section">
      <h3>Récapitulatif du compte</h3>
      <div class="info-row">
        <span class="label">Nom :</span>
        <span class="value">{user.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Email :</span>
        <span class="value">{user.email}</span>
      </div>
      <div class="info-row">
        <span class="label">Membre depuis :</span>
        <span class="value">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
      </div>
    </div>

    <div class="section">
      <h3>Changer le nom</h3>
      <form on:submit|preventDefault={handleUpdateName}>
        <div class="field">
          <label for="newName">Nouveau nom</label>
          <input 
            id="newName" 
            type="text" 
            bind:value={newName} 
            placeholder="Nouveau nom"
          />
        </div>
        <div class="field">
          <label for="confirmName">Confirmer le nom</label>
          <input 
            id="confirmName" 
            type="text" 
            bind:value={confirmName} 
            placeholder="Confirmer le nom"
          />
        </div>
        <button type="submit" disabled={savingName}>
          {savingName ? "Enregistrement..." : "OK"}
        </button>
      </form>
    </div>

    <div class="section">
      <h3>Changer l'adresse mail</h3>
      <form on:submit|preventDefault={handleUpdateEmail}>
        <div class="field">
          <label for="newEmail">Nouvel email</label>
          <input 
            id="newEmail" 
            type="email" 
            bind:value={newEmail} 
            placeholder="nouveau@email.com"
          />
        </div>
        <div class="field">
          <label for="confirmEmail">Confirmer l'email</label>
          <input 
            id="confirmEmail" 
            type="email" 
            bind:value={confirmEmail} 
            placeholder="Confirmer l'email"
          />
        </div>
        <button type="submit" disabled={savingEmail}>
          {savingEmail ? "Enregistrement..." : "OK"}
        </button>
      </form>
    </div>

    <div class="section">
      <h3>Changer le mot de passe</h3>
      <form on:submit|preventDefault={handleUpdatePassword}>
        <div class="field">
          <label for="currentPassword">Mot de passe actuel</label>
          <input 
            id="currentPassword" 
            type="password" 
            bind:value={currentPassword} 
            placeholder="Mot de passe actuel"
            required
          />
        </div>
        <div class="field">
          <label for="newPassword">Nouveau mot de passe</label>
          <input 
            id="newPassword" 
            type="password" 
            bind:value={newPassword} 
            placeholder="Nouveau mot de passe (min. 8 caractères)"
          />
        </div>
        <div class="field">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input 
            id="confirmPassword" 
            type="password" 
            bind:value={confirmPassword} 
            placeholder="Confirmer le mot de passe"
          />
        </div>
        <button type="submit" disabled={savingPassword}>
          {savingPassword ? "Enregistrement..." : "OK"}
        </button>
      </form>
    </div>
  {/if}
</section>

<style>
  .profil-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .message {
    padding: 1rem;
    border-radius: var(--radius);
    margin-bottom: 1rem;
    text-align: center;
  }

  .message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .loading {
    text-align: center;
    color: var(--color-text);
  }

  .section {
    background: white;
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
  }

  .section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-text);
    font-size: 1rem;
    border-bottom: 2px solid var(--color-secondary);
    padding-bottom: 0.5rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    gap: 0.25rem;
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.9rem;
  }

  .value {
    color: var(--color-text);
    font-size: 0.9rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  input {
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
  }

  button {
    padding: 0.6rem 1.25rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    background: var(--color-secondary);
    color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition: all 0.2s;
    align-self: flex-start;
  }

  button:hover:not(:disabled) {
    box-shadow: var(--shadow-btn-hover);
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ===== DESKTOP (≥1024px) ===== */
  @media (min-width: 1024px) {
    .profil-container {
      max-width: 700px;
      padding: 2.5rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .section {
      padding: 2rem;
      margin-bottom: 2rem;
      border-radius: 12px;
    }

    .section h3 {
      font-size: 1.25rem;
    }

    .info-row {
      padding: 0.75rem 0;
    }

    .label {
      font-size: 1.1rem;
    }

    .value {
      font-size: 1.1rem;
    }

    form {
      gap: 1.25rem;
    }

    .field {
      gap: 0.5rem;
    }

    label {
      font-size: 0.95rem;
    }

    input {
      padding: 0.85rem;
      font-size: 1.05rem;
    }

    button {
      padding: 0.85rem 2rem;
      font-size: 1.05rem;
    }
  }
</style>

