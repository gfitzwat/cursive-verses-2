import { useState } from "react";
import Layout from "../components/Layout";
import PracticeWorksheet from "../components/PracticeWorksheet";
import CustomWorksheet from "../components/CustomWorksheet";
import WorksheetControls from "../components/WorksheetControls";
import { DEFAULT_SETTINGS, scaledDimensions, getColors, wrapText } from "../lib/worksheet";
import type { WorksheetSettings } from "../lib/worksheet";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_PER_PAGE = 4;

const PAGES = Array.from({ length: Math.ceil(ALPHABET.length / LETTERS_PER_PAGE) }, (_, i) =>
	ALPHABET.slice(i * LETTERS_PER_PAGE, (i + 1) * LETTERS_PER_PAGE),
);

const PANGRAMS = [
	"The quick brown fox jumps over the lazy dog.",
	"The silly monkey quickly jumped out of his box to give the lazy panda a big, juicy red apple.",
	"Mom quickly mixed up a giant batch of sweet and zesty banana juice, but she forgot to put the lid on the blender!",
	"My crazy puppy loves to chew on everything, from my favorite fuzzy jacket to mom's big wooden quilt box.",
	"Five muddy hippos joyfully danced a quick jig before walking straight to the crazy zebra striped mailbox.",
];

const OPACITIES = [1.0, 0.73, 0.47, 0.2];

// ─── PDF helpers ────────────────────────────────────────────────────────────

async function renderAlphabetPageToCanvas(
	canvas: HTMLCanvasElement,
	letters: string[],
	pangram: string,
	settings: WorksheetSettings,
): Promise<void> {
	const scale = 2;
	const pageW = 816 * scale;
	const pageH = 1056 * scale;
	canvas.width = pageW;
	canvas.height = pageH;

	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, pageW, pageH);

	const marginX = 48 * scale;
	const marginY = 48 * scale;
	const drawWidth = pageW - marginX * 2;
	const xScale = drawWidth / 1000;

	const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
	const colors = getColors(settings);
	const sfl = fontSize * xScale;
	const slh = lineHeight * xScale;
	const sbl = baseline * xScale;
	const sch = capHeight * xScale;
	const sxh = xHeight * xScale;
	const xPositions = [0, 250, 500, 750].map((x) => marginX + x * xScale);

	ctx.font = `bold ${13 * scale}px sans-serif`;
	ctx.fillStyle = "#334155";
	ctx.textAlign = "left";
	ctx.globalAlpha = 1;
	ctx.fillText(`Alphabet Practice  —  ${letters[0]} – ${letters[letters.length - 1]}`, marginX, marginY + 13 * scale);

	let y = marginY + 32 * scale;

	function drawGuides() {
		ctx.strokeStyle = colors.descender; ctx.lineWidth = 1 * scale; ctx.setLineDash([]);
		ctx.beginPath(); ctx.moveTo(marginX, y + slh - 1); ctx.lineTo(marginX + drawWidth, y + slh - 1); ctx.stroke();
		ctx.strokeStyle = colors.baseline; ctx.lineWidth = 1.5 * scale;
		ctx.beginPath(); ctx.moveTo(marginX, y + sbl); ctx.lineTo(marginX + drawWidth, y + sbl); ctx.stroke();
		ctx.strokeStyle = colors.xHeight; ctx.lineWidth = 1 * scale; ctx.setLineDash([4 * scale, 4 * scale]);
		ctx.beginPath(); ctx.moveTo(marginX, y + sxh); ctx.lineTo(marginX + drawWidth, y + sxh); ctx.stroke();
		ctx.strokeStyle = colors.capHeight; ctx.setLineDash([2 * scale, 6 * scale]);
		ctx.beginPath(); ctx.moveTo(marginX, y + sch); ctx.lineTo(marginX + drawWidth, y + sch); ctx.stroke();
		ctx.setLineDash([]);
	}

	await document.fonts.load(`${sfl}px LearningCurveDashed`);

	for (const upper of letters) {
		const lower = upper.toLowerCase();
		drawGuides();
		ctx.font = `${sfl}px LearningCurveDashed, cursive`;
		ctx.textAlign = "left";
		for (let i = 0; i < 4; i++) {
			ctx.globalAlpha = OPACITIES[i];
			ctx.fillStyle = "#111111";
			ctx.fillText(`${upper} ${lower}`, xPositions[i], y + sbl);
		}
		ctx.globalAlpha = 1;
		y += slh;
		drawGuides();
		y += slh;
	}

	const pgFs = sfl * 0.72;
	ctx.font = `${pgFs}px LearningCurveDashed, cursive`;
	const words = pangram.split(" ");
	const pgLines: string[] = [];
	let current = "";
	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (ctx.measureText(candidate).width <= drawWidth) { current = candidate; }
		else { if (current) pgLines.push(current); current = word; }
	}
	if (current) pgLines.push(current);
	for (const line of pgLines) {
		drawGuides();
		ctx.globalAlpha = 0.8; ctx.fillStyle = "#111111";
		ctx.fillText(line, marginX, y + sbl);
		ctx.globalAlpha = 1;
		y += slh;
	}
}

async function renderCustomPageToCanvas(
	canvas: HTMLCanvasElement,
	lines: string[],
	settings: WorksheetSettings,
): Promise<void> {
	const scale = 2;
	const pageW = 816 * scale;
	const pageH = 1056 * scale;
	canvas.width = pageW;
	canvas.height = pageH;

	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, pageW, pageH);

	const marginX = 48 * scale;
	const marginY = 48 * scale;
	const drawWidth = pageW - marginX * 2;
	const xScale = drawWidth / 1000;

	const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
	const colors = getColors(settings);
	const sfl = fontSize * xScale;
	const slh = lineHeight * xScale;
	const sbl = baseline * xScale;
	const sch = capHeight * xScale;
	const sxh = xHeight * xScale;
	const opacity = settings.textOpacity / 100;

	ctx.font = `bold ${13 * scale}px sans-serif`;
	ctx.fillStyle = "#334155";
	ctx.textAlign = "left";
	ctx.globalAlpha = 1;
	ctx.fillText("Custom Practice Worksheet", marginX, marginY + 13 * scale);

	let y = marginY + 32 * scale;

	function drawGuides() {
		ctx.strokeStyle = colors.descender; ctx.lineWidth = 1 * scale; ctx.setLineDash([]);
		ctx.beginPath(); ctx.moveTo(marginX, y + slh - 1); ctx.lineTo(marginX + drawWidth, y + slh - 1); ctx.stroke();
		ctx.strokeStyle = colors.baseline; ctx.lineWidth = 1.5 * scale;
		ctx.beginPath(); ctx.moveTo(marginX, y + sbl); ctx.lineTo(marginX + drawWidth, y + sbl); ctx.stroke();
		ctx.strokeStyle = colors.xHeight; ctx.lineWidth = 1 * scale; ctx.setLineDash([4 * scale, 4 * scale]);
		ctx.beginPath(); ctx.moveTo(marginX, y + sxh); ctx.lineTo(marginX + drawWidth, y + sxh); ctx.stroke();
		ctx.strokeStyle = colors.capHeight; ctx.setLineDash([2 * scale, 6 * scale]);
		ctx.beginPath(); ctx.moveTo(marginX, y + sch); ctx.lineTo(marginX + drawWidth, y + sch); ctx.stroke();
		ctx.setLineDash([]);
	}

	await document.fonts.load(`${sfl}px LearningCurveDashed`);

	ctx.font = `${sfl}px LearningCurveDashed, cursive`;
	ctx.textAlign = "left";

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			drawGuides();
			y += slh;
		} else {
			const wrapped = wrapText(trimmed, fontSize, settings.wordSpacing, "LearningCurveDashed");
			for (const segment of wrapped) {
				drawGuides();
				ctx.globalAlpha = opacity;
				ctx.fillStyle = "#111111";
				ctx.fillText(segment, marginX, y + sbl);
				ctx.globalAlpha = 1;
				y += slh;
			}
			// blank practice line after each entry
			drawGuides();
			y += slh;
		}
	}
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PracticePage() {
	const [settings, setSettings] = useState<WorksheetSettings>(DEFAULT_SETTINGS);
	const [mode, setMode] = useState<"alphabet" | "custom">("alphabet");
	const [pageIndex, setPageIndex] = useState(0);
	const [customLines, setCustomLines] = useState<string[]>(["", "", ""]);
	const [pdfLoading, setPdfLoading] = useState<"page" | "all" | "custom" | null>(null);

	const currentLetters = PAGES[pageIndex];
	const firstLetter = currentLetters[0];
	const lastLetter = currentLetters[currentLetters.length - 1];
	const pangram = PANGRAMS[pageIndex % PANGRAMS.length];

	function updateCustomLine(idx: number, val: string) {
		setCustomLines((prev) => prev.map((l, i) => (i === idx ? val : l)));
	}

	function removeLine(idx: number) {
		setCustomLines((prev) => prev.filter((_, i) => i !== idx));
	}

	async function downloadAlphabet(indices: number[]) {
		const which = indices.length === 1 ? "page" : "all";
		setPdfLoading(which);
		try {
			const { jsPDF } = await import("jspdf");
			const pdf = new jsPDF({ unit: "px", format: [816, 1056], orientation: "portrait" });
			const canvas = document.createElement("canvas");
			for (let n = 0; n < indices.length; n++) {
				const idx = indices[n];
				await renderAlphabetPageToCanvas(canvas, PAGES[idx], PANGRAMS[idx % PANGRAMS.length], settings);
				if (n > 0) pdf.addPage();
				pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 816, 1056);
			}
			pdf.save(indices.length === 1 ? `practice-${firstLetter}-${lastLetter}.pdf` : "practice-alphabet-all.pdf");
		} finally {
			setPdfLoading(null);
		}
	}

	async function downloadCustom() {
		setPdfLoading("custom");
		try {
			const { jsPDF } = await import("jspdf");
			const pdf = new jsPDF({ unit: "px", format: [816, 1056], orientation: "portrait" });
			const canvas = document.createElement("canvas");
			await renderCustomPageToCanvas(canvas, customLines, settings);
			pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 816, 1056);
			pdf.save("custom-practice.pdf");
		} finally {
			setPdfLoading(null);
		}
	}

	const isLoading = pdfLoading !== null;

	return (
		<Layout>
			<div className="bg-brand-cream/30">
				<div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Controls panel */}
					<div className="no-print flex flex-col gap-4">
						{/* Mode toggle + navigation */}
						<div className="bg-white rounded-lg border border-brand-deep/10 p-4">
							{/* Tab toggle */}
							<div className="flex gap-1 mb-3 bg-brand-deep/5 rounded-lg p-1">
								<button
									onClick={() => setMode("alphabet")}
									className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "alphabet" ? "bg-white text-brand-deep shadow-sm" : "text-brand-deep/60 hover:text-brand-deep"}`}>
									Alphabet Practice
								</button>
								<button
									onClick={() => setMode("custom")}
									className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "custom" ? "bg-white text-brand-deep shadow-sm" : "text-brand-deep/60 hover:text-brand-deep"}`}>
									Create your own
								</button>
							</div>

							{mode === "alphabet" ? (
								<>
									<p className="text-xs text-brand-deep/60 mb-3">Each letter fades across 4 repetitions — trace the dark letters, practice on the lighter ones.</p>
									<div className="flex items-center justify-between gap-2">
										<button
											onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
											disabled={pageIndex === 0}
											className="flex-1 rounded bg-brand-deep/10 hover:bg-brand-deep/20 text-brand-deep text-sm font-medium py-1.5 transition-colors disabled:opacity-30">
											← Prev
										</button>
										<span className="text-xs font-semibold text-brand-deep whitespace-nowrap">
											{firstLetter} – {lastLetter}
										</span>
										<button
											onClick={() => setPageIndex((i) => Math.min(PAGES.length - 1, i + 1))}
											disabled={pageIndex === PAGES.length - 1}
											className="flex-1 rounded bg-brand-deep/10 hover:bg-brand-deep/20 text-brand-deep text-sm font-medium py-1.5 transition-colors disabled:opacity-30">
											Next →
										</button>
									</div>
									<div className="flex justify-center gap-1.5 mt-3">
										{PAGES.map((pg, i) => (
											<button
												key={i}
												onClick={() => setPageIndex(i)}
												className={`w-6 h-6 rounded text-xs font-medium transition-colors ${i === pageIndex ? "bg-brand-deep text-white" : "bg-brand-deep/10 text-brand-deep hover:bg-brand-deep/20"}`}>
												{pg[0]}
											</button>
										))}
									</div>
								</>
							) : (
								<>
									<p className="text-xs text-brand-deep/60 mb-3">Type each line of text you want to practice writing.</p>
									<div className="flex flex-col gap-2">
										{customLines.map((line, idx) => (
											<div key={idx} className="flex gap-1.5 items-center">
												<input
													type="text"
													value={line}
													onChange={(e) => updateCustomLine(idx, e.target.value)}
													placeholder={`Line ${idx + 1}`}
													className="flex-1 rounded border border-brand-deep/15 px-2 py-1.5 text-sm text-brand-deep focus:outline-none focus:border-brand-teal"
												/>
												{customLines.length > 1 && (
													<button
														onClick={() => removeLine(idx)}
														className="text-brand-deep/30 hover:text-brand-deep/60 text-lg leading-none transition-colors"
														aria-label="Remove line">
														×
													</button>
												)}
											</div>
										))}
									</div>
									<button
										onClick={() => setCustomLines((prev) => [...prev, ""])}
										className="mt-2 w-full rounded border border-dashed border-brand-deep/20 hover:border-brand-teal text-brand-deep/50 hover:text-brand-teal text-xs py-1.5 transition-colors">
										+ Add a line
									</button>
								</>
							)}
						</div>

						<div className="bg-white rounded-lg border border-brand-deep/10 p-4">
							<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-3">Worksheet Settings</p>
							<WorksheetControls settings={settings} onChange={setSettings} />
						</div>

						{mode === "alphabet" ? (
							<div className="flex flex-col gap-2">
								<button
									onClick={() => downloadAlphabet([pageIndex])}
									disabled={isLoading}
									className="w-full rounded-lg bg-brand-deep hover:bg-brand-deep/90 text-white font-medium py-2.5 transition-colors disabled:opacity-50">
									{pdfLoading === "page" ? "Generating…" : `⬇ Download this page  (${firstLetter}–${lastLetter})`}
								</button>
								<button
									onClick={() => downloadAlphabet(PAGES.map((_, i) => i))}
									disabled={isLoading}
									className="w-full rounded-lg border border-brand-deep text-brand-deep hover:bg-brand-deep/5 font-medium py-2.5 transition-colors disabled:opacity-50">
									{pdfLoading === "all" ? "Generating…" : "⬇ Download all  (A–Z)"}
								</button>
							</div>
						) : (
							<button
								onClick={downloadCustom}
								disabled={isLoading}
								className="w-full rounded-lg bg-brand-deep hover:bg-brand-deep/90 text-white font-medium py-2.5 transition-colors disabled:opacity-50">
								{pdfLoading === "custom" ? "Generating…" : "⬇ Download PDF"}
							</button>
						)}
					</div>

					{/* Worksheet preview */}
					<div className="md:col-span-2">
						<div className="bg-white rounded-lg border border-brand-deep/10 p-4 shadow-sm">
							{mode === "alphabet" ? (
								<PracticeWorksheet settings={settings} letters={currentLetters} pangram={pangram} />
							) : (
								<CustomWorksheet lines={customLines} settings={settings} />
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
