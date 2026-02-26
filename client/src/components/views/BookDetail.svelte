<script>
  import { Link } from "svelte-routing";
  import Collection from "./Collection.svelte";

  let token = localStorage.getItem("token");
  // svelte-ignore export_let_unused
  export let params;
</script>

<section>
  <div class="detail_img">
    <img
      src="https://covers.openlibrary.org/b/id/14348537-L.jpg"
      alt="Couverture de Harry Potter"
    />
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
{:else}
<div class="back_list">
<Link to="/BookList">
<button>Retour à la liste</button>
</Link>
<Link to="/Collection">
<button>Retour à ma collection</button>
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
  .detail_img img{
    height: 450px;
    max-width: 100%;
  }
  .detail_title {
    grid-area: 1 / 3 / 2 / 6;
  }

  .detail_description {
    grid-area: 2 / 3 / 5 / 6;
  }

  .back_list{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

</style>
