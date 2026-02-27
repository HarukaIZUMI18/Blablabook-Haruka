<script>
  import { Router, Route } from "svelte-routing";
  // Import des composants de structure
  import Header from "./components/Header.svelte";
  import ErrorBoundary from "./components/ErrorBoundary.svelte";
  import NotFound from "./components/views/NotFound.svelte";
  import Collection from "./components/views/Collection.svelte";
  import Profil from "./components/views/Profil.svelte";
  import BookList from "./components/views/BookList.svelte";
  import Carousel from "./components/Carousel.svelte";

  export let url = "";

  $: isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;
</script>

<ErrorBoundary>
  <Router {url}>
    <Header />

    <main>
      <Route path="/">
        {#if !isLoggedIn}
          <div class="welcome">
            <h1>Bienvenue sur <span>BlaBlaBook</span></h1>
            <p>
              Découvrez de nouveaux livres, explorez des univers variés et
              trouvez votre prochaine lecture en un instant.
            </p>
            <p>
              Créez un compte ou connectez‑vous pour accéder à votre espace
              personnel et commencer votre aventure littéraire.
            </p>
          </div>
        {/if}

        <h2>Suggestion de livres :</h2>
        <Carousel />
      </Route>

      <Route path="/profil">
        <Profil />
      </Route>

      <Route path="/collection">
        <Collection />
      </Route>

      <Route path="/livres">
        <BookList />
      </Route>

      <Route path="*">
        <NotFound />
      </Route>
    </main>
  </Router>
</ErrorBoundary>

<style>
  .welcome {
    text-align: center;
    margin: 40px auto;
    padding: 25px 30px;
    max-width: 700px;
    border: 2px solid #592f25;
    border-radius: 12px;
    background: #fdf8f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    color: #592f25;
  }

  .welcome h1 {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .welcome p {
    font-size: 1.15rem;
    margin: 6px 0;
    opacity: 0.9;
  }
</style>
