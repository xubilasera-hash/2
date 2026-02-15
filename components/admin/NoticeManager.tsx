
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Notice } from '../../types';
import { Trash2, Plus, Loader2, FileText, Upload, CheckCircle } from 'lucide-react';

const NoticeManager: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (data) setNotices(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form.title) {
      alert('Please enter a title before uploading');
      return;
    }

    setUploading(true);
    setMsg(null);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `notices/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('notices')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('notices').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('notices').insert([{
        title: form.title,
        description: form.description,
        pdf_url: urlData.publicUrl
      }]);

      if (dbError) throw dbError;

      setMsg({ type: 'success', text: 'Notice published successfully!' });
      setForm({ title: '', description: '' });
      fetchNotices();
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const deleteNotice = async (notice: Notice) => {
    if (!confirm('Delete this notice permanently?')) return;

    try {
      const { error } = await supabase.from('notices').delete().eq('id', notice.id);
      if (error) throw error;
      setNotices(notices.filter(n => n.id !== notice.id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Plus size={18} className="mr-2" /> Post New Notice
        </h3>
        {msg && <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg.text}</div>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Notice Title"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Short description (optional)"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <label className="cursor-pointer bg-red-600 text-white py-3 px-6 rounded-lg shadow-sm font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <span>{uploading ? 'Uploading PDF...' : 'Select PDF & Publish'}</span>
            <input type="file" className="sr-only" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="truncate">
                  <h4 className="font-semibold text-slate-900 truncate">{notice.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{notice.description || 'No description'}</p>
                </div>
              </div>
              <button
                onClick={() => deleteNotice(notice)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors ml-4"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeManager;
