<script>
  export let book;
</script>

<article>
  <figure class="img_book">
    <img
      src={book.cover}
      alt={"Couverture de " + book.title}
    />
    <figcaption>
      <h2>{book.title}</h2>
      <p><strong>Auteur:</strong> {book.author}</p>
      <p><strong>Année:</strong> {book.year}</p>
    </figcaption>
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
