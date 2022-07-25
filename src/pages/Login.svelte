<script lang="ts">
  import { token, user } from "../stores/store.js";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import { navigate } from "svelte-routing";
  let email = "";
  let password = "";

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

  function logme() {
    fetch(import.meta.env.VITE_API+"/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          token.set(data.token);
          localStorage.setItem("token", data.token);
          user.set(data)
          navigate("/");
        } else {
          showToast("Error", "Wrong credentials", false);
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        email = "";
        password = "";
      });
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
<div class="centered-box">
  <div class="p-6 box">
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Email</label>
      <div class="control">
        <input
          class="input"
          type="email"
          bind:value={email}
          placeholder="e.g. alex@example.com"
        />
      </div>
    </div>

    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Password</label>
      <div class="control">
        <input
          class="input"
          type="password"
          bind:value={password}
          placeholder="********"
        />
      </div>
    </div>

    <button
      on:click={() => {
        logme();
      }}
      class="button is-primary">Log in</button
    >
  </div>
  <ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
  </ToastContainer>
</div>
