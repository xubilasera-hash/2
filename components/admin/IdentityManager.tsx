
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Identity } from '../../types';
// Added User icon to the import list from lucide-react
import { Save, Upload, Loader2, CheckCircle, User } from 'lucide-react';

const IdentityManager: React.FC = () => {
  const [identity, setIdentity] = useState<Identity>({
    full_name: '',
    title: '',
    bio: '',
    logo_url: '',
    email: '',
    github_url: '',
    linkedin_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchIdentity();
  }, []);

  const fetchIdentity = async () => {
    try {
      const { data, error } = await supabase.from('identity').select('*').single();
      if (data) setIdentity(data);
    } catch (error) {
      console.error('Error fetching identity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('identity')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('identity').getPublicUrl(filePath);
      setIdentity(prev => ({ ...prev, logo_url: data.publicUrl }));
      setMsg({ type: 'success', text: 'Logo uploaded! Don\'t forget to save changes.' });
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      // Check if record exists
      const { count } = await supabase.from('identity').select('*', { count: 'exact', head: true });
      
      let error;
      if (count && count > 0) {
        ({ error } = await supabase.from('identity').update(identity).eq('id', identity.id));
      } else {
        ({ error } = await supabase.from('identity').insert([identity]));
      }

      if (error) throw error;
      setMsg({ type: 'success', text: 'Settings updated successfully!' });
      fetchIdentity();
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : null}
          <span className="text-sm font-medium">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <input
            type="text"
            value={identity.full_name}
            onChange={e => setIdentity({ ...identity, full_name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Title / Role</label>
          <input
            type="text"
            value={identity.title}
            onChange={e => setIdentity({ ...identity, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Senior Creative Designer"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Bio / About</label>
        <textarea
          value={identity.bio}
          onChange={e => setIdentity({ ...identity, bio: e.target.value })}
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          placeholder="Tell your story..."
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">Identity Logo / Profile Pic</label>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
            {identity.logo_url ? (
              <img src={identity.logo_url} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <User size={32} />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <label className="relative cursor-pointer bg-white py-2 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center space-x-2">
              <Upload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload New Logo'}</span>
              <input type="file" className="sr-only" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
            </label>
            <p className="mt-1 text-xs text-slate-400">JPG, PNG or SVG. Max 2MB.</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <input
            type="email"
            value={identity.email}
            onChange={e => setIdentity({ ...identity, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
          <input
            type="url"
            value={identity.github_url}
            onChange={e => setIdentity({ ...identity, github_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
          <input
            type="url"
            value={identity.linkedin_url}
            onChange={e => setIdentity({ ...identity, linkedin_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default IdentityManager;
