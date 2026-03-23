import React, { useState } from 'react';
import { Heart, Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const MOCK_WELFARE = [
  {id:1,member:"Marie Claire Uwase",type:"illness",title:"Medical Support — Surgery Recovery",priority:"high",status:"in_progress",amountNeeded:150000,amountRaised:85000,assignee:"Jean Baptiste Mugisha",date:"2026-02-15"},
  {id:2,member:"Pierre Ndayisaba",type:"bereavement",title:"Bereavement Support — Mother's Passing",priority:"urgent",status:"open",amountNeeded:100000,amountRaised:0,assignee:null,date:"2026-02-20"},
];

export default function Welfare() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Welfare & Support</h1>
          <p className="text-sm text-text-muted">Member welfare cases and support tracking</p>
        </div>
        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all">
          <Heart size={18} /> Open Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-warning flex justify-center mb-2"><AlertCircle size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-warning">{MOCK_WELFARE.filter(w=>w.status==="open").length}</div>
          <div className="text-xs text-text-muted mt-1">Open Cases</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-info flex justify-center mb-2"><Clock size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-info">{MOCK_WELFARE.filter(w=>w.status==="in_progress").length}</div>
          <div className="text-xs text-text-muted mt-1">In Progress</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
          <div className="text-gold flex justify-center mb-2"><CheckCircle size={24} /></div>
          <div className="text-2xl font-black font-mono text-gold">RWF {MOCK_WELFARE.reduce((s,w)=>s+(w.amountNeeded||0),0).toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-1">Total Needed</div>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_WELFARE.map(w => (
          <div key={w.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-border-gold transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${w.priority === 'urgent' ? 'bg-error/10 text-error border border-error/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>{w.priority}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${w.status === 'open' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-info/10 text-info border border-info/20'}`}>{w.status.replace("_", " ")}</span>
                </div>
                <h3 className="font-cinzel font-bold text-lg mb-1">{w.title}</h3>
                <div className="text-sm text-text-muted">Member: <span className="text-text-secondary">{w.member}</span> · Type: <span className="text-text-secondary capitalize">{w.type.replace("_", " ")}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => alert('Opening update modal...')} className="px-3 py-1.5 border border-border-default rounded-lg text-xs font-bold text-text-secondary hover:text-gold transition-colors">Update</button>
                <button onClick={() => alert('Case resolved!')} className="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-bold hover:bg-success/20 transition-colors">Resolve</button>
              </div>
            </div>
            
            {w.amountNeeded > 0 && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-text-muted">Fundraising Progress</span>
                  <span className="text-xs font-bold text-gold font-mono">RWF {w.amountRaised.toLocaleString()} / {w.amountNeeded.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-gold transition-all duration-500" style={{width: `${(w.amountRaised/w.amountNeeded)*100}%`}} />
                </div>
                <div className="text-[10px] text-text-muted mt-2">{Math.round((w.amountRaised/w.amountNeeded)*100)}% raised · Reported: {w.date}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
