<script>
  let token = $state(localStorage.getItem("token"));
</script>

<footer>
  <div class="infomations">
    <!-- Section contact -->
    <dev class="contact">
      <h3>Contact</h3>
      <p>
        Email: <a href="mailto:blablabook&#64;book.com">blablabook@book.com</a>
      </p>
    </dev>
    <!-- Section réseaux sociaux -->
    <div class="social_media">
      <h3>Suivez-nous sur ...</h3>
      <nav class="icons">
        <a href="https://www.instagram.com/"
          ><img
            width="50"
            height="50"
            src="https://img.icons8.com/doodle/48/instagram-new.png"
            alt="instagram"
          /></a
        >
        <a href="https://www.facebook.com/?locale=fr_FR"
          ><img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/facebook--v1.png"
            alt="facebook"
          /></a
        >
        <a href="https://www.tiktok.com/fr/"
          ><img
            width="50"
            height="50"
            src="https://img.icons8.com/office/40/tiktok.png"
            alt="tiktok"
          /></a
        >
        <a href="https://x.com/?lang=fr"
          ><img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/twitterx--v1.png"
            alt="twitterx--v1"
          /></a
        >
      </nav>
    </div>
    <div class="info__legales">
      <!-- Plan du site -->
      <h3>Plan de site</h3>
      <nav class="plan">
        <a href="/">Accueil</a>
        <a href="/livres">Catalogue</a>
        {#if token}
          <a href="/collection">Ma collection</a>
        {/if}
      </nav>
      <!-- Mentions légales -->
      <h3>Mentions légales</h3>
      <p>
        Site réalisé dans le cadre d’un projet pédagogique. Conformément au
        <a
          href="https://www.economie.gouv.fr/entreprises/gerer-son-entreprise-au-quotidien/assurer-sa-cybersecurite-et-la-protection-de-ses/le#:~:text=dit%20la%20loi-,Le%20RGPD%2C%20qu%27est%2Dce%20que%20c%27est,dans%20toute%20l%27Union%20europ%C3%A9enne."
          >RGPD</a
        >
        et aux recommandations de la <a href="https://www.cnil.fr/fr">CNIL</a>,
        ce site respecte les principes de protection des données et
        d’accessibilité numérique.
      </p>
      <h3>Droit applicable</h3>
      <p>
        Les présentes <a
          href="https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/site-web/rediger-des-conditions-generales-dutilisation"
          >CGU</a
        >
        sont soumises au droit français.
      </p>
    </div>
    <!-- Copyright -->
    <div class="copyright">
      <p>&#169; 2026 Blablabook</p>
    </div>
  </div>
</footer>

<style>
  footer {
    margin-top: 5rem;
    margin-bottom: 0;
    width: 100%;
    font-size: 1rem;
    background: var(--color-primary);
    box-shadow: var(--shadow);
    position: relative;
  }

  h3 {
    font-size: 1.3rem;
  }

  .infomations {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    grid-column-gap: 2rem;
    grid-row-gap: 1rem;
    padding: 1rem;
    margin: 2rem;
  }

  .contact {
    grid-area: 1 / 1 / 2 / 3;
  }
  .social_media {
    grid-area: 2 / 1 / 3 / 3;
  }
  .info__legales {
    grid-area: 1 / 3/ 3 / 6;
    width: 80%;
  }

  .plan {
    display: flex;
    justify-content: space-around;
  }

  .plan a {
    position: relative;
    text-decoration: none;
  }

  .plan a::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--color-secondary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }

  .plan a:hover {
    opacity: 1;
  }
  .plan a:hover::after {
    transform: scaleX(1);
  }
  .copyright {
    grid-area: 3 / 1 / 4 / 6;
    text-align: center;
    margin-top: 1rem;
  }
  /* ── Responsive ── */
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
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
    .info__legales {
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
    .social_media {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }
</style>
