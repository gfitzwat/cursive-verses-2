import { useRef } from "react";
import type { BibleVerse } from "../lib/bible";
import { verseRef, cleanText } from "../lib/bible";
import { scaledDimensions, getColors, wrapText, type WorksheetSettings } from "../lib/worksheet";

interface Props {
	verse: BibleVerse | null;
	settings: WorksheetSettings;
}

const SVG_WIDTH = 1000;

interface LineProps {
	lineHeight: number;
	baseline: number;
	capHeight: number;
	xHeight: number;
	colors: ReturnType<typeof getColors>;
}

function GuideLine({ lineHeight, baseline, capHeight, xHeight, colors }: LineProps) {
	return (
		<svg viewBox={`0 0 ${SVG_WIDTH} ${lineHeight}`} width="100%" style={{ display: "block" }}>
			{/* Descender line */}
			<line x1="0" y1={lineHeight - 1} x2={SVG_WIDTH} y2={lineHeight - 1} stroke={colors.descender} strokeWidth="1" />
			{/* Baseline */}
			<line x1="0" y1={baseline} x2={SVG_WIDTH} y2={baseline} stroke={colors.baseline} strokeWidth="1.5" />
			{/* X-height */}
			<line x1="0" y1={xHeight} x2={SVG_WIDTH} y2={xHeight} stroke={colors.xHeight} strokeWidth="1" strokeDasharray="4,4" />
			{/* Cap-height */}
			<line x1="0" y1={capHeight} x2={SVG_WIDTH} y2={capHeight} stroke={colors.capHeight} strokeWidth="1" strokeDasharray="2,6" />
		</svg>
	);
}

interface TextLineProps extends LineProps {
	text: string;
	fontSize: number;
	fontFamily: string;
	color: string;
	wordSpacing: number;
}

function TextGuideLine({ text, fontSize, fontFamily, color, wordSpacing, ...guideProps }: TextLineProps) {
	const { baseline } = guideProps;
	return (
		<svg viewBox={`0 0 ${SVG_WIDTH} ${guideProps.lineHeight}`} width="100%" style={{ display: "block" }}>
			{/* Guide lines */}
			<line x1="0" y1={guideProps.lineHeight - 1} x2={SVG_WIDTH} y2={guideProps.lineHeight - 1} stroke={guideProps.colors.descender} strokeWidth="1" />
			<line x1="0" y1={baseline} x2={SVG_WIDTH} y2={baseline} stroke={guideProps.colors.baseline} strokeWidth="1.5" />
			<line x1="0" y1={guideProps.xHeight} x2={SVG_WIDTH} y2={guideProps.xHeight} stroke={guideProps.colors.xHeight} strokeWidth="1" strokeDasharray="4,4" />
			<line x1="0" y1={guideProps.capHeight} x2={SVG_WIDTH} y2={guideProps.capHeight} stroke={guideProps.colors.capHeight} strokeWidth="1" strokeDasharray="2,6" />
			{/* Verse text */}
			<text x="0" y={baseline} fontFamily={fontFamily} fontSize={fontSize} fill={color} wordSpacing={`${wordSpacing}em`}>
				{text}
			</text>
		</svg>
	);
}

export default function Worksheet({ verse, settings }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
	const colors = getColors(settings);

	const fontFamily = settings.mode === "tracing" ? "LearningCurveDashed, cursive" : "LearningCurve, cursive";

	const pageHeight = settings.linesPerPage * lineHeight;

	let verseLines: string[] = [];
	let blankCount = settings.linesPerPage;

	if (verse) {
		const text = cleanText(verse.text);
		verseLines = wrapText(text, fontSize, settings.wordSpacing);
		const minBlanks = 4;
		blankCount = Math.max(minBlanks, settings.linesPerPage - verseLines.length);
	}

	const guideProps: LineProps = { lineHeight, baseline, capHeight, xHeight, colors };

	return (
		<div ref={containerRef} style={{ maxWidth: "100%" }}>
			{/* Verse lines */}
			{verseLines.map((line, i) => (
				<TextGuideLine key={i} text={line} fontSize={fontSize} fontFamily={fontFamily} color={colors.text} wordSpacing={settings.wordSpacing} {...guideProps} />
			))}

			{/* Blank practice lines */}
			{Array.from({ length: blankCount }).map((_, i) => (
				<GuideLine key={`blank-${i}`} {...guideProps} />
			))}

			{/* Footer reference */}
			{verse && <div className="text-right text-xs text-slate-600 mt-1 pr-1 no-print-hide">{verseRef(verse)}</div>}

			{!verse && (
				<div className="flex items-center justify-center text-slate-300 text-sm" style={{ height: pageHeight, position: "relative", top: -pageHeight }}>
					Select a verse to begin
				</div>
			)}
		</div>
	);
}
