// The code gives the color and word lengths. The first hash identifies the answer in saved progress.
const answers = [
  { code: 'W6_5', hashes: ['bb5343c06955118bcdae9109f2b7d8a45a9b305c1ae85925132d93432c9528a8'] },
  { code: 'U10_6', hashes: ['c058d34d312bf86fe3ce2f8fa6dc8e93c37d0ad09cdbbb9279e754ab3a36d206'] },
];

const colorOrder = 'WUBRGZCL';
const storageKey = 'beatchampion:solved:v1';

answers.sort((first, second) =>
  colorOrder.indexOf(first.code[0]) - colorOrder.indexOf(second.code[0]) ||
  first.code.slice(1).localeCompare(second.code.slice(1), 'en', { numeric: true }),
);

const form = document.querySelector('#guess-form');
const guess = document.querySelector('#guess');
const progress = document.querySelector('#progress');
const feedback = document.querySelector('#feedback');
const answerTable = document.querySelector('#answers');
const answerBody = document.querySelector('#answers tbody');
const resetProgress = document.querySelector('#reset-progress');
const cardSuggestions = document.querySelector('#card-suggestions');

let suggestionTimer;
let suggestionRequest;

function clearSuggestions() {
  clearTimeout(suggestionTimer);
  suggestionRequest?.abort();
  cardSuggestions.replaceChildren();
}

guess.addEventListener('input', (event) => {
  const query = guess.value.trim();
  const selectedSuggestion = Array.from(cardSuggestions.options).some(
    (option) => option.value === guess.value,
  );
  clearSuggestions();
  if (event.isComposing || selectedSuggestion || query.length < 2) return;

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

      const options = data.map((name) => {
        const option = document.createElement('option');
        option.value = name;
        return option;
      });
      cardSuggestions.replaceChildren(...options);
    } catch {
      // Manual entry remains available if suggestions cannot be loaded.
    } finally {
      if (suggestionRequest === request) suggestionRequest = undefined;
    }
  }, 300);
});

const rows = answers.map(({ code, hashes }) => {
  const row = answerBody.insertRow();
  row.dataset.cardColor = code[0];
  row.insertCell().textContent = code;
  const status = document.createElement('span');
  status.setAttribute('role', 'img');
  row.insertCell().append(status);
  const name = row.insertCell();
  const mask = code.slice(1).split('_').map((length) => '*'.repeat(Number(length))).join(' ');
  return { id: hashes[0], status, name, mask };
});

const solved = new Map();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  for (const { id } of rows) {
    if (typeof saved?.[id] === 'string' && saved[id].trim()) {
      solved.set(id, saved[id]);
    }
  }
} catch {
  // The puzzle is playable when saved progress is unavailable.
}

function updateProgress() {
  progress.textContent = `${solved.size} of ${answers.length} answers found`;
  resetProgress.disabled = solved.size === 0 || guess.readOnly;
  for (const { id, status, name, mask } of rows) {
    const isSolved = solved.has(id);
    status.textContent = isSolved ? '✅' : '❔';
    status.setAttribute('aria-label', isSolved ? 'Solved' : 'Unsolved');
    name.textContent = solved.get(id) ?? mask;
  }
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
  resetProgress.hidden = false;
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

    solved.set(id, name);
    guess.value = '';
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
    resetProgress.disabled = solved.size === 0;
  }
});
