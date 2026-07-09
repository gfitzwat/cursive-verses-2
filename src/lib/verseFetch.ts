import { isLocalBibleId } from "./bible";
import { getLocalVerseText } from "./localBibles";

export async function fetchVerseText(bibleId: number, bookUsfm: string, chapter: number, verse: number): Promise<string | undefined> {
  if (isLocalBibleId(bibleId)) {
    return getLocalVerseText(bibleId, bookUsfm, chapter, verse);
  }
  const usfm = `${bookUsfm}.${chapter}.${verse}`;
  const res = await fetch(`/api/verse?usfm=${usfm}&bible_id=${bibleId}`);
  if (!res.ok) return undefined;
  const data = (await res.json()) as { content?: string };
  return data.content;
}
