<footer>
  <div class="infomations">
    <dev class="contact">
      <h3>Contact</h3>
      <p>
        Email: <a href="mailto:blablabook&#64;book.com">blablabook@book.com</a>
      </p>
    </dev>
    <div class="social_media">
      <a href="#"
        ><img
          width="50"
          height="50"
          src="https://img.icons8.com/doodle/48/instagram-new.png"
          alt="instagram-new"
        /></a
      >
      <a href="#"
        ><img
          width="50"
          height="50"
          src="https://img.icons8.com/ios/50/facebook--v1.png"
          alt="facebook--v1"
        /></a
      >
      <a href="#"
        ><img
          width="50"
          height="50"
          src="https://img.icons8.com/office/40/tiktok.png"
          alt="tiktok"
        /></a
      >
    </div>
    <div class="mention_legal">
      <h3>Mentions légales</h3>
      <p>
        Site réalisé dans le cadre d’un projet pédagogique. Conformément au RGPD
        et aux recommandations de la CNIL, ce site respecte les principes de
        protection des données et d’accessibilité numérique.
      </p>
    </div>
    <div class="copyright">
      <p>&#169; Blablabook</p>
    </div>
  </div>
</footer>

<style>
  footer {
    margin-top: 5rem;
    width: 100%;
    background: var(--color-primary);
    box-shadow: var(--shadow);
    position: relative;
  }

  .infomations {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    grid-column-gap: 2rem;
    grid-row-gap: 1rem;
    padding: 1rem;
  }

  .contact {
    grid-area: 1 / 1 / 2 / 3;
  }
  .social_media {
    grid-area: 2 / 1 / 3 / 3;
  }
  .mention_legal {
    grid-area: 1 / 3/ 3 / 6;
    width: 50%;
  }
  .copyright {
    grid-area: 3 / 1 / 4 / 6;
    text-align: center;
    margin-top: 1.5rem;
  }

  @media screen and (max-width: 900px) {
    .infomations {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
      grid-template-rows: auto;
      gap: 1rem;
    }
    .contact {
      grid-area: 1 / 1 / 2 / 2;
    }
    .social_media {
      grid-area: 2 / 1 / 3 / 2;
      display: flex;
  gap: 1rem;
  align-items: center;
    }
    .mention_legal {
      grid-area: 1 / 3 / 3 / 6;
      margin: 1rem;
    }
    .copyright {
      grid-area: 3 / 1 / 4 / 6;
      text-align: center;
    }
  }

  @media screen and (max-width: 600px) {
    .infomations {
      display: flex;
      flex-direction: column;
    }
  }
</style>