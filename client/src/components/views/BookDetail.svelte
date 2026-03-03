<script>
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";
  import { Link } from "svelte-routing";

  // Pour page connecté et sans connecté
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { params } = $props();

  // États Svelte 5
  let book = $state(null);
  let loading = $state(true);
  let collectionStatus = $state(null); // null = pas dans la collection, sinon = statut
  let checkingCollection = $state(true);
  let toast = $state(null);
  let toastTimeout = $state(null);
  let selectedStatus = $state("à lire");

  const statuses = [
    { value: "à lire", label: "À lire" },
    { value: "en cours", label: "En cours" },
    { value: "lu", label: "Lu" },
    { value: "abandonné", label: "Abandonné" },
  ];

  onMount(async () => {
    await loadBook();
    if (token) {
      await checkCollection();
    } else {
      checkingCollection = false;
    }
  });

  async function loadBook() {
    try {
      loading = true;
      const data = await api.getBook(params.id);
      book = data;
    } catch (error) {
      showToast("Erreur lors du chargement du livre", "error");
    } finally {
      loading = false;
    }
  }

  async function checkCollection() {
    try {
      checkingCollection = true;
      const data = await api.getCollection();
      const found = data.books?.find((b) => b.id === parseInt(params.id));
      collectionStatus = found?.collectStatus || null;
    } catch (error) {
      console.error("Erreur vérification collection:", error);
    } finally {
      checkingCollection = false;
    }
  }

  async function handleAddToCollection() {
    try {
      await api.addToCollection(book.id, selectedStatus);
      collectionStatus = selectedStatus;
      showToast("Livre ajouté à votre collection", "success");
    } catch (error) {
      showToast("Erreur lors de l'ajout à la collection", "error");
    }
  }

  async function handleUpdateStatus() {
    try {
      await api.updateCollectionStatus(book.id, selectedStatus);
      collectionStatus = selectedStatus;
      showToast("Statut mis à jour", "success");
    } catch (error) {
      showToast("Erreur lors de la mise à jour", "error");
    }
  }

  async function handleRemoveFromCollection() {
    try {
      await api.removeFromCollection(book.id);
      collectionStatus = null;
      showToast("Livre retiré de la collection", "success");
    } catch (error) {
      showToast("Erreur lors de la suppression", "error");
    }
  }

  function showToast(message, type) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast = { message, type };
    toastTimeout = setTimeout(() => {
      toast = null;
    }, 3000);
  }
</script>

<main>
  <section>
    {#if loading || checkingCollection}
      <p class="loading" aria-busy="true">Chargement...</p>
    {:else if book}
      <div class="col-left">
        <img src={book.cover} alt={`Couverture de ${book.title}`} />

        {#if token}
          <div class="collection-section">
            {#if collectionStatus === null}
              <div class="add-to-collection">
                <label for="status-select">Statut</label>
                <select id="status-select" bind:value={selectedStatus}>
                  {#each statuses as status}
                    <option value={status.value}>{status.label}</option>
                  {/each}
                </select>
                <button onclick={handleAddToCollection}
                  >Ajouter à ma collection</button
                >
              </div>
            {:else}
              <div class="collection-info">
                <p class="current-status">
                  <strong>Statut actuel :</strong>
                  {collectionStatus}
                </p>
                <div class="update-status">
                  <label for="status-update">Changer</label>
                  <select id="status-update" bind:value={selectedStatus}>
                    {#each statuses as status}
                      <option value={status.value}>{status.label}</option>
                    {/each}
                  </select>
                  <button onclick={handleUpdateStatus}>Modifier</button>
                </div>
                <button class="remove-btn" onclick={handleRemoveFromCollection}>
                  Retirer de ma collection
                </button>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="col-right">
        <h1>{book.title}</h1>
        <div class="meta">
          <p><strong>Auteur:</strong> {book.author}</p>
          <p><strong>Année:</strong> {book.publish_year}</p>
        </div>
        <div class="description">
          <h2>Résumé:</h2>
          <p>{book.description}</p>
        </div>
      </div>
    {:else}
      <p class="error">Livre non trouvé</p>
    {/if}
  </section>

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
</main>

<style>
  section {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    max-width: 1100px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    align-items: start;
  }

  /* ── Colonne gauche ── */
  .col-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .col-left img {
    display: block;
    width: 100%;
    max-height: 420px;
    object-fit: contain;
    border-radius: var(--radius);
  }

  /* ── Colonne droite ── */
  .col-right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--color-white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 2em;
  }

  .col-right h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  .meta {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    align-self: flex-start;
    text-align: start;
  }

  .meta p {
    margin: 0.25rem 0;
  }

  .description {
    padding: 1em;
    align-self: flex-start;
    text-align: start;
  }

  .description h2 {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
  }
  .description p {
    margin: 0;
  }

  /* ── Collection ── */
  .collection-section {
    padding: 1rem;
    background: var(--color-white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .add-to-collection,
  .collection-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .collection-info {
    gap: 1rem;
  }

  .add-to-collection label,
  .update-status label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .add-to-collection select,
  .update-status select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: var(--radius);
    font-family: var(--font-primary);
    font-size: 0.9rem;
  }

  .add-to-collection select:focus,
  .update-status select:focus {
    outline: none;
    border-color: var(--color-secondary);
  }

  .add-to-collection button {
    padding: 0.75rem;
    font-weight: 600;
  }
  .current-status {
    font-size: 0.95rem;
    margin: 0;
  }

  .update-status {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .update-status button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dc3545;
    background: transparent;
    color: #dc3545;
    font-size: 0.85rem;
    border-radius: var(--radius);
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;
  }
  .remove-btn:hover {
    background: #dc3545;
    color: var(--color-white);
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 1.5rem;
    border-radius: var(--radius);
    font-family: var(--font-primary);
    font-size: 0.95rem;
    z-index: 1000;
    white-space: nowrap;
    animation: slideDown 0.3s ease;
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

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .loading,
  .error {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  /* ── Responsive ── */
  @media screen and (max-width: 768px) {
    section {
      grid-template-columns: 1fr;
      margin: 1.5rem auto;
      padding: 0 1rem;
    }
    .col-left img {
      max-height: 300px;
    }
  }
</style>
