(function () {
  const introPanel = document.getElementById("intro-panel");
  const moodPanel = document.getElementById("mood-panel");
  const responsePanel = document.getElementById("response-panel");
  const introContinue = document.getElementById("intro-continue");
  const introTap = document.getElementById("intro-tap");
  const introTapHint = document.getElementById("intro-tap-hint");
  const responseCopy = document.getElementById("response-copy");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const shuffleLine = document.getElementById("shuffle-line");
  const pickAnotherBtn = document.getElementById("pick-another-btn");
  const whyBtn = document.getElementById("why-btn");
  const whyBackdrop = document.getElementById("why-backdrop");
  const whyDialog = document.getElementById("why-dialog");
  const whyClose = document.getElementById("why-close");
  const flowDots = document.getElementById("flow-dots");
  const bgOrbs = document.getElementById("bg-orbs");

  const responses = {
    bored: ["ok noted", "go do something fun", "or... talk to me maybe 😶"],
    tired: ["rest dulu", "don't push too hard", "seriously"],
    good: ["nice", "keep that energy"],
    idk: ["fair enough", "same sometimes"],
  };

  const shufflePool = [
    "drink some water first",
    "play your favorite song",
    "stop overthinking for a sec",
    "text someone you like 😶",
    "go outside, even just a bit",
    "scroll less, live more",
    "take a deep breath",
    "do nothing for 5 minutes, it's okay",
    "lowkey... i think you're interesting",
    "maybe talk to me instead 😎",
  ];

  const tapQuips = [
    "nice—you're actually here.",
    "cool. logged that in my imaginary notebook.",
    "thanks for tapping lol",
    "slowing down is totally allowed.",
    "valid. take your time.",
  ];

  const HIDE_MS = 420;

  function setFlowStep(step) {
    if (!flowDots) return;
    flowDots.querySelectorAll(".dot").forEach((dot) => {
      dot.classList.toggle("is-active", dot.dataset.step === step);
    });
  }

  function replayPanelEnter(panel) {
    panel.classList.remove("is-showing");
    void panel.offsetWidth;
    panel.classList.add("is-showing");
  }

  function hidePanel(panel, done) {
    panel.classList.add("is-hiding");
    window.setTimeout(() => {
      panel.hidden = true;
      panel.classList.remove("is-hiding");
      done?.();
    }, HIDE_MS);
  }

  function showPanel(panel) {
    panel.hidden = false;
    replayPanelEnter(panel);
  }

  function transitionPanels(from, to) {
    hidePanel(from, () => {
      showPanel(to);
    });
  }

  function renderResponseLines(lines) {
    responseCopy.innerHTML = lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
    replayResponseLinesAnimation();
  }

  function replayResponseLinesAnimation() {
    const ps = responseCopy.querySelectorAll("p");
    ps.forEach((p) => {
      p.style.animation = "none";
      void p.offsetWidth;
      p.style.animation = "";
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showShuffleMessage(text) {
    shuffleLine.classList.add("is-fading");
    window.setTimeout(() => {
      shuffleLine.textContent = text;
      shuffleLine.classList.remove("is-fading");
    }, 180);
  }

  function openWhy() {
    whyBackdrop.hidden = false;
    whyDialog.hidden = false;
    requestAnimationFrame(() => {
      whyBackdrop.classList.add("is-open");
      whyDialog.classList.add("is-open");
    });
    whyClose.focus();
  }

  function closeWhy() {
    whyBackdrop.classList.remove("is-open");
    whyDialog.classList.remove("is-open");
    window.setTimeout(() => {
      whyBackdrop.hidden = true;
      whyDialog.hidden = true;
    }, 350);
    whyBtn.focus();
  }

  introContinue.addEventListener("click", () => {
    setFlowStep("mood");
    transitionPanels(introPanel, moodPanel);
  });

  introTap.addEventListener("click", () => {
    const msg = pickRandom(tapQuips);
    introTapHint.hidden = false;
    introTapHint.textContent = msg;
    introTap.classList.add("is-pinged");
  });

  document.querySelectorAll(".btn-mood").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood;
      const lines = responses[mood];
      if (!lines) return;

      setFlowStep("response");
      hidePanel(moodPanel, () => {
        renderResponseLines(lines);
        shuffleLine.textContent = "";
        showPanel(responsePanel);
      });
    });
  });

  pickAnotherBtn.addEventListener("click", () => {
    setFlowStep("mood");
    hidePanel(responsePanel, () => {
      shuffleLine.textContent = "";
      showPanel(moodPanel);
    });
  });

  shuffleBtn.addEventListener("click", () => {
    showShuffleMessage(pickRandom(shufflePool));
  });

  whyBtn.addEventListener("click", openWhy);
  whyClose.addEventListener("click", closeWhy);
  whyBackdrop.addEventListener("click", closeWhy);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && whyDialog.classList.contains("is-open")) {
      closeWhy();
    }
  });

  /* subtle background drift with pointer — whole layer moves so orb keyframes keep working */
  let parallaxTicking = false;
  let lastX = 0.5;
  let lastY = 0.5;

  function applyParallax() {
    parallaxTicking = false;
    if (!bgOrbs) return;
    const nx = (lastX - 0.5) * 2;
    const ny = (lastY - 0.5) * 2;
    bgOrbs.style.transform = `translate3d(${nx * 14}px, ${ny * 10}px, 0)`;
  }

  document.addEventListener("pointermove", (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lastX = e.clientX / window.innerWidth;
    lastY = e.clientY / window.innerHeight;
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(applyParallax);
    }
  });
})();
