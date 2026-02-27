<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  let books = $state([]);
  let currentPage = $state(1);
  let totalPages = $state(0);
  let limit = $state(30);
  let order = $state("A-Z");

  $effect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchBooks();
  });

  async function fetchBooks() {
    const data = await api.allBook({ page: currentPage, limit, order });
    books = data.books;
    totalPages = data.totalPages;
  }
  function handleFilterChange() {
    currentPage = 1;
  }
</script>

<section>
  <h2>Liste de livres:</h2>
  <div class="controls-top">
    <div class="group">
      <label for="order">Trier par :</label>
      <select id="order" bind:value={order} onchange={handleFilterChange}>
        <option value="A-Z">Titre (A-Z)</option>
        <option value="Z-A">Titre (Z-A)</option>
      </select>
    </div>
    <div class="group">
      <label for="pagination">Afficher :</label>
      <select id="pagination" bind:value={limit} onchange={handleFilterChange}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={40}>40</option>
        <option value={50}>50</option>
      </select>
    </div>
  </div>
  <div class="grid">
    {#each books as book (book.id)}
      <CardBook {book} />
    {/each}
  </div>

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
  h2 {
    margin: 1em 1em 0 1em;
  }
  select,
  select::picker(select) {
    appearance: base-select;
    color: var(--color-text);
    background: var(--color-secondary);
  }

  select::picker(select) {
    border-radius: var(--radius);
    padding: 5px;
  }
  .group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .controls-top {
    display: flex;
    justify-content: space-between;
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

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      width: 80%;
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
      gap: 5px;
      width: 80%;
    }
  }
</style>
