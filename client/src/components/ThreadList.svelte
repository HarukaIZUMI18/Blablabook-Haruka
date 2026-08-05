<script>
     // Imports et état global
  import { onMount } from "svelte";
  import { api } from "../service/api.service.js";

  /** @type {Array<{id: number, title: string, body: string, user?: {name: string}}>} */
  let threads = $state([]);
  let loading = $state(true);
  let error = $state("");

  onMount(async () => {
    try {
        const data = await api.allThread();
        threads = data.threads;
    }  catch (err) {
            error = "Impossible de récupérer le sujet."
        } finally {
            loading = false;
        }
  })
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
        <h3>{thread.title}</h3>
        <p class="body">{thread.body}</p>
        <span class="author">{thread.user?.name}</span>
      </a>
    {/each}
  {/if}
</div>

<style>
  .thread-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .thread-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.332);
    padding: 1rem;
    transition: transform 0.2s;
  }

  .thread-card:hover {
    transform: scale(1.02);
  }

  .thread-card h3 {
    margin: 0 0 0.4rem 0;
    color: var(--color-text);
  }

  .thread-card .body {
    margin: 0 0 0.4rem 0;
    color: #666;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .thread-card .author {
    font-size: 0.8rem;
    color: #999;
  }
</style>