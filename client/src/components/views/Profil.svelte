<script>
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";

  // Données de l'utilisateur
  let user = null;
  let loading = true;

  // Message de retour (succès ou erreur)
  let message = "";
  let messageType = "";

  // États d'édition du nom et de l'email
  let editingName = false;
  let editingEmail = false;

  // Valeurs du formulaire nom
  let newName = "";

  // Valeurs du formulaire email
  let newEmail = "";
  let confirmEmail = "";
  let emailTouched = false;
  let confirmEmailTouched = false;

  // Valeurs du formulaire mot de passe
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let showCurrent = false;
  let showNew = false;
  let showConfirm = false;
  let newPasswordTouched = false;
  let confirmPasswordTouched = false;

  // États de chargement des boutons
  let savingName = false;
  let savingEmail = false;
  let savingPassword = false;

  // Vérification du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $: emailValid  = emailRegex.test(newEmail);
  $: emailsMatch = newEmail === confirmEmail && confirmEmail.length > 0;

  // Règles de sécurité du mot de passe
  $: passwordRules = {
    length:  newPassword.length >= 8,
    upper:   /[A-Z]/.test(newPassword),
    digit:   /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(newPassword),
  };

  // Calcul de la force du mot de passe
  $: passwordScore = Object.values(passwordRules).filter(Boolean).length;
  $: strengthLabel =
    passwordScore <= 1 ? "Très faible" :
    passwordScore === 2 ? "Faible" :
    passwordScore === 3 ? "Moyen" : "Fort";
  $: strengthClass =
    passwordScore <= 1 ? "very-weak" :
    passwordScore === 2 ? "weak" :
    passwordScore === 3 ? "medium" : "strong";
  $: passwordValid  = Object.values(passwordRules).every(Boolean);
  $: passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  // Chargement du profil au démarrage
  onMount(async () => {
    await loadUserInfo();
  });

  // Récupère les infos de l'utilisateur depuis l'API
  async function loadUserInfo() {
    try {
      loading = true;
      user = await api.getUserInfo();
    } catch (err) {
      showMessage("Erreur lors du chargement du profil", "error");
    } finally {
      loading = false;
    }
  }

  // Affiche un message pendant 4 secondes
  function showMessage(text, type) {
    message = text;
    messageType = type;
    setTimeout(() => { message = ""; }, 4000);
  }

  // Formate une date en français
  function formatDate(raw) {
    if (!raw) return "—";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Ouvre le formulaire de modification du nom
  function startEditName() {
    newName = user.name;
    editingName = true;
  }

  // Ferme le formulaire de modification du nom
  function cancelEditName() {
    editingName = false;
    newName = "";
  }

  // Ouvre le formulaire de modification de l'email
  function startEditEmail() {
    newEmail = "";
    confirmEmail = "";
    emailTouched = false;
    confirmEmailTouched = false;
    editingEmail = true;
  }

  // Ferme le formulaire de modification de l'email
  function cancelEditEmail() {
    editingEmail = false;
    newEmail = "";
    confirmEmail = "";
  }

  // Envoie la mise à jour du nom
  async function handleUpdateName() {
    if (!newName.trim()) {
      showMessage("Veuillez saisir un nom", "error");
      return;
    }
    try {
      savingName = true;
      await api.updateProfile({ name: newName.trim() });
      user.name = newName.trim();
      editingName = false;
      newName = "";
      showMessage("Nom mis à jour avec succès ✓", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingName = false;
    }
  }

  // Envoie la mise à jour de l'email
  async function handleUpdateEmail() {
    emailTouched = true;
    confirmEmailTouched = true;
    if (!newEmail || !confirmEmail) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }
    if (!emailValid) {
      showMessage("Format d'email invalide", "error");
      return;
    }
    if (!emailsMatch) {
      showMessage("Les emails ne correspondent pas", "error");
      return;
    }
    try {
      savingEmail = true;
      await api.updateProfile({ email: newEmail });
      user.email = newEmail;
      editingEmail = false;
      newEmail = "";
      confirmEmail = "";
      showMessage("Email mis à jour avec succès ✓", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingEmail = false;
    }
  }

  // Envoie la mise à jour du mot de passe
  async function handleUpdatePassword() {
    newPasswordTouched = true;
    confirmPasswordTouched = true;
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }
    if (!passwordValid) {
      showMessage("Le mot de passe ne respecte pas les règles requises", "error");
      return;
    }
    if (!passwordsMatch) {
      showMessage("Les mots de passe ne correspondent pas", "error");
      return;
    }
    try {
      savingPassword = true;
      await api.updateProfile({ password: newPassword, currentPassword });
      // Réinitialise tous les champs après succès
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
      newPasswordTouched = false;
      confirmPasswordTouched = false;
      showMessage("Mot de passe mis à jour avec succès ✓", "success");
    } catch (err) {
      showMessage(err.message || "Erreur lors de la mise à jour", "error");
    } finally {
      savingPassword = false;
    }
  }
</script>

<!-- Page profil -->
<section class="profil-container" aria-label="Page de profil">

  <h2>Mon profil</h2>

  <!-- Message de succès ou d'erreur -->
  {#if message}
    <div
      class="message"
      class:success={messageType === "success"}
      class:error={messageType === "error"}
      role="alert"
      aria-live="polite"
    >{message}</div>
  {/if}

  <!-- Affichage pendant le chargement -->
  {#if loading}
    <div class="loading" aria-busy="true">
      <span class="spinner" aria-hidden="true"></span>
      Chargement du profil…
    </div>

  {:else if user}

    <!-- Section récapitulatif du compte -->
    <div class="section fade-in" style="animation-delay: 0.05s" aria-labelledby="recap-title">
      <h3 id="recap-title">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        Récapitulatif du compte
      </h3>

      <!-- Ligne : Nom -->
      <div class="info-row">
        <span class="label">Nom</span>
        {#if editingName}
          <!-- Formulaire inline pour modifier le nom -->
          <form class="inline-form" on:submit|preventDefault={handleUpdateName}>
            <input
              type="text"
              bind:value={newName}
              placeholder="Prénom et nom"
              autocomplete="off"
              aria-label="Nouveau nom"
            />
            <!-- Bouton valider -->
            <button type="submit" class="btn-save" disabled={savingName} aria-label="Enregistrer">
              {#if savingName}
                <span class="spinner-sm"></span>
              {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {/if}
            </button>
            <!-- Bouton annuler -->
            <button type="button" class="btn-cancel" on:click={cancelEditName} aria-label="Annuler">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </form>
        {:else}
          <!-- Affichage du nom avec bouton modifier -->
          <div class="value-row">
            <span class="value">{user.name}</span>
            <button class="btn-edit" on:click={startEditName} aria-label="Modifier le nom">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Modifier
            </button>
          </div>
        {/if}
      </div>

      <!-- Ligne : Email -->
      <div class="info-row">
        <span class="label">Email</span>
        {#if editingEmail}
          <!-- Formulaire inline pour modifier l'email -->
          <form class="inline-form email-form" on:submit|preventDefault={handleUpdateEmail}>
            <div class="inline-fields">
              <!-- Champ nouvel email avec validation -->
              <div class="field" class:has-error={emailTouched && newEmail && !emailValid} class:has-success={emailTouched && emailValid}>
                <input
                  type="email"
                  bind:value={newEmail}
                  on:blur={() => (emailTouched = true)}
                  placeholder="Nouvel email"
                  autocomplete="off"
                  aria-label="Nouvel email"
                />
                {#if emailTouched && newEmail}
                  <span class="field-icon {emailValid ? 'ok' : 'ko'}">{emailValid ? "✓" : "✗"}</span>
                {/if}
                {#if emailTouched && newEmail && !emailValid}
                  <span class="error-msg" role="alert">Format invalide</span>
                {/if}
              </div>
              <!-- Champ confirmation email -->
              <div class="field" class:has-error={confirmEmailTouched && confirmEmail && !emailsMatch} class:has-success={confirmEmailTouched && emailsMatch}>
                <input
                  type="email"
                  bind:value={confirmEmail}
                  on:blur={() => (confirmEmailTouched = true)}
                  placeholder="Confirmer l'email"
                  autocomplete="off"
                  aria-label="Confirmer l'email"
                />
                {#if confirmEmailTouched && confirmEmail}
                  <span class="field-icon {emailsMatch ? 'ok' : 'ko'}">{emailsMatch ? "✓" : "✗"}</span>
                {/if}
                {#if confirmEmailTouched && confirmEmail && !emailsMatch}
                  <span class="error-msg" role="alert">Emails différents</span>
                {/if}
              </div>
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn-save" disabled={savingEmail} aria-label="Enregistrer">
                {#if savingEmail}
                  <span class="spinner-sm"></span>
                {:else}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {/if}
              </button>
              <button type="button" class="btn-cancel" on:click={cancelEditEmail} aria-label="Annuler">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </form>
        {:else}
          <!-- Affichage de l'email avec bouton modifier -->
          <div class="value-row">
            <span class="value">{user.email}</span>
            <button class="btn-edit" on:click={startEditEmail} aria-label="Modifier l'email">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Modifier
            </button>
          </div>
        {/if}
      </div>

      <!-- Ligne : Date d'inscription -->
      <div class="info-row">
        <span class="label">Membre depuis</span>
        <span class="value">{formatDate(user.created_at)}</span>
      </div>
    </div>

    <!-- Section changement de mot de passe -->
    <div class="section fade-in" style="animation-delay: 0.15s" aria-labelledby="pwd-title">
      <h3 id="pwd-title">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Changer le mot de passe
      </h3>
      <form on:submit|preventDefault={handleUpdatePassword} novalidate>

        <!-- Mot de passe actuel -->
        <div class="field">
          <label for="currentPassword">Mot de passe actuel <span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              bind:value={currentPassword}
              placeholder="Votre mot de passe actuel"
              autocomplete="new-password"
              aria-required="true"
            />
            <!-- Bouton afficher/masquer -->
            <button type="button" class="toggle-pwd" on:click={() => (showCurrent = !showCurrent)} aria-label={showCurrent ? "Masquer" : "Afficher"}>
              {#if showCurrent}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Nouveau mot de passe avec jauge de force -->
        <div class="field" class:has-error={newPasswordTouched && newPassword && !passwordValid} class:has-success={newPasswordTouched && passwordValid}>
          <label for="newPassword">Nouveau mot de passe <span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              bind:value={newPassword}
              on:input={() => (newPasswordTouched = true)}
              placeholder="Nouveau mot de passe"
              autocomplete="new-password"
            />
            <button type="button" class="toggle-pwd" on:click={() => (showNew = !showNew)} aria-label={showNew ? "Masquer" : "Afficher"}>
              {#if showNew}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
          <!-- Jauge de force et liste des règles -->
          {#if newPassword}
            <div class="strength-bar">
              <div class="strength-track">
                <div class="strength-fill {strengthClass}" style="width: {passwordScore * 25}%"></div>
              </div>
              <span class="strength-label {strengthClass}">{strengthLabel}</span>
            </div>
            <ul class="pwd-rules">
              <li class:ok={passwordRules.length}>{passwordRules.length ? "✓" : "○"} 8 caractères minimum</li>
              <li class:ok={passwordRules.upper}>{passwordRules.upper ? "✓" : "○"} Une majuscule</li>
              <li class:ok={passwordRules.digit}>{passwordRules.digit ? "✓" : "○"} Un chiffre</li>
              <li class:ok={passwordRules.special}>{passwordRules.special ? "✓" : "○"} Un caractère spécial</li>
            </ul>
          {/if}
        </div>

        <!-- Confirmation du nouveau mot de passe -->
        <div class="field" class:has-error={confirmPasswordTouched && confirmPassword && !passwordsMatch} class:has-success={confirmPasswordTouched && passwordsMatch}>
          <label for="confirmPassword">Confirmer le mot de passe <span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              bind:value={confirmPassword}
              on:blur={() => (confirmPasswordTouched = true)}
              placeholder="Répétez le nouveau mot de passe"
              autocomplete="new-password"
            />
            <button type="button" class="toggle-pwd" on:click={() => (showConfirm = !showConfirm)} aria-label={showConfirm ? "Masquer" : "Afficher"}>
              {#if showConfirm}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
          {#if confirmPasswordTouched && confirmPassword && !passwordsMatch}
            <span class="error-msg" role="alert">Les mots de passe ne correspondent pas</span>
          {/if}
        </div>

        <!-- Bouton soumettre -->
        <button type="submit" disabled={savingPassword} class="btn-primary">
          {#if savingPassword}
            <span class="spinner-sm"></span> Enregistrement…
          {:else}
            Mettre à jour le mot de passe
          {/if}
        </button>
      </form>
    </div>

  {/if}
</section>

<style>
  /* Conteneur principal centré */
  .profil-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  /* Titre de la page */
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: var(--color-text);
    font-family: var(--font-primary);
    letter-spacing: 0.03em;
    animation: fadeDown 0.5s ease both;
  }

  /* Message succès/erreur */
  .message {
    padding: 0.9rem 1.2rem;
    border-radius: var(--radius);
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 600;
    font-size: var(--font-size-sm);
    animation: slideDown 0.35s ease;
  }
  .message.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .message.error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

  /* Indicateur de chargement */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: var(--color-text);
    padding: 2rem;
  }

  /* Spinner grand */
  .spinner {
    display: inline-block;
    width: 24px; height: 24px;
    border: 3px solid var(--color-secondary);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* Spinner petit (dans les boutons) */
  .spinner-sm {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }

  /* Carte de section */
  .section {
    background: var(--color-primary);
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .section:hover {
    box-shadow: 0 6px 20px rgba(89, 47, 37, 0.15);
    transform: translateY(-2px);
  }

  /* Titre de section avec icône */
  .section h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text);
    font-size: 1rem;
    border-bottom: 2px solid var(--color-secondary);
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Ligne d'information (label + valeur) */
  .info-row {
    display: flex;
    flex-direction: column;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(89, 47, 37, 0.1);
    gap: 0.35rem;
  }
  .info-row:last-child { border-bottom: none; }

  /* Label (Nom, Email...) */
  .label {
    font-weight: 700;
    color: var(--color-text);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.65;
  }

  /* Ligne valeur + bouton modifier */
  .value-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  /* Valeur affichée */
  .value {
    color: var(--color-text);
    font-size: var(--font-size-base);
    font-weight: 500;
    word-break: break-word;
    flex: 1;
  }

  /* Bouton modifier (stylo) */
  .btn-edit {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.65rem;
    border: 1.5px solid var(--color-secondary);
    border-radius: var(--radius);
    background: transparent;
    color: var(--color-text);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
    font-family: var(--font-primary);
  }
  .btn-edit:hover { background: var(--color-secondary); transform: translateY(-1px); }
  .btn-edit:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }

  /* Formulaire inline (modification nom) */
  .inline-form {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
    animation: fadeIn 0.25s ease;
  }
  .inline-form > input {
    flex: 1;
    min-width: 140px;
    padding: 0.5rem 0.7rem;
    border: 1.5px solid var(--color-secondary);
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    background: #fffdf8;
    color: var(--color-text);
    transition: box-shadow 0.2s;
    box-sizing: border-box;
  }
  .inline-form > input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(187, 191, 73, 0.25);
  }

  /* Formulaire email (deux champs empilés) */
  .email-form { flex-direction: column; }
  .inline-fields { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
  .inline-fields .field { position: relative; }
  .inline-fields input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.7rem;
    border: 1.5px solid rgba(89, 47, 37, 0.25);
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    background: #fffdf8;
    color: var(--color-text);
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .inline-fields input:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(187, 191, 73, 0.2);
  }

  /* Actions inline (valider / annuler) */
  .inline-actions { display: flex; gap: 0.4rem; }

  /* Bouton valider (vert) */
  .btn-save {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border: none; border-radius: var(--radius);
    background: #27ae60; color: white;
    cursor: pointer; transition: background 0.2s, transform 0.15s; flex-shrink: 0;
  }
  .btn-save:hover:not(:disabled) { background: #219a52; transform: scale(1.05); }
  .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Bouton annuler (rouge) */
  .btn-cancel {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border: none; border-radius: var(--radius);
    background: #e74c3c; color: white;
    cursor: pointer; transition: background 0.2s, transform 0.15s; flex-shrink: 0;
  }
  .btn-cancel:hover { background: #c0392b; transform: scale(1.05); }

  /* Icône ✓ ou ✗ dans les champs */
  .field-icon {
    position: absolute; right: 0.6rem; top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem; font-weight: 700; pointer-events: none;
    animation: popIn 0.2s ease;
  }
  .field-icon.ok { color: #27ae60; }
  .field-icon.ko { color: #c0392b; }

  /* Message d'erreur sous un champ */
  .error-msg { font-size: 0.75rem; color: #c0392b; font-weight: 600; animation: fadeIn 0.2s ease; }

  /* Bordure rouge si erreur, verte si valide */
  .field.has-error input   { border-color: #c0392b; }
  .field.has-success input { border-color: #27ae60; }

  /* Formulaire mot de passe */
  form { display: flex; flex-direction: column; gap: 0.85rem; }
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  label { font-size: var(--font-size-sm); font-weight: 700; color: var(--color-text); }
  .required { color: #c0392b; margin-left: 2px; }

  /* Wrapper pour icône œil dans les inputs password */
  .input-wrapper { position: relative; display: flex; align-items: center; }
  .input-wrapper input { flex: 1; padding-right: 2.8rem; }

  /* Style général des inputs */
  input {
    padding: 0.7rem 0.75rem;
    border: 1.5px solid rgba(89, 47, 37, 0.25);
    border-radius: var(--radius);
    font-size: var(--font-size-base);
    background: #fffdf8;
    color: var(--color-text);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    width: 100%;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
  input::placeholder { opacity: 0.45; }
  input:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(187, 191, 73, 0.25);
    transform: translateY(-1px);
  }
  .field.has-error input   { border-color: #c0392b; box-shadow: 0 0 0 3px rgba(192,57,43,0.12); }
  .field.has-success input { border-color: #27ae60; box-shadow: 0 0 0 3px rgba(39,174,96,0.12); }

  /* Bouton œil pour afficher/masquer le mot de passe */
  .toggle-pwd {
    position: absolute; right: 0.5rem;
    background: none; border: none; cursor: pointer; padding: 0.25rem;
    box-shadow: none; color: var(--color-text); opacity: 0.55;
    transition: opacity 0.2s, transform 0.2s;
    display: flex; align-items: center; min-height: 36px;
  }
  .toggle-pwd:hover { opacity: 1; transform: scale(1.15); }

  /* Jauge de force du mot de passe */
  .strength-bar { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.3rem; }
  .strength-track { flex: 1; height: 6px; background: rgba(89,47,37,0.12); border-radius: 99px; overflow: hidden; }
  .strength-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .strength-fill.very-weak { background: #e74c3c; }
  .strength-fill.weak      { background: #e67e22; }
  .strength-fill.medium    { background: #f1c40f; }
  .strength-fill.strong    { background: #27ae60; }
  .strength-label { font-size: 0.75rem; font-weight: 700; min-width: 70px; text-align: right; }
  .strength-label.very-weak { color: #e74c3c; }
  .strength-label.weak      { color: #e67e22; }
  .strength-label.medium    { color: #c8960c; }
  .strength-label.strong    { color: #27ae60; }

  /* Liste des règles du mot de passe */
  .pwd-rules {
    list-style: none; padding: 0.5rem 0.75rem; margin: 0;
    background: rgba(187,191,73,0.08); border-radius: var(--radius);
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1rem;
  }
  .pwd-rules li { font-size: 0.78rem; color: var(--color-text); opacity: 0.55; transition: color 0.25s, opacity 0.25s, transform 0.2s; }
  .pwd-rules li.ok { color: #27ae60; opacity: 1; font-weight: 600; transform: translateX(3px); }

  /* Bouton principal (enregistrer) */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.7rem 1.4rem; border: none; border-radius: var(--radius);
    font-weight: 700; font-size: var(--font-size-sm); cursor: pointer;
    background: var(--color-secondary); color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    align-self: flex-start; min-height: 44px; font-family: var(--font-primary);
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-btn-hover); }
  .btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.98); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: translateY(-50%) scale(0.5); }
    to   { opacity: 1; transform: translateY(-50%) scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn 0.45s ease both; }

  /* Responsive mobile */
  @media (max-width: 480px) {
    .profil-container { padding: 0.75rem; }
    h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    .section { padding: 1rem; }
    .pwd-rules { grid-template-columns: 1fr; }
    .btn-primary { width: 100%; align-self: stretch; }
    .value-row { flex-direction: column; align-items: flex-start; }
  }

  /* Responsive desktop */
  @media (min-width: 1024px) {
    .profil-container { max-width: 700px; padding: 2.5rem; }
    h2 { font-size: 2rem; margin-bottom: 2rem; }
    .section { padding: 2rem; margin-bottom: 1.5rem; border-radius: 12px; }
    .section h3 { font-size: 1.2rem; }
    form { gap: 1.25rem; }
    input { padding: 0.85rem 1rem; }
    .btn-primary { padding: 0.85rem 2rem; font-size: var(--font-size-base); }
  }

  /* Désactive les animations si l'utilisateur le préfère */
  @media (prefers-reduced-motion: reduce) {
    .fade-in, .message, .error-msg, h2, .inline-form { animation: none; }
    .strength-fill { transition: none; }
    input:focus, .section:hover { transform: none; }
  }
</style>
