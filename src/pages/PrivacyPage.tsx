import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function PrivacyPage() {
	return (
		<Layout>
			<div className="max-w-2xl mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold text-brand-deep mb-2">Privacy Policy</h1>
				<p className="text-sm text-brand-deep/50 mb-8">Last updated: July 2025</p>

				<div className="prose prose-slate max-w-none space-y-6 text-brand-deep/80">
					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">We keep it simple</h2>
						<p>Cursive Verses is a free tool for creating Bible verse handwriting worksheets. We don't collect personal information, we don't use tracking cookies, and we don't require you to create an account.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">No cookies</h2>
						<p>This site does not use cookies. Your browser settings and worksheet preferences exist only in your current session and are not stored on our servers.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">No personal data collected</h2>
						<p>We do not collect, store, or share any personal information. We don't ask for your name, email address, location, or any other identifying details.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">Bible verse requests</h2>
						<p>When you load a verse, a request is made to the YouVersion Bible API. That request includes the Bible version and verse reference you selected. Please review YouVersion's own privacy policy for how they handle API requests.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">Contact form</h2>
						<p>If you use the contact form, any message you send is transmitted to us by email. We retain only what's needed to respond to your inquiry and do not share it with third parties.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">Hosting</h2>
						<p>This site is hosted on Cloudflare Pages. Cloudflare may log basic request information (such as IP addresses) for security and reliability purposes. See Cloudflare's privacy policy for details.</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-brand-deep mb-2">Questions?</h2>
						<p>
							If you have any questions about this policy, feel free to{" "}
							<Link to="/contact" className="text-brand-teal hover:underline">
								contact us
							</Link>
							.
						</p>
					</section>
				</div>
			</div>
		</Layout>
	);
}
