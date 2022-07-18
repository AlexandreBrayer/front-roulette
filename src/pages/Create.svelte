<script lang="ts">
  import { token } from "../stores/store.js";
  import { onDestroy } from "svelte";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  let name = "";
  let description = "";
  let tokenValue;
  token.subscribe((value) => {
    tokenValue = value;
    console.log("token", tokenValue);
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
  function createStrat() {
    fetch(import.meta.env.VITE_API+"/strat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenValue,
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data._id) {
          showToast("Success", "Strat created", true);
        } else {
          showToast("Error", "Strat not created", false);
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        name = "";
        description = "";
      });
  }
</script>

<svelte:head>
  <title>Create</title>
</svelte:head>

<div class="centered-box">
  <div class="p-6 box wideme">
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="email"
          bind:value={name}
          placeholder="e.g. Jungle juice rush"
        />
      </div>
    </div>

    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Description</label>
      <div class="control">
        <textarea
          class="textarea"
          type="password"
          bind:value={description}
          placeholder="rush jungle juice and juice some jungle"
        />
      </div>
    </div>

    <button
      on:click={() => {
        createStrat();
      }}
      class="button is-primary">Create</button
    >
  </div>
  <ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
  </ToastContainer>
</div>
