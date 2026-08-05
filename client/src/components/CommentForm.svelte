<script>
import { api } from "../service/api.service.js";

  let { threadId, onCommentAdded = () => {} } = $props();

  let body = $state("");
  let loading = $state(false);
let toast = $state();
        /** @type {ReturnType<typeof setTimeout>} */
  let toastTimeout;

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
        "Bad Request": "Veuillez saisir le texte.",
        "Failed to fetch": "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet."
    }


     /**
   * @param {string} message
   */
    function parseError(message) {
        for (const [key, value] of Object.entries(errorMessages)){
            if(message.includes(key)) return value;
        }
        return "Une erreur s'est produite. Veuillez réessayer.";
    }

     async function handleSubmit() {
        if (!body.trim() || !body.trim()) {
            showToast("Veuillez saisir le texte.", "error");
            return
        }
        loading = true;
        try {
            const comment = await api.addComment({ threadId, body });
            body = "";
            onCommentAdded(comment);
            showToast("J'ai laissé un commentaire.", "success");

        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            showToast(parseError(message), "error");
        } finally {
            loading = false;
        }
  }
</script>

<div class="comment-form-container">
  <form
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="field">
      <textarea
        bind:value={body}
        placeholder="Saisissez votre commentaire"
        rows="3"
        required
      ></textarea>
    </div>

    <button type="submit" disabled={loading}>
      {loading ? "Publication..." : "Commentaire"}
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
  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }


  .field {
    display: flex;
    flex-direction: column;
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
  }

  button[type="submit"] {
    align-self: flex-end;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
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
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .toast {
    margin-top: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
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
</style>