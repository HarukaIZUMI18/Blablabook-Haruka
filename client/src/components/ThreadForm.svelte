<script>
  import { api } from "../service/api.service";

  let title = $state("");
  let body = $state("");
  let loading = $state(false);
  let toast = $state();
  /** @type {ReturnType<typeof setTimeout>} */
  let toastTimeout;

  let { onThreadCreated = () => {} } = $props();

  /**
   * @param {string} message
   * @param {"success" | "error"} type
   */
  function showToast(message, type) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast = { message, type };
    toastTimeout = setTimeout(() => {
      toast = null;
    }, 3000);
  }

  const errorMessages = {
    Unauthorized: "Connexion requise.",
    "Bad Request": "Veuillez saisir le titre et le texte.",
    "Failed to fetch":
      "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.",
  };

  /**
   * @param {string} message
   */
  function parseError(message) {
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.includes(key)) return value;
    }
    return "Une erreur s'est produite. Veuillez réessayer.";
  }

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      showToast("Veuillez saisir le titre et le texte.", "error");
      return;
    }
    if (title.trim().length < 5) {
      showToast("Le titre doit contenir au moins 5 caractères.", "error");
      return;
    }
    if (body.trim().length < 10) {
      showToast("Le texte doit contenir au moins 10 caractères.", "error");
      return;
    }
    loading = true;
    try {
      const thread = await api.createThread({ title, body });
      showToast("Je l'ai posté.", "success");
      title = "";
      body = "";
      onThreadCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(parseError(message), "error");
    } finally {
      loading = false;
    }
  }
</script>

<div class="thread-form-container">
  <h2>Créer un nouveau sujet</h2>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="field">
      <label for="title">Titre</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        placeholder="Titre"
        required
      />
    </div>
    <div class="field">
      <label for="body">Texte</label>
      <textarea
        id="body"
        bind:value={body}
        placeholder="Saisissez du texte"
        rows="6"
        required
      ></textarea>
    </div>
    <button type="submit" disabled={loading}>
      {loading ? "Publication..." : "Publication"}
    </button>
  </form>
  {#if toast}
    <div
      class="toast"
      class:success={toast.type === "success"}
      class:error={toast.type === "error"}
      role="alert"
      aria-live="polite"
    >
      {toast.message}
    </div>
  {/if}
</div>

<style>
  .thread-form-container {
    margin-top: 0;
    text-align: left;
    color: #1a1a1a;
    width: 100%;
    margin: 0 auto;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  input,
  textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    width: 100%;
  }

  input:focus,
  textarea:focus {
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
    transition:
      box-shadow 0.15s ease,
      transform 0.15s ease;
  }

  button[type="submit"]:hover:not(:disabled) {
    box-shadow: var(--shadow-btn-hover);
    transform: translateY(-1px);
    width: 100%;
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .toast {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
  }

  .toast.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .toast.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  @media (max-width: 700px) {
    .thread-form-container {
      font-size: 1.2rem;
    }
    input,
    textarea {
      font-size: 0.9rem;
    }
    button[type="submit"] {
      padding: 0.7rem;
      font-size: 0.9rem;
    }
  }
</style>
