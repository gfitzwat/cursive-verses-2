import type { WorksheetSettings, Mode } from "../lib/worksheet";

interface Props {
	settings: WorksheetSettings;
	onChange: (s: WorksheetSettings) => void;
}

function Slider({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
	return (
		<label className="flex flex-col gap-0.5">
			<span className="text-xs text-brand-deep/80">{label}</span>
			<input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-brand-teal w-full" />
		</label>
	);
}

export default function WorksheetControls({ settings, onChange }: Props) {
	function set<K extends keyof WorksheetSettings>(key: K, val: WorksheetSettings[K]) {
		onChange({ ...settings, [key]: val });
	}

	return (
		<div className="flex flex-col gap-3">
			{/* Mode */}
			<div>
				<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">Mode</p>
				<div className="flex gap-2">
					{(["tracing", "copywork"] as Mode[]).map((m) => (
						<button key={m} onClick={() => set("mode", m)} className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${settings.mode === m ? "bg-brand-deep text-white" : "bg-brand-cream text-brand-deep/80 hover:bg-brand-cream/70"}`}>
							{m}
						</button>
					))}
				</div>
			</div>

			{/* Layout */}
			<div>
				<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">Layout</p>
				<div className="flex flex-col gap-2">
					<Slider label={`Font Scale (${Math.round(settings.fontScale * 100)}%)`} min={1.0} max={1.7} step={0.01} value={settings.fontScale} onChange={(v) => set("fontScale", v)} />
					<Slider label={`Lines Per Page (${settings.linesPerPage})`} min={10} max={18} step={1} value={settings.linesPerPage} onChange={(v) => set("linesPerPage", v)} />
					<Slider label={`Word Spacing (${settings.wordSpacing.toFixed(2)} em)`} min={0} max={1.5} step={0.05} value={settings.wordSpacing} onChange={(v) => set("wordSpacing", v)} />
				</div>
			</div>

			{/* Line tones */}
			<div>
				<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">Line Darkness</p>
				<div className="flex flex-col gap-2">
					<Slider label="Baseline" min={0} max={100} step={1} value={settings.baselineTone} onChange={(v) => set("baselineTone", v)} />
					<Slider label="Descender" min={0} max={100} step={1} value={settings.descenderTone} onChange={(v) => set("descenderTone", v)} />
					<Slider label="X-Height" min={0} max={100} step={1} value={settings.xHeightTone} onChange={(v) => set("xHeightTone", v)} />
					<Slider label="Cap-Height" min={0} max={100} step={1} value={settings.capHeightTone} onChange={(v) => set("capHeightTone", v)} />
				</div>
			</div>

			{/* Text tone */}
			<div>
				<p className="text-xs font-semibold text-brand-deep/80 uppercase tracking-wider mb-1">Text</p>
				<Slider label="Verse Darkness" min={0} max={100} step={1} value={settings.textTone} onChange={(v) => set("textTone", v)} />
			</div>
		</div>
	);
}
