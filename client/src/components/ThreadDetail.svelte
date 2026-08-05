<script>
  import { onMount } from "svelte";
  import { api } from "../service/api.service.js";
  import CommentForm from "./CommentForm.svelte";

let { params } = $props();

/** @type {{id: number, title: string, body: string, user?: {name: string}, comments?: Array<{id: number, body: string, user?: {name: string}}>} | null} */
let thread = $state(null);
  let error = $state("");

  async function load() {
    try {
      thread = await api.getThread(params.id);
    } catch (err) {
      error = "Impossible de récupérer le sujet.";
      console.error(err);
    }
  }

  onMount(load);

  function handleCommentAdded() {
    load();
  }
</script>

{#if error}
  <p class="error">{error}</p>
{:else if thread}
  <div class="thread-detail">
    <h1>{thread.title}</h1>
    <p>{thread.body}</p>
    <span class="author">{thread.user?.name}</span>

    <h2>Commentaires</h2>
    <ul>
      {#each thread.comments ?? [] as comment}
        <li>
          <strong>{comment.user?.name}</strong>: {comment.body}
        </li>
      {/each}
    </ul>

    <CommentForm threadId={thread.id} onCommentAdded={handleCommentAdded} />
  </div>
{:else}
  <p>Chargement...</p>
{/if}

<style>
  .thread-detail {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 1rem;
  }

  .author {
    font-size: 0.85rem;
    color: #999;
  }

  .error {
    color: #c62828;
    text-align: center;
  }
</style>