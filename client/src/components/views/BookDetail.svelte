<script>
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";
  import { Link } from "svelte-routing";
  // Pour page connecté et sans connecté
  let token = $state(null);
  const { params } = $props();

  let book = $state(null);

  onMount(() => {
    token = localStorage.getItem("token");
    fetchBook();
  });

  async function fetchBook() {
    const data = await api.getBookById(params.id);
    book = data;
  }

  const status = ["à lire", "abandonné", "Lu", "En pause", "En cours"];

  function changeStatus(book, newStatus) {
    book.status = newStatus;
    console.log("Status actuel", book.status);
  }
</script>

<main>
<section>
  {#if book}
    <div class="detail_img">
      <img src={book.cover} alt={`Couverture de ${book.title}`} />
    </div>
    <!-- Séléction un status de livre -->
    {#if token}
      <div class="status_book">
        <label for="sutatus_select">Sélelectionnez le statut du livre</label>
        <select id="status_select" bind:value={book.status}>
          <option value="" disabled hidden>Vous avez lu ce livre?</option>
          {#each status as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
        <button onclick={() => changeStatus(book, book.status)}>Oui</button>
      </div>
    {/if}
    <div class="detail_title">
      <h1>{book.title}</h1>
    </div>
    <div class="detail_description">
      <p><strong>Auteur:</strong> {book.author}</p>
      <p><strong>Année:</strong> {book.publish_year}</p>
      <h2>Description</h2>
      <p>
        {book.description}
      </p>
    </div>
  {/if}
</section>
<!-- Utilisateur sans connecter -->
{#if !token}
  <div class="back_list">
    <Link to="/BookList">
      <button>Retour à la liste</button>
    </Link>
  </div>
{/if}
</main>
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

  .status_book {
    grid-area: 5 / 1 / 6 / 3;
    padding: 2rem;
  }

  .back_list {
    margin: 2rem;
  }
  /* Status de livre */
  select {
    border: 2px solid var(--color-bg);
    border-radius: var(--radius);
    padding: 0.3rem;
  }

  @media screen and (max-width: 1100px) {
    main{
      display: flex;
      margin: 2rem;
    }
  }
  /* Responsive mobile */
  @media screen and (max-width: 940px) {
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1.5rem;
    }
    .detail_img img {
      display: block;
      margin: 0 auto;
    }
  }
</style>
