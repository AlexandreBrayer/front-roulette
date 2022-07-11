<script lang="ts">
    let title = ""
    let description = ""
    function roll() {
       fetch("http://88.151.197.165:3001/strat/roll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        }).then((res) => res.json())
        .then((data) => {
            if (data.name == title) {
                roll()
            }
            title = data.name
            description = data.description
        })
    }
    roll()
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<div class="centered-box">
  <div class="p-6 box wideme">
    <h1 class="title">{title}</h1>
    <h2  class="subtitle">{description}</h2>
    <button
      on:click={() => {
        roll();
      }}
      class="button is-primary">Roll</button
    >
  </div>
</div>
