<script>
  let { book } = $props();
</script>

<article class="card">
  <figure>
    <img src={book.cover} alt={book.title} />
    <figcaption class="content">
      <h3>{book.title}</h3>
      <p>Auteur: {book.author}</p>
      <p>Année: {book.publish_year}</p>
    </figcaption>
  </figure>
</article>

<style>
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 280px;
    overflow: hidden; 
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  figure {
    margin: 0; 
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .content {
    padding: 15px;
    flex-grow: 1; 
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    line-height: 1.2;
  }

  p {
    margin: 4px 0;
    font-size: 0.9rem;
    color: #666;
  }
</style>
