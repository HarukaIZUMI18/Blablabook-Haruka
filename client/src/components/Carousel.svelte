<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from "../service/api.service.js";

  // Déclaration des états avec les runes
  let books = $state([]);
  let index = $state(0);
  let visibleCount = $state(5);
  // Détermine combien de livres afficher selon la largeur de l'écran
  function getVisibleCount() {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w <= 650) return 1;
    if (w <= 1000) return 2;
    if (w <= 1300) return 3;
    if (w <= 1550) return 4;
    return 5;
  }
  // Met à jour le nombre d'éléments visibles
  function updateVisibleCount() {
    visibleCount = getVisibleCount();
  }

  // REMPLACEMENT DU $: PAR $derived
  // Cette variable se mettra à jour automatiquement dès que books, index ou visibleCount changent
  let visibleBooks = $derived(
    books.length > 0
      ? Array.from(
          { length: visibleCount },
          (_, i) => books[(index + i) % books.length],
        )
      : [],
  );
  // Aller au livre précédent dans le carousel
  function prev() {
    if (books.length === 0) return;
    index = (index - 1 + books.length) % books.length;
  }
  // Aller au livre suivant dans le carousel
  function next() {
    if (books.length === 0) return;
    index = (index + 1) % books.length;
  }

  let interval;
  // Récupère des livres ramdom depuis l'API
  onMount(async () => {
    try {
      const res = await api.randomBook();
      books = res || [];
    } catch (err) {
      console.error("ERREUR API =", err);
    }
    // Initialise le nombre de livres visibles
    updateVisibleCount();
    // Met à jour le carousel lors du redimensionnement de l'écran
    window.addEventListener("resize", updateVisibleCount);
    // Défilement automatique toutes les 8 secondes
    interval = setInterval(next, 8000);
  });
  // Supprime l'événement resize
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateVisibleCount);
    }
    // Arrête le défilement automatique
    clearInterval(interval);
  });
</script>

<!-- Carousel de livres -->
{#if books.length > 0}
  <section class="carousel-container" aria-label="Suggestions de livres">
    <div class="carousel-viewport">
      <!-- Bouton précédent -->
      <button class="arrow prev" onclick={prev} aria-label="Précédent">
        <span>&#10094;</span>
      </button>
      <!-- Livres visibles -->
      <div class="slides-container">
        {#each visibleBooks as book, i (book.id || index + i)}
          <div class="slide-wrapper">
            <CardBook {book} />
          </div>
        {/each}
      </div>
      <!-- Bouton suivant -->
      <button class="arrow next" onclick={next} aria-label="Suivant">
        <span>&#10095;</span>
      </button>
    </div>
    <!-- Indicateurs de navigation -->
    <div class="navigation-dots">
      {#each books as _, i}
        <button
          class="dot {i === index ? 'active' : ''}"
          onclick={() => (index = i)}
          aria-label="Aller au slide {i + 1}"
        ></button>
      {/each}
    </div>
  </section>
{/if}

<style>
  /* Conteneur principal qui englobe tout (carousel + points) */
  .carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 30px;
    margin: 40px 0;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  /* Zone de visualisation (Flèche - Slides - Flèche) */
  .carousel-viewport {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1600px;
    gap: 15px;
  }

  /* Conteneur interne des cartes */
  .slides-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
    align-items: stretch;
  }

  .slide-wrapper {
    flex: 0 0 280px;
    width: 280px;

    display: flex;
    flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .slide-wrapper:hover {
    transform: translateY(-10px);
  }

  /* --- FLÈCHES DE NAVIGATION --- */
  .arrow {
    background: none;
    box-shadow: none;
    border: none;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 2.5rem;
    color: #333;
    transition: all 0.2s ease;
    z-index: 10;
    flex-shrink: 0;
    user-select: none;
    padding: 0;
  }

  .arrow:hover {
    color: #bbbf49;
    transform: scale(1.2);
  }

  .arrow:active {
    transform: scale(0.9);
  }

  /* --- POINTS DE NAVIGATION (DOTS) --- */
  .navigation-dots {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 0;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: #ccc;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }

  .dot:hover {
    background: #aaa;
  }

  .dot.active {
    background: #bbbf49;
    border-radius: 10px;
  }

  /* --- RESPONSIVE : ADAPTATION DES TAILLES --- */

  /* Tablettes et petits écrans portables */
  @media (max-width: 1200px) {
    .slide-wrapper {
      flex: 0 0 240px;
      width: 240px;
    }
  }

  /* Mobiles (quand visibleCount passe à 1 ou 2) */
  @media (max-width: 650px) {
    .arrow {
      font-size: 1.8rem;
      width: 35px;
    }

    .slides-container {
      gap: 10px;
    }

    .slide-wrapper {
      /* Sur mobile, la carte prend la place disponible sans dépasser */
      flex: 0 0 100%;
      width: 100%;
      max-width: 280px;
    }
  }
</style>
