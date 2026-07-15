import { scaledDimensions, getColors, wrapText, type WorksheetSettings } from "../lib/worksheet";

interface Props {
	lines: string[];
	settings: WorksheetSettings;
}

const FONT_FAMILY = "LearningCurveDashed, cursive";
const FONT_NAME = "LearningCurveDashed";
const SVG_WIDTH = 1000;

export default function CustomWorksheet({ lines, settings }: Props) {
	const { fontSize, lineHeight, baseline, capHeight, xHeight } = scaledDimensions(settings.fontScale);
	const colors = getColors(settings);
	const opacity = settings.textOpacity / 100;

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

	function TextLine({ text }: { text: string }) {
		return (
			<svg viewBox={`0 0 ${SVG_WIDTH} ${lineHeight}`} width="100%" style={{ display: "block" }}>
				<GuideLines />
				<text x="0" y={baseline} fontFamily={FONT_FAMILY} fontSize={fontSize} fill="#111111" fillOpacity={opacity} wordSpacing={`${settings.wordSpacing}em`}>
					{text}
				</text>
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

	const hasAnyText = lines.some((l) => l.trim().length > 0);

	if (!hasAnyText) {
		return (
			<div>
				{lines.map((_, i) => (
					<BlankLine key={i} />
				))}
				<div className="text-center text-slate-300 text-sm py-4">Enter text in the fields on the left to preview</div>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: "100%" }}>
			{lines.map((line, idx) => {
				const trimmed = line.trim();
				if (!trimmed) {
					return <BlankLine key={idx} />;
				}
				const wrapped = wrapText(trimmed, fontSize, settings.wordSpacing, FONT_NAME);
				return (
					<div key={idx}>
						{wrapped.map((segment, si) => (
							<TextLine key={si} text={segment} />
						))}
						<BlankLine />
					</div>
				);
			})}
		</div>
	);
}
