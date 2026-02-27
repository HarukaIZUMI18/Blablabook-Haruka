<script>
  // Import du router et des routes
  import { Router, Route } from "svelte-routing";
  // Import des composants
  import Header from "./components/Header.svelte";
  import CardBook from "./components/CardBook.svelte";
  import Collection from "./components/views/Collection.svelte";
  import Profil from "./components/views/Profil.svelte";
  import BookList from "./components/views/BookList.svelte";
  // Import des composants d'erreur
  import NotFound from "./components/views/NotFound.svelte";
  import ErrorBoundary from "./components/ErrorBoundary.svelte";

  export let url = "";
</script>

<!-- ErrorBoundary pour gérer les erreurs 500 -->
<ErrorBoundary>
  <Router {url}>
    <Header />

    <main>
      <Route path="/" exact>
        <h2>Suggestion de livre</h2>
        <CardBook />
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

      <!-- Route catch-all pour les pages 404 -->
      <Route path="/*">
        <NotFound />
      </Route>
    </main>
  </Router>
</ErrorBoundary>
