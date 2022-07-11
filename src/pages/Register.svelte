<script lang="ts">
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import { navigate } from "svelte-routing";
  let email = "";
  let password = "";
  let name = "";
  let passwordConfirm = "";
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
    function signIn() {
      if (password != passwordConfirm || password == "" || name == "" || email == "") {
        showToast("Error", "Missing field or non matching passwords (stupid)", false);
        return
      }
      fetch("http://88.151.197.165:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "User created successfully") {
            navigate("/login");
          } else {
            showToast("Error", "Missing field or non matching passwords", false);
          }
        })
        .catch((err) => {
          console.log("error", err);
        })
        .finally(() => {
          email = "";
          password = "";
          name = "";
          passwordConfirm = "";
        });
    }
  
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>
<div class="centered-box">
  <div class="p-6 box">
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          bind:value={name}
          placeholder="e.g. alex"
        />
      </div>
    </div>
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
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Confirm Password</label>
      <div class="control">
        <input
          class="input"
          type="password"
          bind:value={passwordConfirm}
          placeholder="********"
        />
      </div>
    </div>

    <button
      on:click={() => {
        signIn();
      }}
      class="button is-primary">Sign In</button
    >
  </div>
  <ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
  </ToastContainer>
</div>
