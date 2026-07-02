import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function AboutPage() {
	return (
		<Layout>
			<div className="max-w-2xl mx-auto px-4 py-16">
				<h1 className="text-3xl font-bold text-brand-deep mb-2">About Cursive Verses</h1>
				<p className="text-slate-800 text-sm mb-10">A handwriting worksheet generator for Scripture</p>

				<div className="prose max-w-none space-y-6 leading-relaxed [--tw-prose-body:theme(colors.slate.900)] [--tw-prose-headings:theme(colors.slate.950)] [--tw-prose-links:theme(colors.slate.900)] [--tw-prose-bold:theme(colors.slate.950)] [--tw-prose-bullets:theme(colors.slate.700)]">
					<p>Cursive Verses was built out of a simple idea: that writing Bible verses by hand, slowly and deliberately, is one of the best ways to internalize Scripture. There is something about putting pen to paper that reading or typing just can't replicate.</p>

					<h2 className="text-xl font-semibold text-brand-deep !mt-10 !mb-2">The app</h2>
					<p>
						Cursive Verses generates printable handwriting worksheets from any verse in the Bible. Choose a translation, pick a passage — or load the Verse of the Day — then customize the worksheet to your liking: font scale, line count, and the tone of each guide line. Download a high-resolution
						PDF and print.
					</p>
					<p>
						Worksheets use the <strong>LearningCurve</strong> cursive font family, which includes dashed letterforms for tracing and solid letterforms for copywork. The four-ruled-line guide system mirrors what is used in professional handwriting instruction: a descender line, baseline, x-height
						line, and cap-height line.
					</p>

					<h2 className="text-xl font-semibold text-brand-deep !mt-10 !mb-2">Bible versions</h2>
					<p>
						Verse content is served through the{" "}
						<a href="https://platform.youversion.com" target="_blank" rel="noopener noreferrer" className="text-brand-deep underline underline-offset-2 hover:text-brand-deep/85">
							YouVersion Platform API
						</a>
						. Available translations include the <strong>Berean Standard Bible (BSB)</strong>, American Standard Version (ASV), World English Bible (WEB), Literal Standard Version (LSV), Geneva Bible, Free Bible Version, and several others — all free to use with no account required.
					</p>

					<h3 className="text-lg font-semibold">
						&apos;Train up a child in the way he should go, And when he is old he will not depart from it.&apos;{" "}
						<a href="https://www.bible.com/bible/114/PRO.22.NKJV?parallel=111" className="text-brand-deep underline underline-offset-2 hover:text-brand-deep/85">
							Proverbs 22:6
						</a>
					</h3>

					<h2 className="text-xl font-semibold text-brand-deep !mt-10 !mb-2">Who it's for</h2>
					<ul className="list-disc pl-5 space-y-1">
						<li>Children practicing cursive handwriting with meaningful content</li>
						<li>Students memorizing Scripture for school, church, or personal devotion</li>
						<li>Adults wanting a contemplative, pen-and-paper spiritual discipline</li>
						<li>Sunday school teachers and homeschool families needing printable materials</li>
					</ul>

					<h2 className="text-xl font-semibold text-brand-deep !mt-10 !mb-2">Built with</h2>
					<p>React · TypeScript · Vite · Tailwind CSS · jsPDF · Cloudflare Pages · YouVersion Platform API · LearningCurve fonts by Blue Vinyl Fonts.</p>
					<p>
						This is an open portfolio project. If you have questions or feedback, the{" "}
						<Link to="/contact" className="text-brand-deep underline underline-offset-2 hover:text-brand-deep/85">
							contact page
						</Link>{" "}
						is the best place to reach me.
					</p>
				</div>

				<div className="mt-12 pt-8 border-t border-brand-deep/10 flex gap-4">
					<Link to="/app" className="rounded-lg bg-brand-deep hover:bg-brand-deep/90 text-white text-sm font-medium px-5 py-2.5 transition-colors">
						Try the app
					</Link>
					<Link to="/contact" className="rounded-lg border border-brand-deep/30 hover:border-brand-deep/50 text-brand-deep text-sm font-medium px-5 py-2.5 transition-colors">
						Get in touch
					</Link>
				</div>
			</div>
		</Layout>
	);
}
