<script lang="ts">
  import { onMount } from "svelte";
  import SilverItem from "../lib/SilverItem.svelte"
  let silvers = [];
  async function getSilvers() {
    const res = await fetch(import.meta.env.VITE_API + "/silver");
    const data = await res.json();
    if (res.status == 200) {
      console.log(data)
      return data;
    } else {
      return [];
    }
  }
  onMount(async () => {
    silvers = await getSilvers();
    console.log(silvers)
  });
  
</script>

<svelte:head>
  <title>Silvers</title>
</svelte:head>
<div class="centered-box">
  <div class="p-6 box">
    {#each silvers as s}
      <SilverItem on:banRefresh={async () => {silvers = await getSilvers()}} {s} />
    {/each}
  </div>
</div>
