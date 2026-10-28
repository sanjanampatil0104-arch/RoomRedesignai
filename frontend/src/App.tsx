import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { HomePage } from './pages/HomePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { StylesPage } from './pages/StylesPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('hf_api_key') || '';
  });

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('hf_api_key', key);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1E1B]">
        {/* Navigation Bar */}
        <Navbar
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasCustomKey={Boolean(apiKey.trim())}
        />

        {/* Main Content Router */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/redesign" element={<WorkspacePage apiKeyOverride={apiKey} />} />
            <Route path="/styles" element={<StylesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* AI Engine & Hugging Face Key Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
