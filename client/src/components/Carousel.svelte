<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";
  import { api } from "../service/api.service.js";

  let books = [];

  let index = 0;
  let visibleCount = 5;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 700) return 2;
    if (w <= 1024) return 3;
    return 5;
  }

  function updateVisibleCount() {
    visibleCount = getVisibleCount();
  }

  function getVisibleBooks(books, start, count) {
  if (!books || books.length === 0) return []; 
  return Array.from(
    { length: count },
    (_, i) => books[(start + i) % books.length]
  );
}


  $: visibleBooks = getVisibleBooks(books, index, visibleCount);

  function prev() {
    index = (index - 1 + books.length) % books.length;
  }

  function next() {
    index = (index + 1) % books.length;
  }

  onMount(async () => {
  console.log("onMount lancé");

  try {
    const res = await api.randomBook();
    console.log("RES =", res);
    console.log("TYPE =", Array.isArray(res) ? "array" : typeof res);

    books = res; // on corrigera après selon ce que tu vois
  } catch (err) {
    console.error("ERREUR API =", err);
  }




    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateVisibleCount);
  });
</script>

{#if books.length > 0}
<div class="carousel">
  <button class="arrow" on:click={prev} aria-label="Précédent">&#10094;</button>

  <div class="slides">
    {#each visibleBooks as book, i (index + i)}
      <div class="slide">
        <CardBook {book} />
      </div>
    {/each}
  </div>

  <button class="arrow" on:click={next} aria-label="Suivant">&#10095;</button>
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
  max-width: 245px;    
  display: flex;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
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
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #592f25;
    padding: 0 10px;
    transition: transform 0.2s ease;
    user-select: none;
  }

  .arrow:hover {
    transform: scale(1.2);
  }

  @media (max-width: 700px) {
    .slides {
      gap: 0.75rem;
    }

    .arrow {
      font-size: 1.5rem;
      padding: 0 6px;
    }
  }

  @media (max-width: 480px) {
    .slides {
      gap: 0.5rem;
    }

    .arrow {
      font-size: 1.25rem;
      padding: 0 4px;
    }
  }
</style>
