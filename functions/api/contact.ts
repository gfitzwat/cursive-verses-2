interface Env {
	TURNSTILE_SECRET_KEY: string;
	RESEND_API_KEY: string;
	CONTACT_TO_EMAIL: string;
	CONTACT_FROM_EMAIL?: string;
}

interface ContactPayload {
	name?: string;
	email?: string;
	message?: string;
	turnstileToken?: string;
}

interface TurnstileVerifyResponse {
	success: boolean;
	"error-codes"?: string[];
}

const jsonHeaders = { "Content-Type": "application/json" };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
	if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
		return new Response(JSON.stringify({ error: "Server configuration is incomplete." }), {
			status: 500,
			headers: jsonHeaders,
		});
	}

	let payload: ContactPayload;
	try {
		payload = (await request.json()) as ContactPayload;
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON payload." }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	const name = (payload.name ?? "").trim();
	const email = (payload.email ?? "").trim();
	const message = (payload.message ?? "").trim();
	const token = (payload.turnstileToken ?? "").trim();

	if (!name || !email || !message || !token) {
		return new Response(JSON.stringify({ error: "Name, email, message, and captcha are required." }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	if (!emailRegex.test(email)) {
		return new Response(JSON.stringify({ error: "Please enter a valid email address." }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	if (name.length > 120 || email.length > 320 || message.length > 5000) {
		return new Response(JSON.stringify({ error: "Message is too long." }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	const remoteIp = request.headers.get("CF-Connecting-IP") ?? "";
	const verifyBody = new URLSearchParams();
	verifyBody.set("secret", env.TURNSTILE_SECRET_KEY);
	verifyBody.set("response", token);
	if (remoteIp) verifyBody.set("remoteip", remoteIp);

	const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: verifyBody.toString(),
	});

	const turnstile = (await turnstileRes.json()) as TurnstileVerifyResponse;
	if (!turnstile.success) {
		return new Response(JSON.stringify({ error: "Captcha verification failed." }), {
			status: 400,
			headers: jsonHeaders,
		});
	}

	const from = env.CONTACT_FROM_EMAIL?.trim() || "Cursive Verses Contact <onboarding@resend.dev>";
	const subject = `Cursive Verses contact from ${name}`;
	const text = ["New contact form message", "", `Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n");

	const emailRes = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [env.CONTACT_TO_EMAIL],
			reply_to: email,
			subject,
			text,
		}),
	});

	if (!emailRes.ok) {
		return new Response(JSON.stringify({ error: "Failed to send email." }), {
			status: 502,
			headers: jsonHeaders,
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: jsonHeaders,
	});
};
