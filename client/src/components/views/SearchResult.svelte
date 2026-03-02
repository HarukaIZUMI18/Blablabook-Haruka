<script>
  import { api } from "../../service/api.service.js";
  import CardBook from "../CardBook.svelte";

  let books = $state([]);
  let query = $state("");
  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    query = params.get("q") || "";
    if (query) {
      fetchBooks();
    }
  });

  async function fetchBooks() {
    const data = await api.search(query);
    books = data;
  }
</script>

<section>
  {#if query}
    <h2>Résultat de votre recherche: "{query}"</h2>
  {:else}
    <h2>Votre recherche est vide</h2>
  {/if}
  <div class="grid">
    {#each books as book (book.id)}
      <CardBook {book} />
    {/each}
  </div>
</section>

<style>
  h2 {
    margin: 1em 1em 0 1em;
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
