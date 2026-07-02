import { useState, useEffect } from "react";
import { BIBLE_BOOKS, maxVerses, cleanText } from "../lib/bible";
import type { BibleVerse, BibleVersion } from "../lib/bible";

interface PassageResponse {
	id?: string;
	content?: string;
	reference?: string;
}

interface Props {
	versions: BibleVersion[];
	bibleId: number;
	onBibleChange: (id: number) => void;
	onVerseSelect: (v: BibleVerse) => void;
	onVotdClick: () => void;
	votdLoading: boolean;
}

export default function VerseSelector({ versions, bibleId, onBibleChange, onVerseSelect, onVotdClick, votdLoading }: Props) {
	const [bookIdx, setBookIdx] = useState(42); // John
	const [chapter, setChapter] = useState(3);
	const [verseNum, setVerseNum] = useState(16);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const book = BIBLE_BOOKS[bookIdx];
	const chapterCount = book.chapters;
	const verseCount = maxVerses(bookIdx, chapter - 1);

	useEffect(() => {
		if (chapter > chapterCount) setChapter(1);
	}, [bookIdx, chapterCount, chapter]);

	useEffect(() => {
		if (verseNum > verseCount) setVerseNum(1);
	}, [chapter, verseCount, verseNum]);

	async function fetchVerse() {
		setLoading(true);
		setError("");
		try {
			const usfm = `${book.usfm}.${chapter}.${verseNum}`;
			const res = await fetch(`/api/verse?usfm=${usfm}&bible_id=${bibleId}`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = (await res.json()) as PassageResponse;
			const text = data.content ?? "";
			if (!text) throw new Error("No verse text returned");
			onVerseSelect({
				book_name: book.name,
				book_usfm: book.usfm,
				chapter,
				verse: verseNum,
				text: cleanText(text),
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load verse");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div>
				<label htmlFor="bible-version" className="block text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">
					Bible Version
				</label>
				<select id="bible-version" value={bibleId} onChange={(e) => onBibleChange(Number(e.target.value))} className="w-full rounded border border-brand-deep/15 bg-white px-2 py-1.5 text-sm text-brand-deep">
					{versions.map((v) => (
						<option key={v.id} value={v.id}>
							{v.localized_abbreviation} — {v.localized_title}
						</option>
					))}
				</select>
			</div>

			<button onClick={onVotdClick} disabled={votdLoading} className="w-full rounded bg-brand-teal hover:bg-brand-teal/85 text-white text-sm font-medium py-2 transition-colors disabled:opacity-60">
				{votdLoading ? "Loading…" : "✦ Verse of the Day"}
			</button>

			<div className="text-xs text-brand-deep/70 text-center -mt-2">— or pick a verse —</div>

			<div>
				<label htmlFor="book-select" className="block text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">
					Book
				</label>
				<select
					id="book-select"
					value={bookIdx}
					onChange={(e) => {
						setBookIdx(Number(e.target.value));
						setChapter(1);
						setVerseNum(1);
					}}
					className="w-full rounded border border-brand-deep/15 bg-white px-2 py-1.5 text-sm text-brand-deep">
					{BIBLE_BOOKS.map((b, i) => (
						<option key={b.usfm} value={i}>
							{b.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="chapter-select" className="block text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">
					Chapter
				</label>
				<select
					id="chapter-select"
					value={chapter}
					onChange={(e) => {
						setChapter(Number(e.target.value));
						setVerseNum(1);
					}}
					className="w-full rounded border border-brand-deep/15 bg-white px-2 py-1.5 text-sm text-brand-deep">
					{Array.from({ length: chapterCount }, (_, i) => i + 1).map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="verse-select" className="block text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">
					Verse
				</label>
				<select id="verse-select" value={verseNum} onChange={(e) => setVerseNum(Number(e.target.value))} className="w-full rounded border border-brand-deep/15 bg-white px-2 py-1.5 text-sm text-brand-deep">
					{Array.from({ length: verseCount }, (_, i) => i + 1).map((v) => (
						<option key={v} value={v}>
							{v}
						</option>
					))}
				</select>
			</div>

			{error && <p className="text-red-500 text-xs">{error}</p>}

			<button onClick={fetchVerse} disabled={loading} className="w-full rounded bg-brand-deep hover:bg-brand-deep/90 text-white text-sm font-medium py-2 transition-colors disabled:opacity-60">
				{loading ? "Loading…" : "Load Verse"}
			</button>
		</div>
	);
}
