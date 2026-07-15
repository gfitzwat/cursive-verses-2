import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AppPage from "./pages/AppPage";
import PracticePage from "./pages/PracticePage";
import PrivacyPage from "./pages/PrivacyPage";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/app" element={<AppPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/practice" element={<PracticePage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/privacy" element={<PrivacyPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
