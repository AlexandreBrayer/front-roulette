<script lang="ts">
  import Networks from "../lib/Networks.svelte";
  import VoteButton from "../lib/VoteButton.svelte";
  import { user } from "../stores/store.js";
  import { onDestroy, onMount } from "svelte";
  let title = "";
  let description = "";
  let stratId = "";
  let voteState = 0; //0 = neutral, 1 = up, 2 = down
  let userData: any = {};
  let strat: any = {};
  user.subscribe((value) => {
    userData = value;
  });
  const unsubscribe = user.subscribe((value) => {
    userData = value;
  });
  onDestroy(unsubscribe);
  function getStratById() {
    fetch(import.meta.env.VITE_API + "/strat/" + stratId, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        strat = data;
        if (userData._id) {
          if (strat.upVoters.includes(userData._id)) {
            voteState = 1;
          } else if (strat.downVoters.includes(userData._id)) {
            voteState = 2;
          } else {
            voteState = 0;
          }
        }
      });    
  }
  function roll() {
    fetch(import.meta.env.VITE_API + "/strat/roll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name == title) {
          roll();
        }
        title = data.name;
        description = data.description;
        stratId = data._id;
        strat = data;
        voteState = 0;
        console.log(userData)
        if (strat.downVoters && userData) {
          if (strat.downVoters.includes(userData.id)) {
            voteState = 2;
          }
        } 
        if (strat.upVoters && userData) {
          if (strat.upVoters.includes(userData.id)) {
            voteState = 1;
          }
        }
      });
  }
  onMount(async () => {
    roll();
    if (strat.downVoters && userData) {
      if (strat.downVoters.includes(userData.id)) {
        voteState = 2;
      }
    } else if (strat.upVoters && userData) {
      if (strat.upVoters.includes(userData.id)) {
        voteState = 1;
      }
    }
  });
  function onVote() {
      getStratById()
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<div class="centered-box">
  <div class="p-6 box wideme">
    <h1 class="title">{title}</h1>
    <h2 class="subtitle">{@html description}</h2>
    <div class="votes my-3">
      <VoteButton
        on:vote={onVote}
        {stratId}
        hasVoted={voteState == 1}
        voteStyle={true}
        number={strat.upvotes}
      />
      <VoteButton
        on:vote={onVote}
        {stratId}
        hasVoted={voteState == 2}
        voteStyle={false}
        number={strat.downvotes}
      />
    </div>
    <button
      on:click={() => {
        roll();
      }}
      class="button is-primary">Roll</button
    >
  </div>
</div>
<Networks />
