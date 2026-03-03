<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  // États Svelte 5
  let books = $state([]);
  let loading = $state(true);
  let currentFilter = $state("tous");
  let toast = $state(null);
  let toastTimeout = $state(null);
  let requestVersion = $state(0);

  // Liste des filtres
  const filters = [
    { value: "tous", label: "Tous" },
    { value: "à lire", label: "À lire" },
    { value: "en cours", label: "En cours" },
    { value: "en pause", label: "En pause" },
    { value: "lu", label: "Lu" },
    { value: "abandonné", label: "Abandonné" },
  ];

  // Chargement au montage et au changement de filtre
  $effect(() => {
    loadCollection();
  });

  async function loadCollection() {
    const currentVersion = requestVersion;

    try {
      loading = true;

      const statusParam = currentFilter === "tous" ? null : currentFilter;
      const data = await api.getCollection(statusParam);

      // Ignorer la réponse si une requête plus récente a été initiée
      if (requestVersion !== currentVersion) return;

      books = data.books || [];
    } catch (error) {
      // Ignorer les erreurs si une requête plus récente a été initiée
      if (requestVersion !== currentVersion) return;
      showToast("Erreur lors du chargement de la collection", "error");
    } finally {
      // Ignorer si une requête plus récente a été initiée
      if (requestVersion !== currentVersion) return;
      loading = false;
    }
  }

  function handleFilterChange(filterValue) {
    requestVersion++; // Incrémenter pour abandonner les requêtes précédentes
    currentFilter = filterValue;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStatusChange(bookId, newStatus) {
    try {
      await api.updateCollectionStatus(bookId, newStatus);

      // Mise à jour locale
      const bookIndex = books.findIndex((b) => b.id === bookId);
      if (bookIndex !== -1) {
        books[bookIndex].collectStatus = newStatus;
        books = [...books]; // Trigger reactivity
      }

      showToast("Statut mis à jour", "success");
    } catch (error) {
      showToast("Erreur lors de la mise à jour du statut", "error");
    }
  }

  async function handleRemove(bookId) {
    try {
      await api.removeFromCollection(bookId);

      // Suppression locale
      books = books.filter((b) => b.id !== bookId);

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

<section aria-labelledby="collection-title">
  <h2 id="collection-title">Ma collection</h2>

  <!-- Filtres -->
  <div class="filters" role="group" aria-label="Filtrer par statut">
    {#each filters as filter}
      <button
        class="filter-btn"
        class:active={currentFilter === filter.value}
        aria-pressed={currentFilter === filter.value}
        onclick={() => handleFilterChange(filter.value)}
      >
        {filter.label}
      </button>
    {/each}
  </div>

  <!-- Chargement -->
  {#if loading}
    <p class="loading" aria-busy="true">Chargement...</p>

    <!-- Collection vide -->
  {:else if books.length === 0}
    <div class="empty">
      <p>Votre collection est vide</p>
      <a href="/livres" class="link">Parcourir le catalogue</a>
    </div>

    <!-- Liste des livres -->
  {:else}
    <div class="grid">
      {#each books as book (book.id)}
        <article class="card-wrapper">
          <CardBook {book} />
          <div class="card-actions">
            <select
              class="status-select"
              value={book.collectStatus}
              onchange={(e) =>
                handleStatusChange(book.id, e.currentTarget.value)}
              aria-label="Changer le statut"
            >
              <option value="à lire">À lire</option>
              <option value="en cours">En cours</option>
              <option value="lu">Lu</option>
              <option value="abandonné">Abandonné</option>
              <option value="en pause">En pause</option>
            </select>
            <button
              class="remove-btn"
              onclick={() => handleRemove(book.id)}
              aria-label="Retirer de la collection"
            >
              Retirer
            </button>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>

<!-- Toast notification -->
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

<style>
  section {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 1rem;
  }

  h2 {
    text-align: center;
    margin: 1rem 0;
    font-size: 1.75rem;
    color: var(--color-text);
  }

  /* Filtres */
  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-btn {
    padding: 0.6rem 1rem;
    border-radius: var(--radius);
    border: 2px solid var(--color-secondary);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 44px;
  }

  .filter-btn:hover {
    background: var(--color-secondary);
  }

  .filter-btn.active {
    background: var(--color-secondary);
    font-weight: bold;
  }

  /* Chargement */
  .loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  /* Collection vide */
  .empty {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .link {
    color: var(--color-secondary);
    text-decoration: underline;
    font-weight: 600;
  }

  /* Grille */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-auto-rows: minmax(420px, auto);
    max-width: 1600px;
    margin: 20px auto;
    gap: 1em 0.5em;
    justify-items: center;
    padding: 0 20px;
  }

  .card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
    width: 100%;
  }

  .card-wrapper :global(a),
  .card-wrapper :global(.card) {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.5rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .status-select {
    padding: 0.5rem;
    border-radius: var(--radius);
    border: 1px solid #ddd;
    background: white;
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text);
    cursor: pointer;
  }

  .status-select:focus {
    outline: none;
    border-color: var(--color-secondary);
  }

  .remove-btn {
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius);
    border: 1px solid #dc3545;
    background: transparent;
    color: #dc3545;
    font-family: var(--font-primary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 36px;
  }

  .remove-btn:hover {
    background: #dc3545;
    color: white;
  }

  /* Toast */
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

  @media (max-width: 1500px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      width: 90%;
    }
  }

  @media (max-width: 840px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      width: 90%;
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      width: 95%;
      padding: 0 8px;
    }
  }
</style>
