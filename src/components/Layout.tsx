import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<header className="border-b border-brand-deep/10">
				<div className="max-w-5xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						<NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
							<Logo className="h-8 lg:h-auto lg:w-[250px]" hideTagline />
						</NavLink>

						<button
							type="button"
							className="md:hidden inline-flex items-center justify-center rounded-lg bg-brand-deep text-white p-2 hover:bg-brand-deep/90 transition-colors"
							aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
							aria-expanded={mobileMenuOpen}
							onClick={() => setMobileMenuOpen((open) => !open)}>
							<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								{mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
							</svg>
						</button>

						<nav className="hidden md:flex items-center gap-6 text-sm">
							<NavLink to="/about" className={({ isActive }) => (isActive ? "text-brand-teal font-medium" : "text-brand-deep/70 hover:text-brand-deep")}>
								About
							</NavLink>
							<NavLink to="/contact" className={({ isActive }) => (isActive ? "text-brand-teal font-medium" : "text-brand-deep/70 hover:text-brand-deep")}>
								Contact
							</NavLink>
							<NavLink to="/app" className={({ isActive }) => `rounded-lg text-sm font-medium px-4 py-2 transition-colors ${isActive ? "bg-brand-teal hover:bg-brand-teal/90 text-white" : "bg-brand-deep hover:bg-brand-deep/90 text-white"}`}>
								Start writing
							</NavLink>
						</nav>
					</div>

					{mobileMenuOpen && (
						<nav className="md:hidden pt-3 pb-1 border-t border-brand-deep/10 mt-3 flex flex-col gap-1 text-sm">
							<NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-brand-teal/10 text-brand-teal font-medium" : "text-brand-deep/80 hover:bg-brand-deep/5"}`}>
								About
							</NavLink>
							<NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? "bg-brand-teal/10 text-brand-teal font-medium" : "text-brand-deep/80 hover:bg-brand-deep/5"}`}>
								Contact
							</NavLink>
							<NavLink to="/app" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mt-1 rounded-lg text-white text-sm font-medium px-3 py-2 transition-colors text-center ${isActive ? "bg-brand-teal hover:bg-brand-teal/90" : "bg-brand-deep hover:bg-brand-deep/90"}`}>
								Start writing
							</NavLink>
						</nav>
					)}
				</div>
			</header>

			<main className="flex-1">{children}</main>

			<footer className="border-t border-brand-deep/10 py-8">
				<div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-deep/70">
					<Logo className="h-5 opacity-50" hideTagline />
					<p>© {new Date().getFullYear()} Cursive Verses. Free to use.</p>
					<nav className="flex gap-4">
						<NavLink to="/about" className="text-brand-deep/80 hover:text-brand-deep">
							About
						</NavLink>
						<NavLink to="/contact" className="text-brand-deep/80 hover:text-brand-deep">
							Contact
						</NavLink>
						<NavLink to="/app" className="text-brand-deep/80 hover:text-brand-deep">
							Start writing
						</NavLink>
					</nav>
				</div>
			</footer>
		</div>
	);
}
