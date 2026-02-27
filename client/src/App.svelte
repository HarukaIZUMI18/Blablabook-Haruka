<script>
  import { Router, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import CardBook from "./components/CardBook.svelte";
  import Collection from "./components/views/Collection.svelte";
  import Profil from "./components/views/Profil.svelte";
  import BookList from "./components/views/BookList.svelte";
  import Carousel from "./components/Carousel.svelte";

  export let url = "";
</script>

<Router {url}>
  <Header />

  <main>
    <Route path="/">
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
  </main>
</Router>
