<script>
   // svelte-ignore export_let_unused
      export let params;
</script>
<section>
    <div class="detail_img">
    <img
      src="https://covers.openlibrary.org/b/id/14348537-L.jpg"
      alt="Couverture de Harry Potter"
    /></div>
    <div class="detail_title">
    <h1>Harry Potter1</h1>
    </div>
    <div class="detail_description">
    <h2>Description</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
        deserunt mollit anim id est laborum.</p>
    </div>
</section>

<style>
    section{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(5, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
    }
    .detail_img{
        grid-area: 1 / 1 / 5 / 3;
    }
    .detail_title{
        grid-area: 1 / 3 / 2 / 6;
    }

    .detail_description{
        grid-area: 2 / 3 / 5 / 6;
    }
</style>