import { useState, useEffect, useCallback } from "react";
import type { BibleVerse, BibleVersion } from "./lib/bible";
import { BIBLE_BOOKS, cleanText } from "./lib/bible";
import { DEFAULT_SETTINGS, scaledDimensions, getColors, wrapText } from "./lib/worksheet";
import type { WorksheetSettings } from "./lib/worksheet";
import VerseSelector from "./components/VerseSelector";
import WorksheetControls from "./components/WorksheetControls";
import Worksheet from "./components/Worksheet";

const FALLBACK_VERSIONS: BibleVersion[] = [
	{ id: 3034, abbreviation: "BSB", localized_abbreviation: "BSB", localized_title: "Berean Standard Bible" },
	{ id: 12, abbreviation: "ASV", localized_abbreviation: "ASV", localized_title: "American Standard Version" },
	{ id: 206, abbreviation: "WEBUS", localized_abbreviation: "WEBUS", localized_title: "World English Bible" },
	{ id: 2660, abbreviation: "LSV", localized_abbreviation: "LSV", localized_title: "Literal Standard Version" },
	{ id: 1932, abbreviation: "FBV", localized_abbreviation: "FBV", localized_title: "Free Bible Version" },
	{ id: 42, abbreviation: "CPDV", localized_abbreviation: "CPDV", localized_title: "Catholic Public Domain Version" },
	{ id: 2163, abbreviation: "GNV", localized_abbreviation: "GNV", localized_title: "Geneva Bible" },
];

interface PassageResponse {
	id?: string;
	content?: string;
	reference?: string;
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
	const [bibleId, setBibleId] = useState(3034);
	const currentVersion = versions.find((v) => v.id === bibleId) ?? versions[0];
	const [verse, setVerse] = useState<BibleVerse | null>(null);
	const [settings, setSettings] = useState<WorksheetSettings>(DEFAULT_SETTINGS);
	const [votdLoading, setVotdLoading] = useState(false);
	const [pdfLoading, setPdfLoading] = useState(false);

	useEffect(() => {
		fetch("/api/versions")
			.then((r) => (r.ok ? r.json() : null))
			.then((data: { data?: BibleVersion[] } | null) => {
				if (data?.data?.length) setVersions(data.data);
			})
			.catch(() => {});
	}, []);

	const handleVotd = useCallback(
		async (id = bibleId) => {
			setVotdLoading(true);
			try {
				const res = await fetch(`/api/verse-of-day?bible_id=${id}`);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = (await res.json()) as PassageResponse;
				if (!data.content) throw new Error("No content");

				const { bookUsfm, chapter, verse: verseNum } = parseUsfm(data.passage_id ?? data.id ?? "");
				const book = BIBLE_BOOKS.find((b) => b.usfm === bookUsfm);

				setVerse({
					book_name: book?.name ?? data.reference?.split(" ")[0] ?? "",
					book_usfm: bookUsfm,
					chapter,
					verse: verseNum,
					text: cleanText(data.content),
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
		handleVotd(3034);
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

			const verseLines = wrapText(cleanText(verse.text), fontSize, settings.wordSpacing);
			const blankCount = Math.max(4, settings.linesPerPage - verseLines.length);

			function drawLine(yBase: number, text?: string) {
				const y = marginY + yBase;
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

			const wrapFooterText = (text: string, maxWidth: number): string[] => {
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

			const footerVerse = cleanText(verse.text);
			ctx.fillStyle = "#64748b";
			ctx.font = `${9 * scale}px sans-serif`;
			ctx.textAlign = "left";
			const footerVerseLines = wrapFooterText(footerVerse, drawWidth);
			const footerInfoY = pageH - marginY / 3;
			const footerVerseLinesToDraw = footerVerseLines.slice(0, 2);
			const footerVerseYStart = footerInfoY - 8 * scale - (footerVerseLinesToDraw.length - 1) * (12 * scale);
			footerVerseLinesToDraw.forEach((line, i) => {
				ctx.fillText(line, marginX, footerVerseYStart + i * (12 * scale));
			});

			ctx.fillStyle = "#94a3b8";
			ctx.font = `${12 * scale}px sans-serif`;
			ctx.textAlign = "right";
			ctx.fillText(`${verse.book_name} ${verse.chapter}:${verse.verse} (${currentVersion?.localized_abbreviation ?? ""})`, pageW - marginX, footerInfoY);
			if (currentVersion?.copyright) {
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
