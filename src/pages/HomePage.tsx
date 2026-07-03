import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const benefits = [
	{
		icon: "✍️",
		title: "Slow down & absorb",
		body: "Writing by hand forces you to process each word deliberately — research shows this deepens comprehension compared to typing or reading alone.",
	},
	{
		icon: "📖",
		title: "Scripture memorization",
		body: "The act of tracing or copying a verse repeatedly engraves it in memory. Many find they recall passages months later without any extra effort.",
	},
	{
		icon: "🧠",
		title: "Cognitive benefits of cursive",
		body: "Cursive writing engages both hemispheres of the brain, improves fine motor coordination, and builds a rhythm that promotes focused, meditative practice.",
	},
	{
		icon: "🙏",
		title: "A daily spiritual discipline",
		body: "Pairing handwriting with Scripture turns a simple worksheet into a devotional practice — a quiet moment to reflect, pray, and be present in the Word.",
	},
	{
		icon: "👨‍👩‍👧",
		title: "Great for all ages",
		body: "Children learning cursive, students studying Scripture, or adults wanting a contemplative practice — worksheets adapt to every skill level.",
	},
	{
		icon: "🖨️",
		title: "Print in seconds",
		body: "Choose your verse, adjust the line size and tone, and download a clean PDF — ready for any printer, any paper size.",
	},
];

const steps = [
	{ n: "1", label: "Pick a verse", detail: "Load the Verse of the Day or browse all 66 books by chapter and verse." },
	{ n: "2", label: "Adjust the worksheet", detail: "Set font scale, line spacing, and darkness. Switch between tracing and copywork modes." },
	{ n: "3", label: "Download & print", detail: "Export a crisp PDF at print resolution and write away." },
];

export default function HomePage() {
	return (
		<Layout>
			{/* Hero */}
			<section className="bg-gradient-to-b from-brand-cream to-white px-4 pt-16 pb-20">
				<div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:gap-14">
					<div className="text-center lg:text-left">
						<p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-teal">Free printable Scripture handwriting</p>
						<h1 className="mt-4 text-4xl font-bold leading-tight text-brand-deep sm:text-5xl">
							Write the Word.
							<br />
							<span className="text-brand-teal ">By Hand. In Cursive.</span>
							<br />
							Live the Word.
						</h1>
						<p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-deep/60 lg:max-w-none">
							<strong>Free</strong> printable Bible verse handwriting worksheets — to help you slow down, reflect, and hide Scripture in your heart.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
							<Link to="/app" className="rounded-xl bg-brand-deep px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-deep/90">
								Start writing
							</Link>
							<Link to="/about" className="rounded-xl border border-brand-deep/20 bg-white px-8 py-3.5 text-base font-medium text-brand-deep/70 transition-colors hover:border-brand-deep/40 hover:bg-white">
								Learn More
							</Link>
						</div>
					</div>

					<div>
						<div className="overflow-hidden rounded-2xl border border-brand-deep/10 bg-white shadow-sm">
							<div className="border-b border-brand-deep/10 bg-brand-cream/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-brand-deep/40">Sample worksheet — John 3:16 · BSB · Tracing mode</div>
							<div className="space-y-1 p-6">
								{["For God so loved the world that he gave", "his one and only Son, that whoever", "believes in him shall not perish but", "have eternal life.", ""].map((line, i) => (
									<div key={i} className="relative" style={{ height: "62px" }}>
										<div className="absolute bottom-0 left-0 right-0 border-b border-slate-300" />
										<div className="absolute left-0 right-0 border-b border-slate-400" style={{ bottom: "28%" }} />
										<div className="absolute left-0 right-0 border-b border-dashed border-slate-200" style={{ bottom: "55%" }} />
										<div className="absolute left-0 right-0 border-b border-dashed border-slate-100" style={{ bottom: "78%" }} />
										{line && (
											<span className="absolute left-0 text-slate-400 leading-none" style={{ fontFamily: "LearningCurveDashed", fontSize: "28px", bottom: "18%" }}>
												{line}
											</span>
										)}
									</div>
								))}
							</div>
						</div>
						<p className="mt-3 text-center text-xs text-brand-deep/40 lg:text-left">
							'I have hidden your word in my heart, that I might not sin against you. '<a href="https://www.bible.com/bible/116/PSA.119.NLT?parallel=1588">Psalm 119:11</a>
						</p>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="py-16 bg-brand-cream/30 px-4">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-brand-deep text-center mb-10">How it works</h2>
					<div className="grid sm:grid-cols-3 gap-6">
						{steps.map((s) => (
							<div key={s.n} className="bg-white rounded-xl border border-brand-deep/10 p-5">
								<div className="w-8 h-8 rounded-full bg-brand-teal text-white text-sm font-bold flex items-center justify-center mb-3">{s.n}</div>
								<h3 className="font-semibold text-brand-deep mb-1">{s.label}</h3>
								<p className="text-sm text-brand-deep/60 leading-relaxed">{s.detail}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="py-16 bg-white px-4">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-2xl font-bold text-brand-deep text-center mb-2">Why write Scripture by hand?</h2>
					<p className="text-center text-brand-deep/60 mb-10 max-w-xl mx-auto">Combining Bible study with cursive handwriting is an ancient practice with modern science behind it.</p>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{benefits.map((b) => (
							<div key={b.title} className="rounded-xl border border-brand-deep/10 p-5 hover:border-brand-teal/40 transition-colors">
								<div className="text-2xl mb-2">{b.icon}</div>
								<h3 className="font-semibold text-brand-deep mb-1">{b.title}</h3>
								<p className="text-sm text-brand-deep/60 leading-relaxed">{b.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 bg-brand-deep text-center px-4">
				<h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to start?</h2>
				<p className="text-brand-cream/70 mb-7 max-w-sm mx-auto">Free, no sign-in required. Just pick a verse and print.</p>
				<Link to="/app" className="inline-block rounded-xl bg-brand-deep hover:bg-brand-deep/90 text-white font-semibold px-8 py-3.5 transition-colors">
					Start writing
				</Link>
			</section>
		</Layout>
	);
}
