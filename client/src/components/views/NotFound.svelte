<script>
</script>

<main>
  <div class="error-container">
    <h1>404 - Page Non Trouvée</h1>
    <p>La page que vous recherchez n'existe pas.</p>
    <a href="/" class="home-link">Retour à l'accueil</a>
  </div>
</main>

<style>
  .error-container {
    text-align: center;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    color: var(--color-text);
    font-size: var(--font-size-lg);
    margin-bottom: 1rem;
  }

  p {
    color: var(--color-text);
    font-size: var(--font-size-base);
    margin-bottom: 2rem;
  }

  .home-link {
    display: inline-block;
    background: var(--color-secondary);
    color: var(--color-bg);
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    text-decoration: none;
    box-shadow: var(--shadow-btn);
    transition: box-shadow 0.2s;
  }

  .home-link:hover {
    box-shadow: var(--shadow-btn-hover);
  }
</style>
