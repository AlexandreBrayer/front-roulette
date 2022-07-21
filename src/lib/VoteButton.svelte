<script lang="ts">
  import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { createEventDispatcher } from "svelte";
  import { token } from "../stores/store.js";
  import { onDestroy } from "svelte";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";

  export let voteStyle = true;
  export let hasVoted = false;
  export let stratId = "";
  export let number = 0;
  let tokenValue;
  token.subscribe((value) => {
    tokenValue = value;
  });
  const unsubscribe = token.subscribe((value) => {
    tokenValue = value;
  });
  onDestroy(unsubscribe);
  const showToast = (title: string, description: string, succes: boolean) => {
    toasts.add({
      title: title,
      description: description,
      duration: 5000,
      placement: "bottom-right",
      type: succes ? "success" : "error",
      theme: "dark",
    });
  };
  const dispatch = createEventDispatcher();
  function vote() {
    let path : string
    if (voteStyle) {
        path = "/strat/upvote"
    } else {
        path = "/strat/downvote"
    }
    fetch(import.meta.env.VITE_API + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenValue,
        },
        body: JSON.stringify({
          id: stratId,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.id) {
        dispatch("vote", {
          id: stratId
        });
        showToast("Success", "Vote registered", true);
      } else {
        showToast("Error", "Vote not registered", false);
      }
    })
  }
</script>

<div class="vote-container" on:click={vote}>
  {#if voteStyle}
    <FontAwesomeIcon
      class={hasVoted === true ? "up-voted" : "up-vote-button"}
      icon={faArrowUp}
      size="lg"
    />
  {:else}
    <FontAwesomeIcon
      class={hasVoted === true
        ? "down-voted"
        : "down-vote-button"}
      icon={faArrowDown}
      size="lg"
    />
  {/if}
    <div class="vote-number">{number}</div>
</div>
<ToastContainer placement="bottom-right" let:data>
  <FlatToast {data} />
</ToastContainer>
