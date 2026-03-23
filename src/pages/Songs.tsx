import React, { useState, useEffect, useRef } from 'react';
import { Music, Plus, Search, Filter, Upload, FileText, FileAudio, Trash2, Download, X, Loader2, File } from 'lucide-react';

interface SongFile {
  id: string;
  song_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  uploaded_at: string;
}

interface Song {
  id: string;
  title: string;
  composer: string | null;
  notes: string | null;
  created_at: string;
  files: SongFile[];
}

export default function Songs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [newSongData, setNewSongData] = useState({
    title: '',
    composer: '',
    notes: ''
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState('sheet_music');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      if (response.ok) {
        const data = await response.json();
        setSongs(data);
      }
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSongData)
      });
      
      if (response.ok) {
        const { song } = await response.json();
        setSongs([song, ...songs]);
        setIsAddModalOpen(false);
        setNewSongData({ title: '', composer: '', notes: '' });
      }
    } catch (error) {
      console.error('Failed to add song:', error);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    
    try {
      const response = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSongs(songs.filter(s => s.id !== id));
        if (selectedSong?.id === id) setIsDetailsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedSong) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', uploadType);
    
    setUploading(true);
    try {
      const response = await fetch(`/api/songs/${selectedSong.id}/files`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const { file: newFile } = await response.json();
        
        const updatedSong = {
          ...selectedSong,
          files: [...selectedSong.files, newFile]
        };
        
        setSelectedSong(updatedSong);
        setSongs(songs.map(s => s.id === selectedSong.id ? updatedSong : s));
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedSong || !confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`/api/songs/files/${fileId}`, { method: 'DELETE' });
      if (response.ok) {
        const updatedSong = {
          ...selectedSong,
          files: selectedSong.files.filter(f => f.id !== fileId)
        };
        
        setSelectedSong(updatedSong);
        setSongs(songs.map(s => s.id === selectedSong.id ? updatedSong : s));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const shown = songs.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    (s.composer && s.composer.toLowerCase().includes(search.toLowerCase()))
  );

  const getFileIcon = (type: string) => {
    if (type === 'sheet_music') return <FileText size={16} className="text-info" />;
    if (type === 'recording') return <FileAudio size={16} className="text-success" />;
    return <File size={16} className="text-text-muted" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Song Library</h1>
          <p className="text-sm text-text-muted">{songs.length} songs in repertoire</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all">
          <Plus size={18} /> Add Song
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search songs by title or composer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        ) : shown.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            No songs found. Create one to get started.
          </div>
        ) : (
          shown.map(s => (
            <div key={s.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-border-gold transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-cinzel font-bold text-lg">{s.title}</h3>
                <button onClick={() => handleDeleteSong(s.id)} className="text-text-muted hover:text-error transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-sm text-text-muted mb-3 flex-1">
                {s.composer ? `by ${s.composer}` : 'Unknown Composer'}
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  <span>{s.files.filter(f => f.file_type === 'sheet_music').length} Sheets</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileAudio size={14} />
                  <span>{s.files.filter(f => f.file_type === 'recording').length} Audio</span>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedSong(s); setIsDetailsModalOpen(true); }}
                className="w-full py-2 bg-bg-elevated border border-border-default rounded-lg text-xs font-bold hover:bg-white/5 transition-colors"
              >
                Manage Files & Details
              </button>
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-subtle">
              <h2 className="font-cinzel font-bold text-lg">Add New Song</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSong} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Song Title</label>
                <input required type="text" value={newSongData.title} onChange={e => setNewSongData({...newSongData, title: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Composer / Arranger</label>
                <input type="text" value={newSongData.composer} onChange={e => setNewSongData({...newSongData, composer: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                <textarea rows={3} value={newSongData.notes} onChange={e => setNewSongData({...newSongData, notes: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 gold-bg text-bg-base rounded-xl text-sm font-bold hover:brightness-110 transition-all">Add Song</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedSong && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-5 border-b border-border-subtle">
              <div>
                <h2 className="font-cinzel font-bold text-xl mb-1">{selectedSong.title}</h2>
                <p className="text-sm text-text-muted">{selectedSong.composer ? `by ${selectedSong.composer}` : 'Unknown Composer'}</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {selectedSong.notes && (
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Director's Notes</h3>
                  <div className="bg-bg-elevated border border-border-subtle rounded-xl p-4 text-sm whitespace-pre-wrap">
                    {selectedSong.notes}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Files & Resources</h3>
                  
                  <div className="flex gap-2">
                    <select 
                      value={uploadType} 
                      onChange={(e) => setUploadType(e.target.value)}
                      className="bg-bg-input border border-border-default rounded-lg text-xs px-2 py-1.5 outline-none focus:border-gold"
                    >
                      <option value="sheet_music">Sheet Music</option>
                      <option value="recording">Recording</option>
                      <option value="other">Other</option>
                    </select>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                      accept={uploadType === 'recording' ? 'audio/*' : uploadType === 'sheet_music' ? '.pdf,.doc,.docx,image/*' : '*/*'}
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/20 rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-gold/20 transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Upload
                    </button>
                  </div>
                </div>

                {selectedSong.files.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border-subtle rounded-xl text-text-muted text-sm">
                    No files uploaded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSong.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-bg-elevated border border-border-subtle rounded-xl hover:border-border-default transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-bg-card rounded-lg shrink-0">
                            {getFileIcon(file.file_type)}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium truncate">{file.file_name}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{file.file_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <a 
                            href={file.file_path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 text-text-muted hover:text-info transition-colors rounded-lg hover:bg-white/5"
                            title="Download"
                          >
                            <Download size={16} />
                          </a>
                          <button 
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1.5 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-white/5"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
