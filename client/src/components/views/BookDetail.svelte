<script>
  import { Link } from "svelte-routing";
  import { api } from "../../service/api.service.js";
  import { onMount } from "svelte";

  // Pour page connecté et sans connecté
  let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      const found = data.books?.find(b => b.id === parseInt(params.id));
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
<section>
  {#if loading || checkingCollection}
    <p class="loading" aria-busy="true">Chargement...</p>
  {:else if book}
    <div class="detail_img">
      <img
        src={book.cover}
        alt={`Couverture de ${book.title}`}
      />
      
      {#if token}
        <div class="collection-section">
          {#if collectionStatus === null}
            <!-- Pas dans la collection : afficher bouton ajout + select -->
            <div class="add-to-collection">
              <label for="status-select">Statut</label>
              <select id="status-select" bind:value={selectedStatus}>
                {#each statuses as status}
                  <option value={status.value}>{status.label}</option>
                {/each}
              </select>
              <button onclick={handleAddToCollection}>
                Ajouter à ma collection
              </button>
            </div>
          {:else}
            <!-- Dans la collection : afficher statut actuel + boutons -->
            <div class="collection-info">
              <p class="current-status">
                <strong>Statut actuel :</strong> {collectionStatus}
              </p>
              <div class="update-status">
                <label for="status-update">Changer</label>
                <select id="status-update" bind:value={selectedStatus}>
                  {#each statuses as status}
                    <option value={status.value}>{status.label}</option>
                  {/each}
                </select>
                <button onclick={handleUpdateStatus}>
                  Modifier
                </button>
              </div>
              <button class="remove-btn" onclick={handleRemoveFromCollection}>
                Retirer de ma collection
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    
    <div class="detail_title">
      <h1>{book.title}</h1>
    </div>
    <div class="detail_description">
      <p><strong>Auteur:</strong> {book.author}</p>
      <p><strong>Année:</strong> {book.publish_year}</p>
      <h2>Description</h2>
      <p>{book.description}</p>
    </div>
  {:else}
    <p class="error">Livre non trouvé</p>
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
<!-- Utilisateur sans connecter -->
{#if !token}
  <div class="back_list">
    <Link to="/BookList">
      <button>Retour à la liste</button>
    </Link>
  </div>
{/if}

<style>
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    margin: 2rem;
  }
  .detail_img {
    grid-area: 1 / 1 / 5 / 3;
  }
  .detail_img img {
    height: 450px;
    max-width: 100%;
  }
  .detail_title {
    grid-area: 1 / 3 / 2 / 6;
  }

  .detail_description {
    grid-area: 2 / 3 / 5 / 6;
  }

  .status_book{
    padding: 2rem;
  }

  .back_list{
    margin: 2rem;
  }
  /* Status de livre */
  select{
    border: 2px solid var(--color-bg);
    border-radius: var(--radius);
    padding: 0.3rem;
  }

  /* Responsive mobile */
  @media screen and (max-width: 940px) {
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1.5rem;
  }
  .detail_img img{
    display: block;
    margin: 0 auto;
  }
}

/* Collection section styles */
.collection-section {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.add-to-collection,
.collection-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.collection-info {
  gap: 1rem;
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
  margin-top: 0.5rem;
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

/* Loading & Error */
.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}
</style>
