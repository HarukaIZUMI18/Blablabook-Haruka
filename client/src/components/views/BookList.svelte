<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  
  let books = $state([]);
  let currentPage = $state(1);
  let totalPages = $state(0);
  const limit = 50;

  $effect(() => {
    fetchBooks();
  });

  async function fetchBooks() {
    try {
      const data = await api.allBook({ page: currentPage, limit });
      books = data.books;
      totalPages = data.totalPages;
    } catch (err) {
      console.error("Erreur API :", err);
    }
  }
</script>

<section>
  <h2>Liste de livres</h2>
  <div class="grid">
    {#each books as book (book.id)}
      <CardBook book={book} />
    {/each}
  </div>

  <div class="controls">
    <button 
      onclick={() => currentPage--} 
      disabled={currentPage <= 1}
    >
      Précédent
    </button>

    <span>Page {currentPage} / {totalPages}</span>

    <button 
      onclick={() => currentPage++} 
      disabled={currentPage >= totalPages}
    >
      Suivant
    </button>
  </div>
</section>

<style>
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
    padding: 10px 20px;
    border-radius: var(--radius);
    border: none;
    background: var(--color-secondary);
    cursor: pointer;
    transition: background 0.2s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    font-weight: bold;
  }
</style>