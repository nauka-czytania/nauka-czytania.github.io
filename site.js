"use strict";
(function () {
  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    const voices = window.speechSynthesis.getVoices();
    const polish = voices.find(v => (v.lang || "").toLowerCase().startsWith("pl"));
    if (polish) utterance.voice = polish;
    window.speechSynthesis.speak(utterance);
  }

  function saveReaderText(text) {
    if (!text) return;

    // sessionStorage is the preferred, short-lived transfer mechanism.
    try {
      sessionStorage.setItem("naukaCzytaniaText", text);
    } catch (_) {}

    // Some browser/privacy configurations can behave differently during
    // navigation, so localStorage is used as a one-shot fallback.
    try {
      localStorage.setItem("naukaCzytaniaText", text);
    } catch (_) {}
  }

  function getCurrentStoryFile() {
    const fileName = window.location.pathname.split("/").pop() || "";
    return /^czytanka-[a-z0-9-]+\.html$/i.test(fileName) ? fileName : "";
  }

  document.addEventListener("click", (event) => {
    const readerButton = event.target.closest(".send-to-reader");
    if (readerButton) {
      const source = document.getElementById("readerText");
      const text = source ? source.textContent.trim().replace(/\s+/g, " ") : "";
      saveReaderText(text);

      // In addition to browser storage, pass the source page name in the URL.
      // index.html can then recover the story directly if storage is unavailable.
      const target = new URL(
        readerButton.getAttribute("data-reader-url") || "index.html#czytnik",
        window.location.href
      );
      const storyFile = getCurrentStoryFile();
      if (storyFile) target.searchParams.set("czytanka", storyFile);
      window.location.href = target.href;
      return;
    }

    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      speak(speakButton.getAttribute("data-speak"));
    }
  });
})();
