export const BASE_FONT_SIZE = 44;
export const BASE_LINE_HEIGHT = 82;
export const BASE_BASELINE = 60;
export const CAP_HEIGHT_RATIO = 0.52; // cap height above baseline as fraction of line height
export const X_HEIGHT_RATIO = 0.28; // x-height above baseline as fraction of line height

export type Mode = "tracing" | "copywork";

export interface WorksheetSettings {
	mode: Mode;
	fontScale: number; // 1.0 – 1.7
	linesPerPage: number; // 10 – 18
	baselineTone: number; // 0 – 100
	descenderTone: number; // 0 – 100
	xHeightTone: number; // 0 – 100
	capHeightTone: number; // 0 – 100
	textTone: number; // 0 – 100
	wordSpacing: number; // 0 – 1.5 (em)
}

export const DEFAULT_SETTINGS: WorksheetSettings = {
	mode: "tracing",
	fontScale: 1.35,
	linesPerPage: 12,
	baselineTone: 50,
	descenderTone: 100,
	xHeightTone: 100,
	capHeightTone: 100,
	textTone: 90,
	wordSpacing: 0.35,
};

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
	return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function toneToHex(tone: number, lightHex: string, darkHex: string): string {
	const t = tone / 100;
	const [lr, lg, lb] = hexToRgb(lightHex);
	const [dr, dg, db] = hexToRgb(darkHex);
	return rgbToHex(lerp(lr, dr, t), lerp(lg, dg, t), lerp(lb, db, t));
}

export function getColors(s: WorksheetSettings) {
	return {
		baseline: toneToHex(s.baselineTone, "#94a3b8", "#334155"),
		descender: toneToHex(s.descenderTone, "#e2e8f0", "#94a3b8"),
		xHeight: toneToHex(s.xHeightTone, "#cbd5e1", "#64748b"),
		capHeight: toneToHex(s.capHeightTone, "#cbd5e1", "#64748b"),
		text: toneToHex(s.textTone, "#94a3b8", "#1a1a1a"),
	};
}

export function scaledDimensions(fontScale: number) {
	const fontSize = BASE_FONT_SIZE * fontScale;
	const lineHeight = BASE_LINE_HEIGHT * fontScale;
	const baseline = BASE_BASELINE * fontScale;
	const capHeight = baseline - CAP_HEIGHT_RATIO * lineHeight;
	const xHeight = baseline - X_HEIGHT_RATIO * lineHeight;
	return { fontSize, lineHeight, baseline, capHeight, xHeight };
}

const SVG_WIDTH = 1000;

// Estimate character width for text wrapping. Falls back to ~22px/char avg.
function measureTextWidth(text: string, fontSize: number, wordSpacingEm: number, fontFamily: string, canvas?: HTMLCanvasElement): number {
	if (typeof document !== "undefined") {
		const c = canvas ?? document.createElement("canvas");
		const ctx = c.getContext("2d");
		if (ctx) {
			ctx.font = `${fontSize}px ${fontFamily}, cursive`;
			const extra = (text.split(" ").length - 1) * wordSpacingEm * fontSize;
			return ctx.measureText(text).width + extra;
		}
	}
	// SSR fallback
	return text.length * fontSize * 0.5;
}

export function wrapText(text: string, fontSize: number, wordSpacingEm: number, fontFamily: string, maxWidth = SVG_WIDTH): string[] {
	const words = text.split(" ");
	const lines: string[] = [];
	let current = "";
	const canvas = typeof document !== "undefined" ? document.createElement("canvas") : undefined;

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (measureTextWidth(candidate, fontSize, wordSpacingEm, fontFamily, canvas) <= maxWidth) {
			current = candidate;
		} else {
			if (current) lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);
	return lines;
}
