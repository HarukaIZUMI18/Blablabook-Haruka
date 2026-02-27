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
  .img_book {
    display: flex;
    flex-direction: column; 
    align-items: center;
    width: 60%;
  }

  .img_book img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }

  figcaption {
  width: 100%;
  padding: 8px;
  text-align: center;
  background-color: #f0f0f0; 
  box-sizing: border-box;
  border-bottom-left-radius: 20 px;
  border-bottom-right-radius: 20 px;
}

</style>







