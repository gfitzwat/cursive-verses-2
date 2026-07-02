import { useEffect, useState } from "react";
import Layout from "../components/Layout";

declare global {
	interface Window {
		onTurnstileSuccess?: (token: string) => void;
		onTurnstileExpired?: () => void;
		onTurnstileError?: () => void;
		turnstile?: {
			reset: () => void;
		};
	}

	interface ImportMetaEnv {
		readonly VITE_TURNSTILE_SITE_KEY?: string;
	}
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

export default function ContactPage() {
	const [sent, setSent] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState("");
	const [turnstileToken, setTurnstileToken] = useState("");
	const [form, setForm] = useState({ name: "", email: "", message: "" });

	useEffect(() => {
		window.onTurnstileSuccess = (token: string) => {
			setTurnstileToken(token);
			setError("");
		};
		window.onTurnstileExpired = () => {
			setTurnstileToken("");
		};
		window.onTurnstileError = () => {
			setTurnstileToken("");
			setError("Captcha verification failed. Please try again.");
		};

		return () => {
			delete window.onTurnstileSuccess;
			delete window.onTurnstileExpired;
			delete window.onTurnstileError;
		};
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		if (!TURNSTILE_SITE_KEY) {
			setError("Contact form is not configured yet. Please email mattfitzwater@gmail.com directly.");
			return;
		}

		if (!turnstileToken) {
			setError("Please complete the captcha before sending your message.");
			return;
		}

		setSending(true);
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					message: form.message,
					turnstileToken,
				}),
			});

			if (!res.ok) {
				const data = (await res.json().catch(() => null)) as { error?: string } | null;
				throw new Error(data?.error ?? "Could not send your message right now.");
			}

			setSent(true);
			setForm({ name: "", email: "", message: "" });
			setTurnstileToken("");
			window.turnstile?.reset();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not send your message right now.");
		} finally {
			setSending(false);
		}
	}

	return (
		<Layout>
			<div className="max-w-lg mx-auto px-4 py-16">
				<h1 className="text-3xl font-bold text-brand-deep mb-2">Contact</h1>
				<p className="text-brand-deep/60 mb-10">Questions, feedback, or just want to say hi — I'd love to hear from you.</p>

				{sent ? (
					<div className="rounded-xl bg-brand-teal/10 border border-brand-teal/30 p-6 text-center">
						<p className="text-brand-teal font-medium text-lg mb-1">Message sent successfully.</p>
						<p className="text-brand-teal/80 text-sm">Thanks for reaching out. I will get back to you soon.</p>
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

						{TURNSTILE_SITE_KEY ? (
							<div className="flex justify-center">
								<div
									className="cf-turnstile"
									data-sitekey={TURNSTILE_SITE_KEY}
									data-callback="onTurnstileSuccess"
									data-expired-callback="onTurnstileExpired"
									data-error-callback="onTurnstileError"
								/>
							</div>
						) : (
							<p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
								Turnstile is not configured. Set VITE_TURNSTILE_SITE_KEY to enable contact form submissions.
							</p>
						)}

						{error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

						<button
							type="submit"
							disabled={sending || !TURNSTILE_SITE_KEY || !turnstileToken}
							className="w-full rounded-lg bg-brand-teal hover:bg-brand-teal/85 text-white font-medium py-2.5 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{sending ? "Sending..." : "Send Message"}
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
