<script>
// @ts-nocheck

  // Imports et état global
  import ThreadForm from "../ThreadForm.svelte";
  import ThreadList from "../ThreadList.svelte";

  /** @type {ThreadList} */
  let threadListRef;
</script>

<div class="container">
  <ThreadForm onThreadCreated={() => threadListRef.reload()} />
  <ThreadList bind:this={threadListRef} />
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
