
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { GalleryImage } from '../../types';
import { Trash2, Plus, Loader2, Image as ImageIcon, CheckCircle, Upload } from 'lucide-react';

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg(null);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('gallery').insert([{
        caption: caption || file.name,
        image_url: urlData.publicUrl
      }]);

      if (dbError) throw dbError;

      setMsg({ type: 'success', text: 'Image added to gallery!' });
      setCaption('');
      fetchImages();
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (img: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Note: In real scenarios, you'd also delete the file from Storage
      // But for simplicity we just remove the record
      const { error } = await supabase.from('gallery').delete().eq('id', img.id);
      if (error) throw error;
      setImages(images.filter(i => i.id !== img.id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Plus size={18} className="mr-2" /> Add New Image
        </h3>
        {msg && <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg.text}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Image Caption (optional)"
            className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          <label className="cursor-pointer bg-blue-600 text-white py-2 px-6 rounded-lg shadow-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <span>{uploading ? 'Processing...' : 'Select & Upload Image'}</span>
            <input type="file" className="sr-only" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square shadow-sm">
              <img src={img.image_url} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  onClick={() => deleteImage(img)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
