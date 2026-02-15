
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Image as ImageIcon, FileText, Settings, LayoutDashboard, Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import PublicHome from './pages/PublicHome';
import Gallery from './pages/Gallery';
import Notices from './pages/Notices';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} Identity Pro. Built with React & Supabase.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
