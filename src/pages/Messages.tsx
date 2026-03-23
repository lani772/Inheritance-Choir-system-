import React, { useState } from 'react';
import { MessageSquare, Edit, Reply, Forward } from 'lucide-react';

const MOCK_MESSAGES = [
  {id:1,from:"Jean Baptiste Mugisha",subject:"Rehearsal Schedule Update",preview:"The rehearsal schedule for next week has been updated...",time:"2h ago",unread:true},
  {id:2,from:"Marie Claire Uwase",subject:"Welfare Committee Meeting",preview:"The welfare committee meeting has been postponed...",time:"5h ago",unread:true},
  {id:3,from:"Paul Habimana",subject:"Monthly Attendance Report",preview:"Monthly attendance report is ready for review...",time:"1d ago",unread:false},
];

export default function Messages() {
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState("");

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <button onClick={() => alert('Opening message composer...')} className="gold-bg text-bg-base font-bold font-cinzel tracking-wide py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2">
          <Edit size={16} /> Compose Message
        </button>
        <div className="bg-bg-card border border-border-subtle rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center">
            <span className="font-cinzel font-bold text-sm">Inbox</span>
            <span className="text-xs text-gold">{MOCK_MESSAGES.filter(m=>m.unread).length} unread</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {MOCK_MESSAGES.map(m => (
              <div key={m.id} onClick={()=>setSelected(m)} className={`p-4 cursor-pointer border-b border-border-subtle border-l-4 transition-all ${selected?.id === m.id ? 'bg-gold/5 border-l-gold' : 'border-l-transparent hover:bg-white/5'}`}>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm ${m.unread ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>{m.from}</span>
                  <span className="text-xs text-text-muted">{m.time}</span>
                </div>
                <div className={`text-xs mb-1 ${m.unread ? 'font-semibold text-text-secondary' : 'text-text-muted'}`}>{m.subject}</div>
                <div className="text-xs text-text-muted truncate">{m.preview}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="p-5 border-b border-border-subtle flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold font-cinzel">
                {selected.from.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-text-primary">{selected.subject}</div>
                <div className="text-xs text-text-muted">From: {selected.from} · {selected.time}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => alert('Replying to message...')} className="p-2 border border-border-default rounded-lg text-text-muted hover:text-gold transition-colors"><Reply size={16} /></button>
                <button onClick={() => alert('Forwarding message...')} className="p-2 border border-border-default rounded-lg text-text-muted hover:text-gold transition-colors"><Forward size={16} /></button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-bg-elevated rounded-2xl rounded-tl-sm p-4 max-w-2xl text-sm text-text-secondary leading-relaxed">
                {selected.preview}
              </div>
            </div>
            <div className="p-4 border-t border-border-subtle flex gap-3">
              <input 
                value={reply} 
                onChange={e=>setReply(e.target.value)} 
                placeholder="Type your reply..."
                className="flex-1 py-2.5 px-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
              />
              <button onClick={() => { alert('Message sent!'); setReply(''); }} className="gold-bg text-bg-base font-bold px-6 rounded-xl hover:brightness-110 transition-all">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <MessageSquare size={48} className="opacity-20 mb-4" />
            <p>Select a conversation to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
