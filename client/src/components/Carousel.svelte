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

</script>

<div class="carousel">
  {#each books as book}
    <div class="slide">
      <CardBook {book} />
    </div>
  {/each}
</div>

<style>
  .carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 20px;
    padding: 10px 0;
  }

  .slide {
    min-width: 280px;
    scroll-snap-align: center;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }
</style>


