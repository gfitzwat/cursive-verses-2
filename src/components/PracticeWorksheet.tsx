import { scaledDimensions, getColors, wrapText, type WorksheetSettings } from "../lib/worksheet";

interface Props {
	settings: WorksheetSettings;
	letters: string[];
	pangram: string;
}

const FONT_FAMILY = "LearningCurveDashed, cursive";
const FONT_NAME = "LearningCurveDashed";
const SVG_WIDTH = 1000;
const TEXT_X = 8;

const OPACITIES = [1.0, 0.73, 0.47, 0.2];
const X_POSITIONS = [TEXT_X, 254, 504, 754];

export default function PracticeWorksheet({ settings, letters, pangram }: Props) {
	const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
	const colors = getColors(settings);

	function GuideLines() {
		return (
			<>
				<line x1="0" y1={lineHeight - 1} x2={SVG_WIDTH} y2={lineHeight - 1} stroke={colors.descender} strokeWidth="1" />
				<line x1="0" y1={baseline} x2={SVG_WIDTH} y2={baseline} stroke={colors.baseline} strokeWidth="1.5" />
				<line x1="0" y1={xHeight} x2={SVG_WIDTH} y2={xHeight} stroke={colors.xHeight} strokeWidth="1" strokeDasharray="4,4" />
				<line x1="0" y1={capHeight} x2={SVG_WIDTH} y2={capHeight} stroke={colors.capHeight} strokeWidth="1" strokeDasharray="2,6" />
			</>
		);
	}

	function LetterLine({ upper }: { upper: string }) {
		const lower = upper.toLowerCase();
		return (
			<svg viewBox={`0 0 ${SVG_WIDTH} ${lineHeight}`} width="100%" style={{ display: "block" }}>
				<GuideLines />
				{X_POSITIONS.map((x, i) => (
					<text key={i} x={x} y={baseline} fontFamily={FONT_FAMILY} fontSize={fontSize} fill="#111111" fillOpacity={OPACITIES[i]} wordSpacing={`${settings.wordSpacing}em`}>
						{upper} {lower}
					</text>
				))}
			</svg>
		);
	}

	function BlankLine() {
		return (
			<svg viewBox={`0 0 ${SVG_WIDTH} ${lineHeight}`} width="100%" style={{ display: "block" }}>
				<GuideLines />
			</svg>
		);
	}

	function TextLine({ text, fs }: { text: string; fs: number }) {
		return (
			<svg viewBox={`0 0 ${SVG_WIDTH} ${lineHeight}`} width="100%" style={{ display: "block" }}>
				<GuideLines />
				<text x={TEXT_X} y={baseline} fontFamily={FONT_FAMILY} fontSize={fs} fill="#111111" fillOpacity={0.8} wordSpacing={`${settings.wordSpacing}em`}>
					{text}
				</text>
			</svg>
		);
	}

	const pangramFontSize = fontSize * 0.72;
	const pangramLines = wrapText(pangram, pangramFontSize, settings.wordSpacing, FONT_NAME, SVG_WIDTH - TEXT_X);

	return (
		<div style={{ maxWidth: "100%" }}>
			{letters.map((upper) => (
				<div key={upper}>
					<LetterLine upper={upper} />
					<BlankLine />
				</div>
			))}
			{pangramLines.map((line, i) => (
				<TextLine key={i} text={line} fs={pangramFontSize} />
			))}
		</div>
	);
}
