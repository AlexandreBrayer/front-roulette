<script lang="ts">
  import { token } from "../stores/store.js";
  import { onDestroy } from "svelte";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  let name = "";
  let description = "";
  let vars = [];
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
  function createStrat() {
    let varsToSend = {}
    vars.forEach((varItem) => {
      varsToSend[varItem.name] = varItem.value.split(";")
    })

    fetch(import.meta.env.VITE_API+"/strat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenValue,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        vars: varsToSend,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          showToast("Success", "Strat created", true);
        } else {
          showToast("Error", "Strat not created", false);
        }
      })
      .catch((err) => {
      })
      .finally(() => {
        name = "";
        description = "";
        vars = [];
      });
  }
  function parseVars() {
    //find each "%var_name"
    let regex = /%[a-zA-Z0-9_]+/g;
    let matches = description.match(regex);
    let temp = []
    if (matches) {
      temp = matches.map((match) => {
        return {name: match, value: ""};
      });
    } else {
      vars = [];
    }
    //remove dupes
    temp = temp.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
    //remove all vars that are not in temp
    vars = vars.filter((v) => temp.find((t) => t.name === v.name));
    //add new vars to vars
    for (let i = 0; i < temp.length; i++) {
      if (!vars.find((v) => v.name === temp[i].name)) {
        vars.push(temp[i]);
      }
    }
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
          on:input={() => parseVars()}
          placeholder="rush jungle juice and juice some jungle"
        />
      </div>
    </div>
    {#each vars as v, key}
    <p>{v.name}</p>
    <div class="field">
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="e.g. var1;var2;var3"
          bind:value={vars[key]["value"]}
        />
      </div>
    </div>
    {/each}

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
