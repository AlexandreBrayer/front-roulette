<script>
  import { Router, Route, Link } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Create from "./pages/Create.svelte";
  import Home from "./pages/Home.svelte";
  import Silvers from "./pages/Silvers.svelte";
  export let url = "";
  import { token, user } from "./stores/store.js";
  import { onDestroy, onMount } from "svelte";
  let tokenValue;
  let isSilver;
  function getUserInfo() {
    fetch(import.meta.env.VITE_API + "/login", {
      method: "GET",
      headers: {
        Authorization: tokenValue,
      },
    })
      .then(async (res) => {
        if (res.status == 200) {
          user.set(await res.json());
        } else {
          user.set(null);
          token.set(null);
          localStorage.removeItem("token");
        }
      })
  }
  function disconnect() {
    token.set(null);
    localStorage.removeItem("token"); 
  }
  user.subscribe((value) => {
    if (value) {
      isSilver = value.silver;
    }
  });
  token.subscribe((value) => {
    tokenValue = value;
  });
  const userUnsubscribe = user.subscribe((value) => {
    if (value) {
      isSilver = value.silver;
    }
  });
  const unsubscribe = token.subscribe((value) => {
    tokenValue = value;
  });
  onDestroy(() => {
    userUnsubscribe();
    unsubscribe();
  });
  onMount(async () => {
    if (tokenValue) {
      getUserInfo();
    }
  });
  if (localStorage.getItem("token")) {
    token.set(localStorage.getItem("token"));
  }
</script>

<Router {url}>
  <nav>
    <div class="brand">
      <Link class="link" to="/">Stratouroulettou</Link>
    </div>
    <div class="navigation">
      <div class="menu">
        {#if tokenValue == null}
          <Link class="link" to="/">Home</Link>
          <Link class="link" to="/login">Login</Link>
          <Link class="link" to="/register">Register</Link>
        {:else}
          <Link class="link" to="/">Home</Link>
          <Link class="link" to="/create">Create</Link>
          {#if isSilver == true}
            <Link class="link" to="/silvers">Silver</Link>
          {/if}
          <button on:click={disconnect} class="button is-danger mt-1">Logout</button>
        {/if}
      </div>
    </div>
  </nav>

  <div>
    <Route path="/login"><Login /></Route>
    <Route path="/register"><Register /></Route>
    <Route path="/"><Home /></Route>
    <Route path="/create"><Create /></Route>
    <Route path="/silvers"><Silvers /></Route>
  </div>
</Router>
