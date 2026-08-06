<script>
  import { onMount } from "svelte";
  import { api } from "../service/api.service.js";
  import CommentForm from "./CommentForm.svelte";
  import { getCurrentUser } from "../utils/auth.js";

  let { params } = $props();

  /** @type {{id: number, title: string, body: string, created_at: string, user?: {id: number, name: string}, comments?: Array<{id: number, body: string, user?: {name: string}, created_at: string}>} | null} */
  let thread = $state(null);
  let error = $state("");

  const currentUser = getCurrentUser();

  // Édition des csu
  let editingThread = $state(false);
  let editTitle = $state("");
  let editBody = $state("");
  let editError = $state("");

   // Édition des commentaires
  let editingCommentId = $state(/** @type {number | null} */ (null));
  let editCommentBody = $state("");
  let editCommentError = $state("");

  async function load() {
    try {
      thread = await api.getThread(params.id);
    } catch (err) {
      error = "Impossible de récupérer le sujet.";
      console.error(err);
    }
  }
  onMount(load);

  function handleCommentAdded() {
    load();
  }

  function editThread() {
    if (!thread) return;
    editTitle = thread.title;
    editBody = thread.body;
    editError = "";
    editingThread = true;
  }

  function cancelEditThread() {
    editingThread = false;
    editError = "";
  }

  /** @param {{id: number, body: string}} comment */
  function editComment(comment) {
    editingCommentId = comment.id;
    editCommentBody = comment.body;
    editCommentError = "";
  }

  function cancelEditComment() {
    editingCommentId = null;
    editCommentError = "";
  }

  async function saveEditComment() {
    if (!thread || editingCommentId === null) return;
    if (editCommentBody.trim().length < 10) {
      editCommentError = "Le commentaire doit contenir au moins 10 caractères.";
      return;
    }
    editCommentError = "";
    try {
      await api.updateComment(thread.id, editingCommentId, editCommentBody);
      editingCommentId = null;
      load();
    } catch (err) {
      editCommentError = "Impossible de modifier le commentaire.";
    }
  }
 /** @param {number} commentId */
  async function handleDeleteComment(commentId) {
    if (!thread) return;
    if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    try {
      await api.deleteComment(thread.id, commentId);
      load();
    } catch (err) {
      alert("Impossible de supprimer le commentaire.");
    }
  }

  /** @param {KeyboardEvent} event */
  function handleOverlayKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      cancelEditThread();
    }
  }

  /** @param {KeyboardEvent} event */
  function handleModalKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
    }
  }

  async function saveEditThread() {
    if (!thread) return;
     if (editTitle.trim().length < 5) {
      editError = "Le titre doit contenir au moins 5 caractères.";
      return;
    }
    if (editError.trim().length < 10) {
      editError ="Le texte doit contenir au moins 10 caractères.";
      return;
    }
    try {
      await api.updateThread(thread.id, { title: editTitle, body: editBody });
      editingThread = false;
      load();
    } catch (err) {
      alert("Impossible de modifier le sujet.");
    }
  }

  async function handleDeleteThread() {
    if (!thread) return;
    if (!confirm("Voulez-vous vraiment supprimer ce sujet ?")) return;
    try {
      await api.deleteThread(thread.id);
      window.location.href = "/thread";
    } catch (err) {
      alert("Impossible de supprimer le sujet.");
    }
  }

  /** @param {string | Date | number} date */
  function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }
</script>

{#if error}
  <p class="error">{error}</p>
{:else if thread}
  <div class="thread-detail">
    <div class="card">
      <div class="card-header">
        <h1>{thread.title}</h1>
        <span class="author">{thread.user?.name}</span>
        <p class="date">{formatDate(thread.created_at)}</p>
      </div>

      {#if currentUser && thread.user?.id === currentUser.userId}
        <div class="actions">
          <button class="edit-btn" onclick={editThread}>Modifier</button>
          <button class="delete-btn" onclick={handleDeleteThread}>Supprimer</button>
        </div>
      {/if}

      <p>{thread.body}</p>
    </div>

    {#if thread.comments && thread.comments.length > 0}
      <div class="card">
        <ul class="list">
          {#each thread.comments as comment}
            <li>
              <div class="card-header">
                <strong>{comment.user?.name}</strong>
                <p class="date">{formatDate(thread.created_at)}</p>
                {#if currentUser && comment.user?.id === currentUser.userId}
                <div class="actions">
                  <button class="edit-btn" onclick={() => editComment(comment)}>Modifier</button>
                  <button class="delete-btn" onclick={() => handleDeleteComment(comment.id)}>Supprimer</button>
                </div>
              {/if}
              </div>
              <p>{comment.body}</p>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <h2>Ajouter un commentaire</h2>
    <CommentForm threadId={thread.id} onCommentAdded={handleCommentAdded} />
  </div>

 <!-- Modal édition du sujet -->
  {#if editingThread}
    <div
      class="modal-overlay"
      onclick={cancelEditThread}
      onkeydown={handleOverlayKeydown}
      role="button"
      aria-label="Fermer la fenêtre de modification"
      tabindex="0"
    >
      <div
        class="modal"
        onclick={(e) => e.stopPropagation()}
        onkeydown={handleModalKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-thread-title"
        tabindex="-1"
      >
        <h2 id="edit-thread-title">Modifier le sujet</h2>
        <input type="text" bind:value={editTitle} class="edit-input" placeholder="Titre" />
        <textarea bind:value={editBody} rows="6" class="edit-textarea" placeholder="Texte"></textarea>
        {#if editError}
        <p class="edit-error">{editError}</p>
        {/if}
        <div class="edit-actions">
          <button class="save-btn" onclick={saveEditThread}>Enregistrer</button>
          <button class="cancel-btn" onclick={cancelEditThread}>Annuler</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Modal édition du commentaire -->
  {#if editingCommentId !== null}
    <div
      class="modal-overlay"
      onclick={cancelEditComment}
      onkeydown={handleOverlayKeydown}
      role="button"
      aria-label="Fermer la fenêtre de modification"
      tabindex="0"
    >
      <div
        class="modal"
        onclick={(e) => e.stopPropagation()}
        onkeydown={handleModalKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-comment-title"
        tabindex="-1"
      >
      <h2 id="edit-comment-title">Modifier le commentaire</h2>
        <textarea bind:value={editCommentBody} rows="4" class="edit-textarea" placeholder="Commentaire"></textarea>
        {#if editCommentError}
          <p class="edit-error">{editCommentError}</p>
        {/if}
        <div class="edit-actions">
          <button class="save-btn" onclick={saveEditComment}>Enregistrer</button>
          <button class="cancel-btn" onclick={cancelEditComment}>Annuler</button>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <p>Chargement...</p>
{/if}

<style>
  .thread-detail {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 1rem;
  }

  .card {
    display: block;
    text-decoration: none;
    color: inherit;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.332);
    padding: 1rem;
    margin: 1rem;
    transition: transform 0.2s;
  }

  .card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .author {
    font-size: 0.85rem;
    color: #999;
  }

  .date {
    font-size: 0.8rem;
    color: #999;
    margin-top: 0.5rem;
  }

  .list {
    list-style: none;
  }

  .error {
    color: #c62828;
    text-align: center;
  }

  .actions {
    display: flex;
    justify-content: right;
    gap: 0.5rem;
    margin: 0.6rem 0;
  }

  .edit-btn,
  .save-btn,
  .cancel-btn,
  .delete-btn {
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .edit-btn {
    background: var(--color-secondary);
    color: var(--color-text);
  }
  .edit-btn:hover {
    background: var(--color-secondary);
  }

  .delete-btn {
    background: var(--color-bg);
    color: #c62828;
  }
  .delete-btn:hover {
    background: #c62828;
    color: white;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: var(--color-white, #fff);
    border-radius: 12px;
    padding: 1.5rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .modal h2 {
    margin-top: 0;
  }

  .save-btn {
    background: var(--color-secondary);
    color: var(--color-text);
  }
  .save-btn:hover {
    background: #2e7d32;
    color: white;
  }

  .cancel-btn {
    background: var(--color-white);
    color: #666;
  }

  .edit-input,
  .edit-textarea {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
    margin-bottom: 0.6rem;
    box-sizing: border-box;
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-error {
    color: #c62828;
    font-size: 0.85rem;
    margin: -0.3rem 0 0.6rem 0;
  }
</style>