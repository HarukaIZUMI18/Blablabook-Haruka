<script>
  // Import des hooks Svelte
  import { onMount } from 'svelte';
  // Import du composant Header
  import Header from './Header.svelte';

  // Variable pour stocker l'erreur
  let error = null;

  // Fonction pour gérer les erreurs
  const handleError = (event) => {
    error = event.error;
  };

  // Lifecycle hook - s'exécute au montage du composant
  onMount(() => {
    // Ajout des écouteurs d'événements pour les erreurs
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  });
</script>

{#if error}
  <Header />

  <main>
    <div class="error-container">
      <h1>500 - Erreur Interne du Serveur</h1>
      <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
      <button on:click={() => window.location.reload()} class="retry-btn">Réessayer</button>
    </div>
  </main>
{:else}
  <slot />
{/if}

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

  .retry-btn {
    background: var(--color-secondary);
    color: var(--color-bg);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    box-shadow: var(--shadow-btn);
    transition: box-shadow 0.2s;
  }

  .retry-btn:hover {
    box-shadow: var(--shadow-btn-hover);
  }
</style>
