# Beat Sun’s Champion!

Beat Sun’s Champion! is a Magic: The Gathering Three Card Blind (3CB) puzzle.
Find a third card that, alongside two copies of Black Lotus, beats two copies
of Black Lotus and Elspeth, Sun’s Champion both on the play and on the draw.
[Play on GitHub Pages](https://buffalobill-taiwan.github.io/beatchampion/)

## How to play

Enter a card name and press **Check**, or select a Scryfall suggestion to check
it immediately. Each answer accepts its English name and any Traditional Chinese
or Japanese names included in the puzzle. Your browser saves solved answers in
local storage. Use **Reset progress** to start over.

The [Rules](rule.html) show the two decks. The [Notes](note.html) explain the
answer list and why several common guesses fail.

## Maintain the answer list

Each entry in [answers.js](answers.js) contains a `code` and a `hashes` array.

- Start the code with `C` (colorless), `W` (white), `U` (blue), `B` (black),
  `R` (red), `G` (green), `Z` (multicolor), `A` (artifact), or `L` (land).
- Append the word lengths from the English name, separated by underscores.
  Count punctuation as part of the word. Use a suffix such as `b` to distinguish
  entries with the same code.
- For each accepted name, apply Unicode NFKC normalization, trim leading and
  trailing whitespace, and convert to lowercase. Encode the result as UTF-8 and
  store its SHA-256 digest as lowercase hexadecimal. Keep the English name’s
  hash first because saved progress uses it as the answer’s identifier.

The game sorts entries by category in `CWUBRGZAL` order, then by word length. Answer
checking runs in the browser against the public hashes.
