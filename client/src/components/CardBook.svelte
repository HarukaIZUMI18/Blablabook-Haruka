<script>
  import { Link } from "svelte-routing";
  //Pour test
  export let book = {
    id: 1,
  };
</script>
<article>
  <figure class="img_book">
    <img
      src="https://covers.openlibrary.org/b/id/14348537-L.jpg"
      alt="Couverture de Harry Potter"
    />
    <Link to={`/book/${book.id}`}>
    <figcaption>
      <h2>Harry Potter1</h2>
      <p><strong>Auteur:</strong>J.K. Rowling</p>
      <p><strong>Année:</strong>1997</p>
    </figcaption>
    </Link>
  </figure>
</article>

<style>
  article {
    width: 280px;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .img_book {
    margin: 0;
  }

  .img_book img {
    width: 100%;
    height: 380px;
    object-fit: cover;
    display: block;
  }

  figcaption {
    padding: 15px;
  }

  h2 {
    margin: 0 0 10px 0;
    font-size: 1.3rem;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>
