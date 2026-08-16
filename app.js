"use strict";

const LETTER_WIDTH = 50;
const LETTER_GAP = 6;

const punctuation = [".", ",", "!", "?", ":", ";", "…", "—", "-", "\"", "'", "”", "„"];

const digraphs = {
  sz: "szy",
  cz: "czy",
  rz: "rzy",
  ch: "hy"
};

const phoneticMaps = {
  standard: {},
  phonetic: {
    A: "a", Ą: "ą", B: "by", C: "cy", Ć: "ci", D: "dy", E: "e", Ę: "ę",
    F: "fy", G: "gy", H: "hy", I: "i", J: "ji", K: "ky", L: "ly", Ł: "ły",
    M: "my", N: "ny", Ń: "ni", O: "o", Ó: "u", P: "py", Q: "ky", R: "ry",
    S: "sy", Ś: "si", T: "ty", U: "u", V: "wy", W: "wy", X: "ksy", Y: "igrek",
    Z: "zy", Ż: "ży", Ź: "źi"
  }
};

const specialSyllables = { zi: "źi", ci: "ći", si: "śi", ni: "ńi" };
const vowels = ["a", "ą", "e", "ę", "i", "o", "ó", "u", "y"];
const prefixes = ["przed", "prze", "przy", "pod", "nad", "roz", "bez", "wy", "za", "na", "od", "ob", "u"];
const validOnsets = [
  "p", "b", "t", "d", "k", "g", "f", "w", "s", "z", "m", "n", "l", "r",
  "sz", "cz", "rz", "ch", "pl", "bl", "kl", "gl", "fl", "wl", "pr", "br",
  "tr", "dr", "kr", "gr", "fr", "wr", "sm", "sn", "zm", "zn", "mn"
];

let voices = [];
let sentences = [];
let currentIndex = 0;

const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const phoneticMode = document.getElementById("phoneticMode");
const wordsContainer = document.getElementById("wordsContainer");
const sentenceCounter = document.getElementById("sentenceCounter");
const liveStatus = document.getElementById("liveStatus");

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = window.speechSynthesis.getVoices();
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
} else {
  liveStatus.textContent = "Ta przeglądarka nie obsługuje syntezy mowy.";
}

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    const value = String(event.target.result || "");
    textInput.value = value;
    processText(value);
  };
  reader.readAsText(file, "UTF-8");
});

document.getElementById("loadTextButton").addEventListener("click", () => {
  const text = textInput.value.trim();
  if (!text) {
    liveStatus.textContent = "Najpierw wpisz tekst lub wybierz plik tekstowy.";
    textInput.focus();
    return;
  }
  processText(text);
});

document.getElementById("loadExampleButton").addEventListener("click", () => {
  const sample = "Ala ma kota. Kot siedzi na kanapie i patrzy przez okno. Potem Ala czyta mu krótką książkę.";
  textInput.value = sample;
  processText(sample);
});

document.getElementById("clearTextButton").addEventListener("click", () => {
  textInput.value = "";
  fileInput.value = "";
  sentences = [];
  currentIndex = 0;
  showSentence();
  liveStatus.textContent = "Tekst został wyczyszczony.";
});

document.getElementById("prevButton").addEventListener("click", prevSentence);
document.getElementById("nextButton").addEventListener("click", nextSentence);
document.getElementById("speakSentenceButton").addEventListener("click", speakSentence);
phoneticMode.addEventListener("change", showSentence);

function processText(text) {
  sentences = text
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]?/g) || [];

  sentences = sentences.map(sentence => sentence.trim()).filter(Boolean);
  currentIndex = 0;
  showSentence();

  liveStatus.textContent = sentences.length
    ? `Tekst podzielono na ${sentences.length} ${pluralizeSentence(sentences.length)}.`
    : "Nie udało się znaleźć zdań w podanym tekście.";
}

function pluralizeSentence(count) {
  if (count === 1) return "zdanie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zdania";
  return "zdań";
}

function splitIntoUnits(word) {
  const units = [];
  let i = 0;
  const lower = word.toLowerCase();

  while (i < word.length) {
    if (punctuation.includes(word[i])) {
      units.push(word[i]);
      i += 1;
      continue;
    }

    const pair = lower[i] + (lower[i + 1] || "");

    if (digraphs[pair]) {
      units.push(word.slice(i, i + 2));
      i += 2;
      continue;
    }

    if (["ci", "si", "zi", "ni"].includes(pair) && vowels.includes(lower[i + 2] || "")) {
      units.push(word.slice(i, i + 2));
      i += 2;
      continue;
    }

    if (["au", "eu"].includes(pair)) {
      units.push(word.slice(i, i + 2));
      i += 2;
      continue;
    }

    units.push(word[i]);
    i += 1;
  }

  return units;
}

function syllabify(word) {
  const lower = word.toLowerCase();

  for (const pref of prefixes) {
    if (lower.startsWith(pref) && lower.length > pref.length + 1) {
      const rest = word.slice(pref.length);
      return [word.slice(0, pref.length), ...syllabify(rest)];
    }
  }

  const units = splitIntoUnits(word);
  const unitsLower = units.map(unit => unit.toLowerCase());
  const vowelIdx = [];

  for (let i = 0; i < unitsLower.length; i += 1) {
    if (vowels.includes(unitsLower[i])) vowelIdx.push(i);
  }

  if (vowelIdx.length <= 1) return [word];

  const syllables = [];
  let start = 0;

  for (let v = 0; v < vowelIdx.length - 1; v += 1) {
    const v1 = vowelIdx[v];
    const v2 = vowelIdx[v + 1];

    if (v2 === v1 + 1) continue;

    const between = unitsLower.slice(v1 + 1, v2);
    let cut = 0;

    if (between.length === 1) {
      cut = 0;
    } else if (between.length === 2) {
      cut = validOnsets.includes(between[1]) ? 1 : 0;
    } else if (between.length >= 3) {
      const last2 = between.slice(-2).join("");
      if (between[between.length - 2] === between[between.length - 1]) {
        cut = between.length - 1;
      } else if (validOnsets.includes(last2)) {
        cut = between.length - 2;
      } else {
        cut = between.length - 1;
      }
    }

    const end = v1 + 1 + cut;
    syllables.push(units.slice(start, end).join(""));
    start = end;
  }

  syllables.push(units.slice(start).join(""));
  return syllables;
}

function applyPhoneticMap(unit) {
  const map = phoneticMaps[phoneticMode.value];
  const lower = unit.toLowerCase();
  const upper = unit.toUpperCase();

  return specialSyllables[lower] || digraphs[lower] || map[upper] || lower;
}

function createUtterance(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pl-PL";
  const polishVoice = voices.find(voice => voice.lang?.toLowerCase().startsWith("pl"));
  if (polishVoice) utterance.voice = polishVoice;
  return utterance;
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    liveStatus.textContent = "Ta przeglądarka nie obsługuje syntezy mowy.";
    return;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(createUtterance(text));
}

function speakUnit(unit) {
  if (punctuation.includes(unit)) return;
  speakText(applyPhoneticMap(unit));
}

function speakWord(word) {
  const cleanWord = word.replace(/[.,!?:;…—"”„']/g, "");
  if (cleanWord) speakText(cleanWord);
}

function speakSentence() {
  if (!sentences.length) return;
  speakText(sentences[currentIndex]);
}

function showSentence() {
  wordsContainer.innerHTML = "";

  if (!sentences.length) {
    wordsContainer.innerHTML = '<p class="empty-state">Tutaj pojawi się rozłożone zdanie. Wpisz tekst powyżej albo użyj przykładu.</p>';
    sentenceCounter.textContent = "Brak wczytanego tekstu";
    updateNavButtons();
    return;
  }

  const sentence = sentences[currentIndex].trim();
  const rawWords = sentence.split(/\s+/);

  rawWords.forEach(raw => {
    if (!raw) return;

    const block = document.createElement("div");
    block.className = "word-block";

    const syllables = syllabify(raw);
    const allUnits = syllables.flatMap(syllable => splitIntoUnits(syllable));
    const totalUnits = allUnits.length;

    const playDiv = document.createElement("div");
    playDiv.className = "word-play";

    const playButton = document.createElement("button");
    const wordWidth = totalUnits * LETTER_WIDTH + Math.max(0, totalUnits - 1) * LETTER_GAP;
    playButton.style.width = `${wordWidth}px`;
    playButton.type = "button";
    playButton.setAttribute("aria-label", `Odczytaj wyraz ${raw}`);
    playButton.title = `Odczytaj wyraz: ${raw}`;
    playButton.addEventListener("click", () => speakWord(raw));

    playDiv.appendChild(playButton);
    block.appendChild(playDiv);

    const lettersDiv = document.createElement("div");
    lettersDiv.className = "letters-row";

    syllables.forEach((syllable, syllableIndex) => {
      const units = splitIntoUnits(syllable);
      const color = punctuation.includes(syllable) ? "black" : (syllableIndex % 2 === 0 ? "#c93030" : "#111827");

      units.forEach(unit => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = unit;
        button.style.color = punctuation.includes(unit) ? "#111827" : color;
        button.setAttribute("aria-label", punctuation.includes(unit) ? `Znak ${unit}` : `Odczytaj ${unit}`);
        if (!punctuation.includes(unit)) button.addEventListener("click", () => speakUnit(unit));
        lettersDiv.appendChild(button);
      });
    });

    block.appendChild(lettersDiv);

    const syllablesDiv = document.createElement("div");
    syllablesDiv.className = "syl-row";

    syllables.forEach((syllable, index) => {
      const units = splitIntoUnits(syllable);
      const unitCount = punctuation.includes(syllable) ? 1 : units.length;
      const syllableWidth = unitCount * LETTER_WIDTH + Math.max(0, unitCount - 1) * LETTER_GAP;

      const button = document.createElement("button");
      button.type = "button";
      button.style.width = `${syllableWidth}px`;
      button.style.background = punctuation.includes(syllable)
        ? "#7b8794"
        : (index % 2 === 0 ? "#c93030" : "#111827");
      button.setAttribute("aria-label", punctuation.includes(syllable) ? `Znak ${syllable}` : `Odczytaj sylabę ${syllable}`);
      button.title = punctuation.includes(syllable) ? "" : `Odczytaj sylabę: ${syllable}`;
      if (!punctuation.includes(syllable)) button.addEventListener("click", () => speakUnit(syllable));
      syllablesDiv.appendChild(button);
    });

    block.appendChild(syllablesDiv);
    wordsContainer.appendChild(block);
  });

  sentenceCounter.textContent = `Zdanie ${currentIndex + 1} z ${sentences.length}`;
  updateNavButtons();
}

function updateNavButtons() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const speakSentenceButton = document.getElementById("speakSentenceButton");

  prevButton.disabled = !sentences.length || currentIndex <= 0;
  nextButton.disabled = !sentences.length || currentIndex >= sentences.length - 1;
  speakSentenceButton.disabled = !sentences.length;
}

function nextSentence() {
  if (currentIndex < sentences.length - 1) {
    currentIndex += 1;
    showSentence();
  }
}

function prevSentence() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    showSentence();
  }
}

showSentence();

function readTransferredText() {
  let importedText = "";

  try {
    importedText = sessionStorage.getItem("naukaCzytaniaText") || "";
    if (importedText) sessionStorage.removeItem("naukaCzytaniaText");
  } catch (_) {}

  if (!importedText) {
    try {
      importedText = localStorage.getItem("naukaCzytaniaText") || "";
    } catch (_) {}
  }

  // localStorage is only a one-shot fallback, so remove it after the read.
  try {
    localStorage.removeItem("naukaCzytaniaText");
  } catch (_) {}

  return importedText.trim();
}

function loadImportedText(text) {
  const cleanText = String(text || "").trim().replace(/\s+/g, " ");
  if (!cleanText) return false;

  textInput.value = cleanText;
  processText(cleanText);
  liveStatus.textContent = `Czytanka została wczytana. ${liveStatus.textContent}`;

  setTimeout(() => {
    document.getElementById("czytnik")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
  return true;
}

async function recoverStoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const storyFile = params.get("czytanka") || "";

  // Only local reading pages are accepted as a source.
  if (!/^czytanka-[a-z0-9-]+\.html$/i.test(storyFile)) return false;

  try {
    const response = await fetch(storyFile, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const source = parsed.getElementById("readerText");
    const text = source ? source.textContent.trim().replace(/\s+/g, " ") : "";

    if (!text) throw new Error("Brak tekstu czytanki");
    return loadImportedText(text);
  } catch (error) {
    console.error("Nie udało się wczytać czytanki:", error);
    liveStatus.textContent = "Nie udało się automatycznie przenieść czytanki. Wróć do czytanki i spróbuj ponownie.";
    return false;
  }
}

const importedText = readTransferredText();
if (!loadImportedText(importedText)) {
  recoverStoryFromUrl();
}
