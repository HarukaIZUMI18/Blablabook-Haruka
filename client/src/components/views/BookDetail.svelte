<script>
  import { Link } from "svelte-routing";
// Pour page connecté et sans connecté
  let token = localStorage.getItem("token");
   const { params } = $props();

   // Status du livre exemple
   let book = $state({
    id:1, status: ""
   });

const status = [
  "à lire",
    "abandonné",
    "Lu",
    "En pause",
    "En cours"
];

function changeStatus(book, newStatus) {
  book.status = newStatus;
  /* Exemple d'envoyer à API
  fetch(`/api/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    }); */
    console.log("Status actuel", book.status);
}

</script>
<section>
  <div class="detail_img">
    <img
      src="https://covers.openlibrary.org/b/id/14348537-L.jpg"
      alt="Couverture de Harry Potter"
    />
    <!-- Séléction un status de livre -->
    {#if token}
<div class="status_book">
<label for="sutatus_select">Sélelectionnez le statut du livre</label>
    <select
    id="status_select"
    bind:value={book.status}
  >
  <option value="" disabled hidden>Vous avez lu ce livre?</option>
    {#each status as s}
      <option value={s}>{s}</option>
    {/each}
  </select>
<button onclick={() => changeStatus(book, book.status)}>Oui</button>
</div>
    {/if}
  </div>
  <div class="detail_title">
    <h1>Harry Potter1</h1>
  </div>
  <div class="detail_description">
    <p><strong>Auteur:</strong> J.K. Rowling</p>
    <p><strong>Année:</strong> 1997</p>
    <h2>Description</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </div>
</section>
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
</style>
