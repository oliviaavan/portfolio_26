// Client-side gate for the Trimble case study.
// NOTE: this is a soft gate, not real access control — the password lives in
// the client. It only keeps casual visitors from stumbling onto NDA content.
(() => {
  const PASSWORD = "Trimble2026";

  const gate = document.getElementById("trimble-gate");
  if (!gate) return;

  // Always start locked — clear any prior unlock state from older versions.
  try {
    sessionStorage.removeItem("trimble:unlocked");
    localStorage.removeItem("trimble:unlocked");
  } catch (_) {}

  const locked = gate.querySelector('[data-gate="locked"]');
  const unlocked = gate.querySelector('[data-gate="unlocked"]');
  const form = document.getElementById("trimble-unlock");
  const input = document.getElementById("trimble-pw");
  const error = document.getElementById("trimble-error");

  const reveal = () => {
    locked.hidden = true;
    unlocked.hidden = false;
    // Drop the NDA card framing so the project cards shift up flush.
    gate.classList.add("is-unlocked");
    // Persist unlock so the gated project pages don't bounce back here.
    try {
      sessionStorage.setItem("trimble:unlocked", "1");
    } catch (_) {}
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === PASSWORD) {
      error.textContent = "";
      reveal();
    } else {
      error.textContent = "Incorrect password. Try again or email me for access.";
      input.value = "";
      input.focus();
    }
  });
})();
