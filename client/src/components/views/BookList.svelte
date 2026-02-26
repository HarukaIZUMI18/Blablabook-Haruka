<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  let books = $state([]);
  let currentPage = $state(1);
  let totalPages = $state(0);
  const limit = 50;

  $effect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchBooks();
  });

  async function fetchBooks() {
    const data = await api.allBook({ page: currentPage, limit });
    books = data.books;
    totalPages = data.totalPages;
  }
</script>

<section>
  <h2>Liste de livres:</h2>
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
    margin: 1em 1em 0 1em ;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    margin: 20px 30px 30px 30px;
    gap: 1em 0.5em;
    justify-items: center;
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
</style>
