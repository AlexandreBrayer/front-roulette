<script>
  import { Router, Route, Link } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Create from "./pages/Create.svelte";
  import Home from "./pages/Home.svelte";
  export let url = "";
  import { token , user} from "./stores/store.js";
  import { onDestroy , onMount} from "svelte";
  let tokenValue;
  function getUserInfo() {
    fetch(import.meta.env.VITE_API + "/login", {
      method: "GET",
      headers: {
        Authorization: tokenValue,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        user.set(data);
      });
  }
  token.subscribe((value) => {
    tokenValue = value;
    console.log("token", tokenValue);
  });
  const unsubscribe = token.subscribe((value) => {
    tokenValue = value;
  });
  onDestroy(unsubscribe);
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
        {/if}
      </div>
    </div>
  </nav>
  
  <div>
    <Route path="/login"><Login /></Route>
    <Route path="/register"><Register /></Route>
    <Route path="/"><Home/></Route>
    <Route path="/create"><Create /></Route>
  </div>
</Router>
