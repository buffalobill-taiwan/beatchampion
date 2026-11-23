const colorOrder = 'WUBRGZCL';
const storageKey = 'beatchampion:solved:v1';

answers.sort((first, second) =>
  colorOrder.indexOf(first.code[0]) - colorOrder.indexOf(second.code[0]) ||
  first.code.slice(1).localeCompare(second.code.slice(1), 'en', { numeric: true }),
);

const form = document.querySelector('#guess-form');
const guess = document.querySelector('#guess');
const progress = document.querySelector('#progress');
const guessPanel = document.querySelector('.guess-panel');
const feedback = document.querySelector('#feedback');
const answerTable = document.querySelector('#answers');
const answerBody = document.querySelector('#answers tbody');
const resetProgress = document.querySelector('#reset-progress');
const cardSuggestions = document.querySelector('#card-suggestions');

let suggestionTimer;
let suggestionRequest;
let activeSuggestion = -1;
let lastSuggestions = [];

function cancelSuggestionLookup() {
  clearTimeout(suggestionTimer);
  suggestionRequest?.abort();
}

function showSuggestions(names) {
  const previous = Array.from(cardSuggestions.children);
  const selected = previous[activeSuggestion];
  const byName = new Map(previous.map((option) => [option.textContent, option]));
  const options = names.map((name, index) => {
    const option = byName.get(name) ?? document.createElement('li');
    option.id = `card-option-${index}`;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', String(option === selected));
    option.textContent = name;
    return option;
  });

  if (options.length !== previous.length || options.some((option, index) => option !== previous[index])) {
    const scrollTop = cardSuggestions.scrollTop;
    cardSuggestions.replaceChildren(...options);
    cardSuggestions.scrollTop = scrollTop;
  }

  activeSuggestion = options.indexOf(selected);
  if (activeSuggestion >= 0) {
    guess.setAttribute('aria-activedescendant', selected.id);
  } else {
    guess.removeAttribute('aria-activedescendant');
  }
  cardSuggestions.hidden = options.length === 0;
  guess.setAttribute('aria-expanded', String(!cardSuggestions.hidden));
}

function clearSuggestions() {
  cancelSuggestionLookup();
  lastSuggestions = [];
  showSuggestions([]);
}

guess.addEventListener('input', (event) => {
  const query = guess.value.trim();
  cancelSuggestionLookup();
  if (event.isComposing || query.length < 2) {
    showSuggestions([]);
    return;
  }

  const searchText = query.toLowerCase();
  showSuggestions(lastSuggestions.filter((name) => name.toLowerCase().includes(searchText)));

  suggestionTimer = setTimeout(async () => {
    const request = new AbortController();
    suggestionRequest = request;
    const url = new URL('https://api.scryfall.com/cards/autocomplete');
    url.searchParams.set('q', query);

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: request.signal,
      });
      if (!response.ok) return;

      const { data } = await response.json();
      if (request.signal.aborted || !Array.isArray(data)) return;

      lastSuggestions = data;
      showSuggestions(data);
    } catch {
      // Manual entry remains available if suggestions cannot be loaded.
    } finally {
      if (suggestionRequest === request) suggestionRequest = undefined;
    }
  }, 300);
});

function submitSuggestion(option) {
  guess.value = option.textContent;
  form.requestSubmit();
}

cardSuggestions.addEventListener('mousedown', (event) => event.preventDefault());
cardSuggestions.addEventListener('click', (event) => {
  const option = event.target.closest('[role="option"]');
  if (option) submitSuggestion(option);
});
guess.addEventListener('blur', clearSuggestions);

guess.addEventListener('keydown', (event) => {
  if (event.isComposing) return;

  if (event.key === 'Escape') {
    if (!cardSuggestions.hidden) event.preventDefault();
    clearSuggestions();
    return;
  }

  const options = cardSuggestions.children;
  if (options.length === 0) return;

  if (event.key === 'Enter' && activeSuggestion >= 0) {
    event.preventDefault();
    submitSuggestion(options[activeSuggestion]);
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    options[activeSuggestion]?.setAttribute('aria-selected', 'false');
    activeSuggestion = event.key === 'ArrowDown'
      ? (activeSuggestion + 1) % options.length
      : (activeSuggestion <= 0 ? options.length - 1 : activeSuggestion - 1);
    const option = options[activeSuggestion];
    option.setAttribute('aria-selected', 'true');
    guess.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
  }
});

const rows = answers.map(({ code, hashes }) => {
  const row = answerBody.insertRow();
  row.dataset.cardColor = code[0];
  row.insertCell().textContent = code;
  const status = document.createElement('span');
  status.setAttribute('role', 'img');
  row.insertCell().append(status);
  const name = row.insertCell();
  const wordLengths = code.match(/\d+/g);
  const mask = wordLengths.map((length) => '*'.repeat(Number(length))).join(' ');
  return { id: hashes[0], row, status, name, mask, revealFrame: null };
});

const lowercaseTitleWords = new Set(
  'a an the and but or nor as at by for from in of on per to via with'.split(' '),
);

function formatCardName(name) {
  if (/\p{L}/u.test(name.replace(/\p{Script=Latin}/gu, ''))) return name;

  return name.split('//').map((face) => {
    let isFirstWord = true;
    return face.toLowerCase().replace(/\p{L}[\p{L}\p{M}]*(?:['’][\p{L}\p{M}]+)*/gu, (word) => {
      const capitalize = isFirstWord || !lowercaseTitleWords.has(word);
      isFirstWord = false;
      return capitalize ? word.replace(/^\p{L}/u, (letter) => letter.toUpperCase()) : word;
    });
  }).join('//');
}

const solved = new Map();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  for (const { id } of rows) {
    if (typeof saved?.[id] === 'string' && saved[id].trim()) {
      solved.set(id, formatCardName(saved[id]));
    }
  }
} catch {
  // The puzzle is playable when saved progress is unavailable.
}

function updateProgress() {
  progress.textContent = `${solved.size} of ${answers.length} answers found`;
  resetProgress.hidden = solved.size === 0;
  for (const { id, status, name, mask, revealFrame } of rows) {
    const isSolved = solved.has(id);
    status.textContent = isSolved ? '✅' : '❔';
    status.setAttribute('aria-label', isSolved ? 'Solved' : 'Unsolved');
    if (revealFrame === null) name.textContent = solved.get(id) ?? mask;
  }
}

function revealAnswer(entry, answerName) {
  const { row, name, mask } = entry;
  const { top, bottom } = row.getBoundingClientRect();
  const viewport = window.visualViewport;
  const viewportTop = viewport?.offsetTop ?? 0;
  const visibleTop = Math.max(viewportTop, guessPanel.getBoundingClientRect().bottom);
  const visibleBottom = viewportTop + (viewport?.height ?? window.innerHeight);

  const duration = 750;
  const revealDelay = 100;
  const characters = Array.from(answerName);
  let startedAt;
  name.textContent = mask;

  function startReveal(now) {
    startedAt = now;
    row.classList.add('answer-reveal');
    entry.revealFrame = requestAnimationFrame(revealNextFrame);
  }

  function revealNextFrame(now) {
    const elapsed = now - startedAt;
    if (elapsed >= duration) {
      name.textContent = answerName;
      row.classList.remove('answer-reveal');
      entry.revealFrame = null;
      return;
    }

    const revealed = Math.floor(
      characters.length * Math.max(0, elapsed - revealDelay) / (duration - revealDelay),
    );
    name.textContent = characters.slice(0, revealed).join('') + mask.slice(revealed);
    entry.revealFrame = requestAnimationFrame(revealNextFrame);
  }

  if (top >= visibleTop && bottom <= visibleBottom) {
    startReveal(performance.now());
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTarget = Math.max(0, Math.min(maxScroll, window.scrollY + top - visibleTop - 8));
  const scrollDeadline = performance.now() + 1000;
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

  function waitForScroll(now) {
    if (Math.abs(window.scrollY - scrollTarget) <= 1) {
      startReveal(now);
      return;
    }

    if (now >= scrollDeadline) {
      window.scrollTo({ top: scrollTarget, behavior: 'instant' });
      startReveal(now);
      return;
    }

    entry.revealFrame = requestAnimationFrame(waitForScroll);
  }

  entry.revealFrame = requestAnimationFrame(waitForScroll);
}

async function hashName(name) {
  const normalized = name.normalize('NFKC').trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

if (answers.length > 0) {
  form.hidden = false;
  answerTable.hidden = false;
  updateProgress();
}

resetProgress.addEventListener('click', () => {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    feedback.textContent = 'Unable to reset saved progress.';
    return;
  }
  solved.clear();
  for (const entry of rows) {
    if (entry.revealFrame === null) continue;
    cancelAnimationFrame(entry.revealFrame);
    entry.revealFrame = null;
    entry.row.classList.remove('answer-reveal');
  }
  guess.value = '';
  clearSuggestions();
  updateProgress();
  feedback.textContent = 'Progress reset.';
  guess.focus();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (form.hidden || guess.readOnly) return;
  clearSuggestions();

  const name = guess.value.trim();
  if (!name) {
    feedback.textContent = 'Enter a card name.';
    return;
  }

  if (!globalThis.crypto?.subtle) {
    feedback.textContent = 'Open the game over HTTPS to check your answer.';
    return;
  }

  guess.readOnly = true;
  resetProgress.disabled = true;
  try {
    const hash = await hashName(name);
    const answer = answers.find(({ hashes }) => hashes.includes(hash));

    if (!answer) {
      feedback.textContent = 'That card is not an answer.';
      guess.select();
      return;
    }

    const id = answer.hashes[0];
    if (solved.has(id)) {
      feedback.textContent = 'You already found that answer.';
      guess.select();
      return;
    }

    const displayName = formatCardName(name);
    solved.set(id, displayName);
    guess.value = '';
    revealAnswer(rows.find((entry) => entry.id === id), displayName);
    updateProgress();
    feedback.textContent = solved.size === answers.length
      ? 'You found every answer!'
      : 'Correct!';
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(solved)));
    } catch {
      feedback.textContent += ' Progress could not be saved.';
    }
  } catch {
    feedback.textContent = 'Unable to check your answer. Try again.';
  } finally {
    guess.readOnly = false;
    resetProgress.disabled = false;
  }
});
