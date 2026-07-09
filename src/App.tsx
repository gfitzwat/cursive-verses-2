import { useState, useEffect, useCallback } from "react";
import type { BibleVerse, BibleVersion } from "./lib/bible";
import { BIBLE_BOOKS, LOCAL_VERSIONS, cleanText, sortVersions } from "./lib/bible";
import { fetchVerseText } from "./lib/verseFetch";
import { DEFAULT_SETTINGS, scaledDimensions, getColors, wrapText } from "./lib/worksheet";
import type { WorksheetSettings } from "./lib/worksheet";
import VerseSelector from "./components/VerseSelector";
import WorksheetControls from "./components/WorksheetControls";
import Worksheet from "./components/Worksheet";

const ALLOWED_REMOTE_VERSION_IDS = [12, 111, 42, 2692]; // ASV, NIV, CPDV, NASB2020
const DEFAULT_BIBLE_ID = 111; // NIV

const FALLBACK_REMOTE_VERSIONS: BibleVersion[] = [
	{ id: 12, abbreviation: "ASV", localized_abbreviation: "ASV", localized_title: "American Standard Version" },
	{ id: 111, abbreviation: "NIV", localized_abbreviation: "NIV", localized_title: "New International Version" },
	{ id: 42, abbreviation: "CPDV", localized_abbreviation: "CPDV", localized_title: "Catholic Public Domain Version" },
	{ id: 2692, abbreviation: "NASB2020", localized_abbreviation: "NASB2020", localized_title: "New American Standard Bible" },
];

const FALLBACK_VERSIONS: BibleVersion[] = sortVersions([...FALLBACK_REMOTE_VERSIONS, ...LOCAL_VERSIONS]);

interface VotdResponse {
	passage_id?: string;
}

function parseUsfm(usfm: string): { bookUsfm: string; chapter: number; verse: number } {
	const parts = usfm.split(".");
	return {
		bookUsfm: parts[0] ?? "",
		chapter: parseInt(parts[1] ?? "1"),
		verse: parseInt(parts[2] ?? "1"),
	};
}

export default function App() {
	const [versions, setVersions] = useState<BibleVersion[]>(FALLBACK_VERSIONS);
	const [bibleId, setBibleId] = useState(DEFAULT_BIBLE_ID);
	const currentVersion = versions.find((v) => v.id === bibleId) ?? versions[0];
	const [verse, setVerse] = useState<BibleVerse | null>(null);
	const [settings, setSettings] = useState<WorksheetSettings>(DEFAULT_SETTINGS);
	const [votdLoading, setVotdLoading] = useState(false);
	const [pdfLoading, setPdfLoading] = useState(false);

	useEffect(() => {
		fetch("/api/versions")
			.then((r) => (r.ok ? r.json() : null))
			.then((data: { data?: BibleVersion[] } | null) => {
				const filteredRemote = data?.data?.filter((v) => ALLOWED_REMOTE_VERSION_IDS.includes(v.id));
				if (filteredRemote?.length) setVersions(sortVersions([...filteredRemote, ...LOCAL_VERSIONS]));
			})
			.catch(() => {});
	}, []);

	const handleVotd = useCallback(
		async (id = bibleId) => {
			setVotdLoading(true);
			try {
				const res = await fetch(`/api/verse-of-day`);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = (await res.json()) as VotdResponse;
				if (!data.passage_id) throw new Error("No passage_id");

				const { bookUsfm, chapter, verse: verseNum } = parseUsfm(data.passage_id);
				const book = BIBLE_BOOKS.find((b) => b.usfm === bookUsfm);

				const text = await fetchVerseText(id, bookUsfm, chapter, verseNum);
				if (!text) throw new Error("No content");

				setVerse({
					book_name: book?.name ?? "",
					book_usfm: bookUsfm,
					chapter,
					verse: verseNum,
					text: cleanText(text),
				});
			} catch {
				alert("Could not load verse of the day. Please try again.");
			} finally {
				setVotdLoading(false);
			}
		},
		[bibleId],
	);

	useEffect(() => {
		handleVotd(DEFAULT_BIBLE_ID);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	async function handleDownloadPdf() {
		if (!verse) return;
		setPdfLoading(true);
		try {
			const { jsPDF } = await import("jspdf");
			const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
			const colors = getColors(settings);

			const scale = 2;
			const pageW = 816 * scale;
			const pageH = 1056 * scale;

			const canvas = document.createElement("canvas");
			canvas.width = pageW;
			canvas.height = pageH;
			const ctx = canvas.getContext("2d")!;

			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, pageW, pageH);

			const marginX = 48 * scale;
			const marginY = 48 * scale;
			const drawWidth = pageW - marginX * 2;
			const xScale = drawWidth / 1000;

			const fontFamily = settings.mode === "tracing" ? "LearningCurveDashed" : "LearningCurve";
			const scaledFontSize = fontSize * xScale;
			const scaledLineHeight = lineHeight * xScale;
			const scaledBaseline = baseline * xScale;
			const scaledCapHeight = capHeight * xScale;
			const scaledXHeight = xHeight * xScale;

			const wrapPlainText = (text: string, maxWidth: number): string[] => {
				const words = text.split(" ");
				const lines: string[] = [];
				let current = "";
				for (const word of words) {
					const candidate = current ? `${current} ${word}` : word;
					if (ctx.measureText(candidate).width <= maxWidth) {
						current = candidate;
					} else {
						if (current) lines.push(current);
						current = word;
					}
				}
				if (current) lines.push(current);
				return lines;
			};

			const headerRefFontSize = 13 * scale;
			const headerFontSize = 9 * scale;
			const headerLineGap = 12 * scale;

			ctx.font = `bold ${headerRefFontSize}px sans-serif`;
			ctx.fillStyle = "#334155";
			ctx.textAlign = "left";
			const headerRefText = `${verse.book_name} ${verse.chapter}:${verse.verse} (${currentVersion?.localized_abbreviation ?? ""})`;
			ctx.fillText(headerRefText, marginX, marginY + headerRefFontSize);

			const quoteTop = marginY + headerRefFontSize + 10 * scale;
			ctx.font = `${headerFontSize}px sans-serif`;
			const headerVerseLines = wrapPlainText(cleanText(verse.text), drawWidth).slice(0, 2);
			ctx.fillStyle = "#64748b";
			headerVerseLines.forEach((line, i) => {
				ctx.fillText(line, marginX, quoteTop + headerFontSize + i * headerLineGap);
			});
			const headerBlockHeight = quoteTop + headerFontSize + (headerVerseLines.length - 1) * headerLineGap - marginY + 16 * scale;
			const linesTop = marginY + headerBlockHeight;

			const verseLines = wrapText(cleanText(verse.text), fontSize, settings.wordSpacing);
			const blankCount = Math.max(4, settings.linesPerPage - verseLines.length);

			function drawLine(yBase: number, text?: string) {
				const y = linesTop + yBase;
				ctx.strokeStyle = colors.descender;
				ctx.lineWidth = 1 * scale;
				ctx.setLineDash([]);
				ctx.beginPath();
				ctx.moveTo(marginX, y + scaledLineHeight - 1);
				ctx.lineTo(marginX + drawWidth, y + scaledLineHeight - 1);
				ctx.stroke();

				ctx.strokeStyle = colors.baseline;
				ctx.lineWidth = 1.5 * scale;
				ctx.beginPath();
				ctx.moveTo(marginX, y + scaledBaseline);
				ctx.lineTo(marginX + drawWidth, y + scaledBaseline);
				ctx.stroke();

				ctx.strokeStyle = colors.xHeight;
				ctx.lineWidth = 1 * scale;
				ctx.setLineDash([4 * scale, 4 * scale]);
				ctx.beginPath();
				ctx.moveTo(marginX, y + scaledXHeight);
				ctx.lineTo(marginX + drawWidth, y + scaledXHeight);
				ctx.stroke();

				ctx.strokeStyle = colors.capHeight;
				ctx.setLineDash([2 * scale, 6 * scale]);
				ctx.beginPath();
				ctx.moveTo(marginX, y + scaledCapHeight);
				ctx.lineTo(marginX + drawWidth, y + scaledCapHeight);
				ctx.stroke();
				ctx.setLineDash([]);

				if (text) {
					ctx.fillStyle = colors.text;
					ctx.font = `${scaledFontSize}px ${fontFamily}, cursive`;
					ctx.fillText(text, marginX, y + scaledBaseline);
				}
			}

			verseLines.forEach((line, i) => drawLine(i * scaledLineHeight, line));
			for (let i = 0; i < blankCount; i++) drawLine((verseLines.length + i) * scaledLineHeight);

			const footerInfoY = pageH - marginY / 3;

			if (currentVersion?.copyright) {
				ctx.fillStyle = "#94a3b8";
				ctx.textAlign = "left";
				ctx.font = `${10 * scale}px sans-serif`;
				ctx.fillText(currentVersion.copyright, marginX, footerInfoY);
			}

			const imgData = canvas.toDataURL("image/jpeg", 0.92);
			const pdf = new jsPDF({ unit: "px", format: [816, 1056], orientation: "portrait" });
			pdf.addImage(imgData, "JPEG", 0, 0, 816, 1056);
			pdf.save(`${verse.book_usfm}${verse.chapter}-${verse.verse}-worksheet.pdf`);
		} finally {
			setPdfLoading(false);
		}
	}

	return (
		<div className="bg-brand-cream/30">
			<div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="no-print flex flex-col gap-4">
					<div className="bg-white rounded-lg border border-brand-deep/10 p-4">
						<VerseSelector
							versions={versions}
							bibleId={bibleId}
							onBibleChange={(id) => {
								setBibleId(id);
							}}
							onVerseSelect={setVerse}
							onVotdClick={() => handleVotd()}
							votdLoading={votdLoading}
						/>
					</div>

					<div className="bg-white rounded-lg border border-brand-deep/10 p-4">
						<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-3">Worksheet Settings</p>
						<WorksheetControls settings={settings} onChange={setSettings} />
					</div>

					<button onClick={handleDownloadPdf} disabled={!verse || pdfLoading} className="w-full rounded-lg bg-brand-deep hover:bg-brand-deep/90 text-white font-medium py-2.5 transition-colors disabled:opacity-40">
						{pdfLoading ? "Generating PDF…" : "⬇ Download PDF"}
					</button>
				</div>

				<div className="md:col-span-2">
					{verse && (
						<div className="mb-2 text-sm text-brand-deep/70 no-print">
							<span className="font-medium">
								{verse.book_name} {verse.chapter}:{verse.verse}
							</span>
							<span className="text-brand-deep/70 ml-2">— {verse.text}</span>
						</div>
					)}
					<div className="bg-white rounded-lg border border-brand-deep/10 p-4 shadow-sm">
						<Worksheet verse={verse} settings={settings} />
					</div>
					{currentVersion?.copyright && <p className="mt-2 text-xs text-brand-deep/70 leading-snug">{currentVersion.copyright}</p>}
				</div>
			</div>
		</div>
	);
}
