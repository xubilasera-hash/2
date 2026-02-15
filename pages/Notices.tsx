
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Notice } from '../types';
import { FileText, Download, ExternalLink } from 'lucide-react';

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setNotices(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Notices & Documents</h1>
        <p className="text-slate-500 mt-2">Official updates and downloadable PDFs.</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid gap-6">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:border-blue-200 transition-colors group">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{notice.description}</p>
                  <p className="text-slate-400 text-xs mt-4">
                    Posted on {new Date(notice.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={notice.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-medium"
              >
                <span>View PDF</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No notices posted yet.</p>
        </div>
      )}
    </div>
  );
};

export default Notices;
