<script>
  import { api } from "../../service/api.service.js";
  // Utiliser card de livre
  import CardBook from "../CardBook.svelte";

  // Pour liste des livres affichés
  let books = $state([]);
  let currentPage = $state(1);
  let totalPages = $state(0);
  // Nombre de livres par page
  let limit = $state(30);
  // Ordre de tri des livres
  let order = $state("A-Z");
// Effet réactif : remonte en haut de la page et recharge les livres
  $effect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchBooks();
  });
// Récupère les livres depuis l'API
  async function fetchBooks() {
    const data = await api.allBook({ page: currentPage, limit, order });
    books = data.books;
    totalPages = data.totalPages;
  }
  // Réinitialise la pagination lors d'un changement de filtre
  function handleFilterChange() {
    currentPage = 1;
  }
</script>

<section>
  <div class="title">
    <h2>Catalogue</h2>
  </div>
  <!-- Sélection de l'ordre de tri -->
  <div class="controls-top">
    <div class="group">
      <select id="order" bind:value={order} onchange={handleFilterChange}>
        <option value="A-Z">Titre (A-Z)</option>
        <option value="Z-A">Titre (Z-A)</option>
      </select>
    </div>
    <!-- Sélection du nombre de livres par page -->
    <div class="group">
      <select id="pagination" bind:value={limit} onchange={handleFilterChange}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={40}>40</option>
        <option value={50}>50</option>
      </select>
    </div>
  </div>
  <!-- Grille d'affichage des livres -->
  <div class="grid">
    {#each books as book (book.id)}
      <CardBook {book} />
    {/each}
  </div>
<!-- Contrôles de pagination -->
  <div class="controls">
    <button onclick={() => currentPage--} disabled={currentPage <= 1}>
      Précédent
    </button>
    <span>Page {currentPage} / {totalPages}</span>
    <button onclick={() => currentPage++} disabled={currentPage >= totalPages}>
      Suivant
    </button>
  </div>
</section>

<style>
  .title {
    display: flex;
    justify-content: center;
  }
  h2 {
    margin: 1em 1em 0 1em;
    font-size: 2rem;
    border-radius: 15px;
    background-color: var(--color-white);
    box-shadow: var(--shadow);
    width: fit-content;
    padding: 1rem 2rem;
  }

  select {
    color: var(--color-text);
    border: none;
    box-shadow: var(--shadow-btn);
    background: var(--color-secondary);
    border-radius: var(--radius);
    padding: 0.4rem 2rem 0.4rem 0.75rem;
    font-family: var(--font-primary);
    font-size: 0.9rem;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
  }

  select:focus {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }

  .group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .controls-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75em;
    margin: 1em 2em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    max-width: 1600px;
    margin: 20px auto;
    gap: 1em 0.5em;
    justify-items: center;
    padding: 0 20px;
  }

  .controls {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    background: var(--color-secondary);
    border: none;
    color: var(--color-text);
    box-shadow: var(--shadow-btn);
    transition:
      box-shadow 0.15s ease,
      transform 0.15s ease;
  }
  button:hover {
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    font-weight: bold;
  }
/* ── Responsive ── */
  @media (max-width: 1500px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      width: 90%;
    }
    h2 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 840px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      width: 90%;
    }
    h2 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 480px) {
    .controls-top {
      margin: 1em;
      justify-content: center;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      width: 95%;
      padding: 0 8px;
    }
    h2 {
      font-size: 1.4rem;
    }
  }
</style>
