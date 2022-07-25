<script lang="ts">
  import { createEventDispatcher } from "svelte";
  let side = "none";
  const dispatch = createEventDispatcher();
  function iChanged(e) {
    console.log(e.target.value);
    dispatch("sideChange", e.target.value);
  }
</script>

<div class="container">
  <div class="button-wrap">
    <input
      bind:group={side}
      on:change={iChanged}
      class="hidden radio-label"
      type="radio"
      name="accept-offers"
      id="maybe-button"
      value={"none"}
      checked={true}
    />
    <label class="button-label" for="maybe-button">
      <h1>None</h1>
    </label>
    <input
      bind:group={side}
      on:change={iChanged}
      value={"ct"}
      class="hidden radio-label"
      type="radio"
      name="accept-offers"
      id="yes-button"
    />
    <label class="button-label" for="yes-button">
      <h1>CT</h1>
    </label>
    <input
      on:change={iChanged}
      bind:group={side}
      value={"t"}
      class="hidden radio-label"
      type="radio"
      name="accept-offers"
      id="no-button"
    />
    <label class="button-label" for="no-button">
      <h1>T</h1>
    </label>
  </div>
</div>
