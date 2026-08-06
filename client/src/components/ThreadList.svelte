<script>
     // Imports et état global
  import { onMount } from "svelte";
  import { api } from "../service/api.service.js";

  /** @type {Array<{id: number, title: string, body: string, created_at: string,
  updated_at: string, user?: {name: string}}>} */
  let threads = $state([]);
  let loading = $state(true);
  let error = $state("");

  onMount(async () => {
    console.log("onMount");
    try {
        const data = await api.allThread();
        console.log("data =", data);
        console.log("threads =", data?.threads);
        threads = data.threads;
    }  catch (err) {
            error = "Impossible de récupérer le sujet."
        } finally {
            loading = false;
        }
  });
  function formatDate(date) {
    return new Date(date).toLocaleString("fr-FR");
  }
</script>

<div class="thread-list">
  {#if loading}
    <p>Chargement...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if threads.length === 0}
    <p>Il n'y a pas encore de sujets.</p>
  {:else}
    {#each threads as thread}
      <a href="/thread/{thread.id}" class="thread-card">
      <div class="thread-header">
        <h3>{thread.title}</h3>
        <span class="author">{thread.user?.name}</span>
        <p class="date">
  {formatDate(thread.created_at)}
</p>
       
</div>
      </a>
    {/each}
  {/if}
</div>

<style>
  .thread-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .thread-card {
    display: block;
    text-decoration: none;
    flex: row;
    color: inherit;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.332);
    padding: 1rem;
    transition: transform 0.2s;
  }

  .thread-card:hover {
    transform: scale(1.02);
  }

  .thread-card .thread-header{
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }
  
  .thread-card h3 {
    margin: 0 0 0.4rem 0;
    flex: 1;
    color: var(--color-text);
  }

  .thread-card .author {
    font-size: 1rem;
    color: #999;
  }

  .thread-card .date {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
}
</style>