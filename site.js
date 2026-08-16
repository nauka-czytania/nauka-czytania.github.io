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

  document.addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      speak(speakButton.getAttribute("data-speak"));
      return;
    }

    const readerButton = event.target.closest(".send-to-reader");
    if (readerButton) {
      const source = document.getElementById("readerText");
      const text = source ? source.textContent.trim().replace(/\s+/g, " ") : "";
      if (text) sessionStorage.setItem("naukaCzytaniaText", text);
      window.location.href = readerButton.getAttribute("data-reader-url") || "index.html#czytnik";
    }
  });
})();
