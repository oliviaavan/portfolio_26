// Client-side gate for the Trimble case study.
// NOTE: this is a soft gate, not real access control — the password lives in
// the client. It only keeps casual visitors from stumbling onto NDA content.
(() => {
  const PASSWORD = "Trimble2026";
  const STORAGE_KEY = "trimble:unlocked";

  const gate = document.getElementById("trimble-gate");
  if (!gate) return;

  const locked = gate.querySelector('[data-gate="locked"]');
  const unlocked = gate.querySelector('[data-gate="unlocked"]');
  const form = document.getElementById("trimble-unlock");
  const input = document.getElementById("trimble-pw");
  const error = document.getElementById("trimble-error");

  const reveal = () => {
    locked.hidden = true;
    unlocked.hidden = false;
  };

  if (sessionStorage.getItem(STORAGE_KEY) === "1") {
    reveal();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      error.textContent = "";
      reveal();
    } else {
      error.textContent = "Incorrect password. Try again or email me for access.";
      input.value = "";
      input.focus();
    }
  });
})();
