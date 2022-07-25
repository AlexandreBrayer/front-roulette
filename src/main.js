import "./app.scss";
import "./selector.scss";
import App from "./App.svelte";

const app = new App({
    target: document.getElementById("app"),
});

export default app;