import React, { useState } from 'react';
import { Megaphone, Pin, Plus } from 'lucide-react';

const MOCK_POSTS = [
  {id:1,title:"Easter Concert 2026 — Registration Open",type:"announcement",author:"Jean Baptiste Mugisha",date:"2026-02-20",views:34,pinned:true,content:"Registration for our annual Easter Concert is now open. All members are encouraged to participate. Practice sessions will begin March 1st."},
  {id:2,title:"Prayer Request — Brother Emmanuel",type:"prayer_request",author:"Marie Claire Uwase",date:"2026-02-18",views:21,pinned:false,content:"Please keep Brother Emmanuel and his family in your prayers as he recovers from surgery. Visit and support is welcomed."},
];

export default function Posts() {
  const [filter, setFilter] = useState("all");

  const shown = filter === "all" ? MOCK_POSTS : MOCK_POSTS.filter(p => p.type === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Posts & Announcements</h1>
          <p className="text-sm text-text-muted">Choir announcements, prayer requests & news</p>
        </div>
        <button onClick={() => alert('Opening new post modal...')} className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all">
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all","announcement","prayer_request","praise_report","reminder","news"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-gold/10 text-gold border border-gold' : 'bg-transparent text-text-muted border border-border-subtle hover:bg-white/5'}`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {shown.map(p => (
          <div key={p.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 flex gap-4 items-start hover:border-border-gold transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${p.type === 'announcement' ? 'bg-info/10 text-info border border-info/20' : 'bg-violet/10 text-violet border border-violet/20'}`}>
              <Megaphone size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  {p.pinned && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full mr-2 mb-1"><Pin size={10} /> PINNED</span>}
                  <h3 className="font-cinzel font-bold text-lg inline">{p.title}</h3>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap ml-4">{p.date}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">{p.content}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="font-medium text-text-primary">{p.author}</span>
                <span>·</span>
                <span>{p.views} views</span>
                <span className="ml-auto capitalize px-2.5 py-0.5 rounded-full bg-bg-elevated border border-border-default">{p.type.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
