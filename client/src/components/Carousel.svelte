<script>
    import CardBook from "./CardBook.svelte";

    let books = [
        {
      title: "Harry Potter",
      author: "J.K. Rowling",
      year: 1997,
      cover: "https://covers.openlibrary.org/b/id/7984916-L.jpg"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg"
    },
    {
      title: "Le Seigneur des Anneaux",
      author: "J.R.R. Tolkien",
      year: 1954,
      cover: "https://covers.openlibrary.org/b/id/8101350-L.jpg"
    }
  ];

 let index = 0;

 let visibleCount = window.innerWidth <= 768 ? 2 : 3;

  function prev() {
    index = (index - 1 + books.length) % books.length;
  }

  function next() {
    index = (index + 1) % books.length;
  }
</script>

<div class="carousel">
  <button class="arrow" on:click={prev}>⟨</button>

  <div class="slides">
    {#each books.slice(index, index + 3) as book}
      <div class="slide">
        <CardBook {book} />
      </div>
    {/each}
  </div>

  <button class="arrow" on:click={next}>⟩</button>
</div>





<style>
  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }

  .slides {
    display: flex;
    gap: 10px;
  }

  .slide {
    width: 420px;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: 14px;
    cursor: pointer;
    transition: box-shadow 0.25s ease;
  }

  .slide:hover {
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15);
  }

  .slide :global(.img_book) {
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  .slide:hover :global(.img_book) {
    transform: scale(1.06);
  }

  .arrow {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #592f25;
    margin: 0 10px;
    transition: transform 0.2s ease;
  }

  .arrow:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    .carousel {
      width: 100%;
      overflow-x: auto;
      padding: 0 10px;
    }

    .slides {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
    }

    .slide {
      min-width: 260px;
      scroll-snap-align: center;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s ease;
    }

    .slide:hover {
      transform: scale(1.02);
    }

    .arrow {
      display: none;
    }
  }
</style>






