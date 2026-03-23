import React, { useState } from 'react';
import { Plus, DollarSign, Search, Filter, X, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Contribution {
  id: string;
  member: string;
  type: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
}

const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: '1', member: 'Jean Baptiste Mugisha', type: 'Tithe', amount: 25000, date: '2026-02-15', method: 'Mobile Money', reference: 'MTN-12345' },
  { id: '2', member: 'Marie Claire Uwase', type: 'Offering', amount: 5000, date: '2026-02-15', method: 'Cash', reference: '-' },
  { id: '3', member: 'Paul Habimana', type: 'Special Gift', amount: 50000, date: '2026-02-10', method: 'Bank Transfer', reference: 'BK-98765' },
];

export default function Contributions() {
  const [contributions, setContributions] = useState<Contribution[]>(MOCK_CONTRIBUTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [contributionTypes, setContributionTypes] = useState(['Tithe', 'Offering', 'Special Gift', 'Welfare', 'Building Fund', 'Missions Offering']);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  const [formData, setFormData] = useState({
    member: '',
    type: 'Tithe',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    method: 'Mobile Money',
    reference: ''
  });

  const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
  const tithesTotal = contributions.filter(c => c.type === 'Tithe').reduce((sum, c) => sum + c.amount, 0);
  const offeringsTotal = contributions.filter(c => c.type === 'Offering').reduce((sum, c) => sum + c.amount, 0);

  const filteredContributions = contributions.filter(c => {
    const matchesSearch = c.member.toLowerCase().includes(search.toLowerCase()) || c.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || c.type === filterType;
    const matchesMethod = filterMethod === 'All' || c.method === filterMethod;
    const matchesStartDate = !filterStartDate || new Date(c.date) >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || new Date(c.date) <= new Date(filterEndDate);
    return matchesSearch && matchesType && matchesMethod && matchesStartDate && matchesEndDate;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Member', 'Type', 'Amount', 'Method', 'Reference'];
    const csvData = filteredContributions.map(c => [
      c.date, 
      `"${c.member}"`, 
      `"${c.type}"`, 
      c.amount, 
      `"${c.method}"`, 
      `"${c.reference}"`
    ].join(','));
    const csvString = [headers.join(','), ...csvData].join('\\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contributions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddCustomType = () => {
    const newType = prompt('Enter new contribution type:');
    if (newType && newType.trim() !== '' && !contributionTypes.includes(newType.trim())) {
      setContributionTypes([...contributionTypes, newType.trim()]);
      setFormData({ ...formData, type: newType.trim() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContributions([{ ...formData, id: Date.now().toString(), amount: Number(formData.amount) }, ...contributions]);
    setIsModalOpen(false);
    setFormData({ member: '', type: 'Tithe', amount: '', date: format(new Date(), 'yyyy-MM-dd'), method: 'Mobile Money', reference: '' });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Contributions</h1>
          <p className="text-sm text-text-muted">Manage tithes, offerings, and financial records</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-bg-elevated border border-border-default text-text-primary font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all"
          >
            <Plus size={18} /> Record Contribution
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-success flex justify-center mb-2"><DollarSign size={24} /></div>
          <div className="text-2xl font-black font-mono text-success">RWF {totalAmount.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-1">Total This Month</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-gold flex justify-center mb-2"><DollarSign size={24} /></div>
          <div className="text-2xl font-black font-mono text-gold">RWF {tithesTotal.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-1">Tithes</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-violet flex justify-center mb-2"><DollarSign size={24} /></div>
          <div className="text-2xl font-black font-mono text-violet">RWF {offeringsTotal.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-1">Offerings</div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text"
              placeholder="Search members or references..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-9 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm transition-colors ${showFilters ? 'bg-gold/10 border-gold text-gold' : 'bg-bg-input border-border-default text-text-secondary hover:text-gold'}`}
          >
            <Filter size={16} /> Filter
          </button>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-border-subtle bg-bg-elevated grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full p-2 bg-bg-input border border-border-default rounded-lg text-sm outline-none focus:border-gold">
                <option value="All">All Types</option>
                {contributionTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Method</label>
              <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} className="w-full p-2 bg-bg-input border border-border-default rounded-lg text-sm outline-none focus:border-gold">
                <option value="All">All Methods</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Start Date</label>
              <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full p-2 bg-bg-input border border-border-default rounded-lg text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">End Date</label>
              <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full p-2 bg-bg-input border border-border-default rounded-lg text-sm outline-none focus:border-gold" />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle">
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Member</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Method</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Reference</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.length > 0 ? (
                filteredContributions.map(c => (
                  <tr key={c.id} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-text-secondary">{format(new Date(c.date), 'MMM d, yyyy')}</td>
                    <td className="py-3 px-4 font-semibold text-sm">{c.member}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.type === 'Tithe' ? 'bg-gold/10 text-gold border border-gold/20' : 
                        c.type === 'Offering' ? 'bg-violet/10 text-violet border border-violet/20' : 
                        'bg-info/10 text-info border border-info/20'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-success">RWF {c.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{c.method}</td>
                    <td className="py-3 px-4 text-xs font-mono text-text-muted">{c.reference}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted text-sm">
                    No contributions found.
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
              <h2 className="font-cinzel font-bold text-lg">Record Contribution</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Member Name</label>
                <input required type="text" value={formData.member} onChange={e => setFormData({...formData, member: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" placeholder="e.g. Jean Baptiste" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Type</label>
                    <button type="button" onClick={handleAddCustomType} className="text-[10px] text-gold hover:underline">Add Custom Type</button>
                  </div>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                    {contributionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Amount (RWF)</label>
                  <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Method</label>
                  <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                    <option>Mobile Money</option><option>Cash</option><option>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Reference (Optional)</label>
                <input type="text" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" placeholder="e.g. MTN-12345" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 gold-bg text-bg-base rounded-xl text-sm font-bold hover:brightness-110 transition-all">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
