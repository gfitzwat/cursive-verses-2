import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<header className="border-b border-brand-deep/10">
				<div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
					<NavLink to="/">
						<Logo className="h-8 lg:h-auto lg:w-[250px]" hideTagline />
					</NavLink>
					<nav className="flex items-center gap-6 text-sm">
						<NavLink to="/app" className={({ isActive }) => (isActive ? "text-brand-teal font-medium" : "text-brand-deep/70 hover:text-brand-deep")}>
							Worksheet
						</NavLink>
						<NavLink to="/about" className={({ isActive }) => (isActive ? "text-brand-teal font-medium" : "text-brand-deep/70 hover:text-brand-deep")}>
							About
						</NavLink>
						<NavLink to="/contact" className={({ isActive }) => (isActive ? "text-brand-teal font-medium" : "text-brand-deep/70 hover:text-brand-deep")}>
							Contact
						</NavLink>
						<NavLink to="/app" className="rounded-lg bg-brand-deep hover:bg-brand-deep/90 text-white text-sm font-medium px-4 py-2 transition-colors">
							Start writing
						</NavLink>
					</nav>
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
					</nav>
				</div>
			</footer>
		</div>
	);
}
