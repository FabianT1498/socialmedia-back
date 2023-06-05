import { app } from "./app";

const port = 3000;

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Exiting...");
  process.exit();
});
