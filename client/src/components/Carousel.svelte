<script>
  import { onMount, onDestroy } from "svelte";
  import CardBook from "./CardBook.svelte";

  let books = [
    {
      title: "Harry Potter",
      author: "J.K. Rowling",
      year: 1997,
      cover: "https://covers.openlibrary.org/b/id/9269962-L.jpg",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    },
    {
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      year: 1954,
      cover: "https://covers.openlibrary.org/b/id/8101350-L.jpg",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    },
    {
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      year: 1954,
      cover: "https://covers.openlibrary.org/b/id/8101350-L.jpg",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    },
    {
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      year: 1954,
      cover: "https://covers.openlibrary.org/b/id/8101350-L.jpg",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    },
    {
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      year: 1954,
      cover: "https://covers.openlibrary.org/b/id/8101350-L.jpg",
    },
  ];

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

  onMount(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateVisibleCount);
  });
</script>

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
    flex: 1 1 0;
    min-width: 0; 
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
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
