
import React, { useState } from 'react';
import { User, Image as ImageIcon, FileText, Settings, LayoutDashboard } from 'lucide-react';
import IdentityManager from '../components/admin/IdentityManager';
import GalleryManager from '../components/admin/GalleryManager';
import NoticeManager from '../components/admin/NoticeManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identity' | 'gallery' | 'notices'>('identity');

  const tabs = [
    { id: 'identity', label: 'Identity Settings', icon: User },
    { id: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
    { id: 'notices', label: 'Notices & PDFs', icon: FileText },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 overflow-hidden">
            <h2 className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Admin Menu
            </h2>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                LIVE CONNECTION
              </div>
            </div>

            {activeTab === 'identity' && <IdentityManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'notices' && <NoticeManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
