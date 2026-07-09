const LOCAL_BIBLE_FILES: Record<number, string> = {
  [-1]: "/json-bibles/bsb.json",
  [-2]: "/json-bibles/kjv.json",
  [-3]: "/json-bibles/net.json",
  [-4]: "/json-bibles/web.json",
};

// Each file is a flat { "BOOK.CHAPTER.VERSE": "text" } map, pre-normalized
// from the raw translation exports (see scripts used to generate these).
type LocalBible = Record<string, string>;

const cache = new Map<number, Promise<LocalBible>>();

function loadLocalBible(id: number): Promise<LocalBible> {
  let pending = cache.get(id);
  if (!pending) {
    pending = fetch(LOCAL_BIBLE_FILES[id]).then((res) => res.json());
    cache.set(id, pending);
  }
  return pending;
}

export async function getLocalVerseText(id: number, bookUsfm: string, chapter: number, verse: number): Promise<string | undefined> {
  const verses = await loadLocalBible(id);
  return verses[`${bookUsfm}.${chapter}.${verse}`];
}
