<section>
  <article>
    <figure class="img_book"><img src="https://covers.openlibrary.org/b/id/14348537-L.jpg" alt="">
    <figcaption>
    <h2>Harry Potter</h2>
    <p>Auteur: J.K Roling</p>
    <p>Année: 1997</p>
    </figcaption>
    </figure>
  </article>
  <article>
    <figure class="img_book"><img src="https://covers.openlibrary.org/b/id/14348537-L.jpg" alt="">
    <figcaption>
     <h2>Harry Potter 2</h2>
    <p>Auteur: J.K Roling</p>
    <p>Année: 1998</p>
    </figcaption>
    </figure>
  </article>
  <article>
    <figure class="img_book"><img src="https://covers.openlibrary.org/b/id/14348537-L.jpg" alt="">
    <figcaption>
    <h2>Harry Potter 3</h2>
    <p>Auteur: J.K Roling</p>
    <p>Année: 1999</p>
    </figcaption>
    </figure>
  </article>
</section>

<style>
section{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin: 2rem;
}
    article{
        display: flex;
        flex-direction: column;
        border: 2px var(--color-secondary) solid;
        border-radius: 10px;
        width: calc(100% / 3);
        height: 60vh;
        align-items: center;
        overflow: hidden;
    }

    .img_book img{
        width: auto;
        height: 30vh;
    }
</style>