import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  voice: string;
  role: string;
  status: string;
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Jean Baptiste Mugisha', email: 'jean@choir.rw', voice: 'Tenor', role: 'President', status: 'Active' },
  { id: '2', name: 'Marie Claire Uwase', email: 'marie@choir.rw', voice: 'Soprano', role: 'Member', status: 'Active' },
  { id: '3', name: 'Paul Habimana', email: 'paul@choir.rw', voice: 'Bass', role: 'Secretary', status: 'Active' },
];

export default function Members() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    voice: 'Soprano',
    role: 'Member',
    status: 'Active'
  });

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ name: '', email: '', voice: 'Soprano', role: 'Member', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...formData, id: m.id } : m));
    } else {
      setMembers([...members, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Member Directory</h1>
          <p className="text-sm text-text-muted">{members.length} total members</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search members..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle">
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Voice</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <tr key={member.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-sm">{member.name}</div>
                      <div className="text-xs text-text-muted">{member.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 border border-border-subtle">
                        {member.voice}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{member.role}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-success/10 text-success border border-success/20' : 'bg-border-subtle text-text-muted'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(member)} className="p-1.5 text-text-muted hover:text-gold transition-colors rounded-lg hover:bg-white/5">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-1.5 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-white/5">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted text-sm">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-subtle">
              <h2 className="font-cinzel font-bold text-lg">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Voice Part</label>
                  <select value={formData.voice} onChange={e => setFormData({...formData, voice: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                    <option>Soprano</option><option>Alto</option><option>Tenor</option><option>Bass</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                    <option>Active</option><option>Inactive</option><option>On Leave</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                  <option>Member</option><option>Section Leader</option><option>Secretary</option><option>President</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 gold-bg text-bg-base rounded-xl text-sm font-bold hover:brightness-110 transition-all">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
