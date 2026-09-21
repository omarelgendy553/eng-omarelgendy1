import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import RobotScene from "./components/RobotScene";
import { AboutSection, SkillsSection, ContactSection } from "./components/Sections";
import { OrderForm, ComplaintForm } from "./components/Forms";
import WhatsAppButton from "./components/WhatsAppButton";
import AIChat from "./components/AIChat";
import ConsentModal from "./components/ConsentModal";
import AdminRoute from "./admin/AdminRoute";

function MainSite() {
  return (
    <div id="top" className="bg-void min-h-screen">
      <Navbar />
      <RobotScene />
      <AboutSection />
      <SkillsSection />
      <OrderForm />
      <ComplaintForm />
      <ContactSection />
      <WhatsAppButton />
      <AIChat />
      <ConsentModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}
