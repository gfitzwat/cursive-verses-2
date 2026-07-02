import { useState } from "react";
import Layout from "../components/Layout";

const EMAIL_USER = ["matt", "fitz", "water"].join("");
const EMAIL_DOMAIN = ["gmail", "com"].join(".");
const EMAIL_ADDRESS = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

export default function ContactPage() {
	const [sent, setSent] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", message: "" });

	function openMailClient(subject?: string, body?: string) {
		const params = new URLSearchParams();
		if (subject) params.set("subject", subject);
		if (body) params.set("body", body);
		const query = params.toString();
		window.location.href = `mailto:${EMAIL_ADDRESS}${query ? `?${query}` : ""}`;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// Opens the user's mail client with pre-filled fields
		const subject = `Cursive Verses — message from ${form.name}`;
		const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
		openMailClient(subject, body);
		setSent(true);
	}

	return (
		<Layout>
			<div className="max-w-lg mx-auto px-4 py-16">
				<h1 className="text-3xl font-bold text-brand-deep mb-2">Contact</h1>
				<p className="text-brand-deep/60 mb-10">Questions, feedback, or just want to say hi — I'd love to hear from you.</p>

				{sent ? (
					<div className="rounded-xl bg-brand-teal/10 border border-brand-teal/30 p-6 text-center">
						<p className="text-brand-teal font-medium text-lg mb-1">Your mail client should have opened.</p>
						<p className="text-brand-teal/80 text-sm">
							If not, email me directly at <span>mattfitzwater@gmail.com</span>.
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-brand-deep/80 mb-1">Name</label>
							<input
								type="text"
								required
								value={form.name}
								onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
								className="w-full rounded-lg border border-brand-deep/20 px-3 py-2.5 text-sm text-brand-deep focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-brand-deep/80 mb-1">Email</label>
							<input
								type="email"
								required
								value={form.email}
								onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
								className="w-full rounded-lg border border-brand-deep/20 px-3 py-2.5 text-sm text-brand-deep focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
								placeholder="you@example.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-brand-deep/80 mb-1">Message</label>
							<textarea
								required
								rows={5}
								value={form.message}
								onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
								className="w-full rounded-lg border border-brand-deep/20 px-3 py-2.5 text-sm text-brand-deep focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
								placeholder="What's on your mind?"
							/>
						</div>
						<button type="submit" className="w-full rounded-lg bg-brand-teal hover:bg-brand-teal/85 text-white font-medium py-2.5 transition-colors text-sm">
							Send Message
						</button>
					</form>
				)}

				<p className="mt-8 text-xs text-brand-deep/40 text-center">
					Or email directly: <span className="text-brand-teal">mattfitzwater@gmail.com</span>
				</p>
			</div>
		</Layout>
	);
}
