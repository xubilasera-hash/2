
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Identity } from '../types';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const PublicHome: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdentity();
  }, []);

  const fetchIdentity = async () => {
    const { data, error } = await supabase.from('identity').select('*').single();
    if (data) setIdentity(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-200 rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-slate-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img
            src={identity?.logo_url || 'https://picsum.photos/300/300'}
            alt="Logo"
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
          />
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
            {identity?.full_name || 'Your Name'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-600 font-medium mb-6">
            {identity?.title || 'Professional Title'}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            {identity?.email && (
              <a href={`mailto:${identity.email}`} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                <Mail size={18} className="mr-2" /> {identity.email}
              </a>
            )}
            {identity?.github_url && (
              <a href={identity.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                <Github size={18} className="mr-2" /> GitHub
              </a>
            )}
            {identity?.linkedin_url && (
              <a href={identity.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                <Linkedin size={18} className="mr-2" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 prose prose-slate max-w-none">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-8 h-1 bg-blue-600 mr-4 rounded"></span>
          About Me
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
          {identity?.bio || 'Add your bio in the admin dashboard to tell the world about yourself.'}
        </p>
      </div>
    </div>
  );
};

export default PublicHome;
