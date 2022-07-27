<script lang="ts">
  import { token } from "../stores/store.js";
  import { onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  export let s: any;
  const dispatch = createEventDispatcher();
  let now = Date.now();
  let myUnban = new Date(s.unbanned).toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  let banTime;

  let tokenValue;
  token.subscribe((value) => {
    tokenValue = value;
  });
  const unsubscribe = token.subscribe((value) => {
    tokenValue = value;
  });
  onDestroy(unsubscribe);

  const showToast = (title: string, description: string, succes: boolean) => {
    const toast = toasts.add({
      title: title,
      description: description,
      duration: 5000,
      placement: "bottom-right",
      type: succes ? "success" : "error",
      theme: "dark",
    });
  };

  function ban() {
    let timestamp = new Date(banTime).getTime();
    fetch(import.meta.env.VITE_API + "/silver/ban", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenValue,
      },
      body: JSON.stringify({
        id: s._id,
        timestamp: timestamp,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          showToast("Success", "Silver banned", true);
          dispatch("banRefresh");
        } else {
          showToast("Error", "Silver not banned", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function unban() {
    fetch(import.meta.env.VITE_API + "/silver/ban", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenValue,
      },
      body: JSON.stringify({
        id: s._id,
        timestamp: now,
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          showToast("Success", "Silver unbanned", true);
          dispatch("banRefresh");
        } else {
          showToast("Error", "Silver not unbanned", false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

<div
  class={now + 30 < s.unbanned
    ? "silver-item-container silver-banned"
    : "silver-item-container silver-unbanned"}
>
  <div>{s.name}</div>
  <div>{myUnban}</div>
  {#if now + 30 > s.unbanned}
    <div>
      <label for="ban-time">Banned ?</label>

      <input bind:value={banTime} type="datetime-local" id="ban-time" />
    </div>
    <button on:click={ban} class="button is-info">Update</button>
  {:else}
    <button on:click={unban} class="button is-info">Unban</button>
  {/if}
</div>
<ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
  </ToastContainer>
