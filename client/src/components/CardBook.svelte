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
          loading="lazy"
          decoding="async"
          class:hidden={!isLoaded}
          onload={() => (isLoaded = true)}
          onerror={() => {
            isLoaded = false;
          }}
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
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.332);
    width: 100%;
    overflow: hidden;
    transition: transform 0.2s;
    margin: 0 auto;
  }

  .card:hover {
    transform: scale(1.03);
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
    aspect-ratio: 2 / 3;
    position: relative;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    transition: opacity 0.3s ease;
  }

  .hidden {
    opacity: 0;
    position: absolute;
  }

  .skeleton {
    position: absolute;
    inset: 0;
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
    padding: 0.75rem;
    text-align: center;
  }

  h3 {
    margin: 0 0 6px 0;
    font-size: 1.2rem;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    margin-bottom: 5px;
  }

  p {
    margin: 2px 0;
    font-size: 1rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 480px) {
    .content {
      padding: 0.4rem 0.35rem;
    }

    h3 {
      font-size: 0.75rem;
      margin-bottom: 3px;
    }

    p {
      font-size: 0.65rem;
    }
  }
</style>
