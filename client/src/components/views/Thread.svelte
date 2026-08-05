<script>
  // Imports et état global
  import { onMount } from "svelte";
  import { api } from "../../service/api.service.js";
  import ThreadForm from "../ThreadForm.svelte";
  import ThreadList from "../ThreadList.svelte";
</script>

<div class="container">
  <ThreadForm />
  <ThreadList />
</div>

<style>
  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }

  @media (min-width: 480px) {
    .container {
      width: 100%;
      max-width: 300px;
      margin: 1rem;
      padding: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 1rem;
    }
  }
</style>
