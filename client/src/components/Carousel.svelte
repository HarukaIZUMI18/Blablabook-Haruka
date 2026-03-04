<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from "../service/api.service.js";

  let books = [];

  let index = 0;
  let visibleCount = 5;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 590) return 1;
    if (w <= 870) return 2;
    if (w <= 1200) return 3;
    if (w <= 1550) return 4;
    return 5;
  }

  function updateVisibleCount() {
    visibleCount = getVisibleCount();
  }

  function getVisibleBooks(books, start, count) {
    if (!books || books.length === 0) return [];
    return Array.from(
      { length: count },
      (_, i) => books[(start + i) % books.length],
    );
  }

  $: visibleBooks = getVisibleBooks(books, index, visibleCount);

  function prev() {
    index = (index - 1 + books.length) % books.length;
  }

  function next() {
    index = (index + 1) % books.length;
  }

  // --- AUTO-DEFILEMENT : fait défiler le carousel automatiquement toutes les 3 secondes ---
  let interval;

  onMount(async () => {
    console.log("onMount lancé");

    try {
      const res = await api.randomBook();
      console.log("RES =", res);
      console.log("TYPE =", Array.isArray(res) ? "array" : typeof res);

      books = res;
    } catch (err) {
      console.error("ERREUR API =", err);
    }

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    // --- AUTO-DEFILEMENT : démarre le défilement automatique ---
    interval = setInterval(() => {
      next();
    }, 3000);
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateVisibleCount);
    // --- AUTO-DEFILEMENT : stoppe le défilement automatique quand le composant est détruit ---
    clearInterval(interval);
  });
</script>

{#if books.length > 0}
  <div class="carousel">
    <button class="arrow" on:click={prev} aria-label="Précédent"
      >&#10094;</button
    >

    <div class="slides">
      {#each visibleBooks as book, i (index + i)}
        <div class="slide">
          <CardBook {book} />
        </div>
      {/each}
    </div>

    <button class="arrow" on:click={next} aria-label="Suivant">&#10095;</button>
  </div>
  <div class="dots">
    <!-- --- POINTS DE NAVIGATION : chaque point est un bouton cliquable et accessible --- -->
    {#each books as _, i}
      <button
        class="dot {i === index ? 'active' : ''}"
        on:click={() => (index = i)}
        aria-label={`Aller au slide ${i + 1}`}
      ></button>
      <!-- accessibilité : description pour lecteurs d'écran -->
    {/each}
  </div>
{/if}

<style>
  .carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  padding: 0 8px;
  box-sizing: border-box;
  height: 60vh;
  gap: 16px; /* espace fixe entre flèches et slides */
}





  /* --- POINTS DE NAVIGATION : style des petits points sous le carousel --- */
  .dots {
  position: absolute;
  bottom: -30px; /* descend les points sans toucher aux livres */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}



  /* bouton sans style par défaut */
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none; /* enlève la bordure du bouton */
    padding: 0; /* enlève le padding du bouton */
    background: #ccc;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .dot.active {
    background: #bbbf49;
  }

  .slides {
    display: flex;
    gap: 1.25rem;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .slide {
    flex: 0 0 auto;
    max-width: 280px;
    display: flex;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition:
      box-shadow 0.25s ease,
      transform 0.2s ease;
  }

  .slide:hover {
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15);
    transform: scale(1.03);
  }

  .arrow {
  flex-shrink: 0;
  width: 48px;              /* largeur fixe = espace stable */
  height: 48px;             /* optionnel, pour un carré propre */
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 4rem;
  cursor: pointer;
  padding: 0;               /* on enlève le padding qui faisait varier la taille */
  transition: transform 0.2s ease;
  user-select: none;
  z-index: 1000;
  box-shadow: none;
}



  .arrow:hover {
    transform: scale(1.2);
  }

  @media (max-width: 800px) {
  .arrow {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .arrow {
    font-size: 2rem;
  }
}
</style>
