<script>
  let { book } = $props();
  let isLoaded = $state(false);
</script>

<article class="card">
  <a href="/livre/{book.id}">
    <figure>
      <div class="image-container">
        {#if !isLoaded}
          <div class="skeleton"></div>
        {/if}

        <img
          src={book.cover}
          alt={book.title}
          class:hidden={!isLoaded}
          onload={() => (isLoaded = true)}
        />
      </div>

      <figcaption class="content">
        <h3>{book.title}</h3>
        <p>Auteur: {book.author}</p>
        <p>Année: {book.publish_year}</p>
      </figcaption>
    </figure>
  </a>
</article>

<style>
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 280px;
    overflow: hidden;
    transition: transform 0.2s;
    margin: 0 auto;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card a {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  figure {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .image-container {
    width: 100%;
    height: 400px;
    position: relative;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.3s ease;
  }

  .hidden {
    opacity: 0;
    position: absolute;
  }

  .skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .content {
    padding: 1rem;
    text-align: center;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: var(--color-text);
  }

  p {
    margin: 2px 0;
    font-size: 0.85rem;
    color: #666;
  }
</style>
