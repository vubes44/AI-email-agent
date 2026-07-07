import { checkLatestEmail } from "./emailWatcher.js";

export function startEmailWatcher() {
  console.log("📬 Email Watcher uruchomiony");

  setInterval(async () => {
    try {
      await checkLatestEmail();
    } catch (err) {
      console.error("Watcher:", err);
    }
  }, 10000);
}
