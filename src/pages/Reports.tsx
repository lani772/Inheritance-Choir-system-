import React, { useState } from 'react';
import { BarChart2, PieChart, TrendingUp, Users } from 'lucide-react';

export default function Reports() {
  const [reportType, setReportType] = useState("attendance");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Reports & Analytics</h1>
        <p className="text-sm text-text-muted">Data insights and performance reports</p>
      </div>

      <div className="flex gap-2 mb-6 bg-bg-elevated p-1.5 rounded-xl w-fit">
        {[{id:"attendance",label:"Attendance",icon:BarChart2},{id:"contributions",label:"Contributions",icon:TrendingUp},{id:"members",label:"Member Stats",icon:Users}].map(t => (
          <button key={t.id} onClick={()=>setReportType(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${reportType === t.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {reportType === "attendance" && (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-cinzel text-gold mb-1">87%</div>
              <div className="text-xs text-text-muted">Avg Attendance</div>
              <div className="text-[10px] font-bold text-success mt-2">+3% this month</div>
            </div>
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-cinzel text-success mb-1">8</div>
              <div className="text-xs text-text-muted">Perfect Attendance</div>
            </div>
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-cinzel text-error mb-1">2</div>
              <div className="text-xs text-text-muted">At Risk (&lt;70%)</div>
            </div>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Attendance by Member</h2>
            <div className="space-y-4">
              {[
                {name:"Jean Baptiste Mugisha",rate:98,color:"bg-success"},
                {name:"Agnès Niyomukunzi",rate:95,color:"bg-success"},
                {name:"Marie Claire Uwase",rate:92,color:"bg-success"},
                {name:"Paul Habimana",rate:88,color:"bg-warning"},
                {name:"Pierre Ndayisaba",rate:76,color:"bg-warning"},
              ].map(m => (
                <div key={m.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs shrink-0">{m.name.charAt(0)}</div>
                  <div className="w-40 text-sm font-medium truncate">{m.name}</div>
                  <div className="flex-1 h-2 bg-border-subtle rounded-full overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{width: `${m.rate}%`}} />
                  </div>
                  <div className="w-12 text-right text-sm font-bold font-mono">{m.rate}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === "contributions" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">6-Month Contribution Trend</h2>
            <div className="h-48 flex items-end justify-between gap-2 pt-4 border-b border-border-subtle pb-2">
              {[
                {month:"Sep",val:9800},
                {month:"Oct",val:11200},
                {month:"Nov",val:10400},
                {month:"Dec",val:14800},
                {month:"Jan",val:11000},
                {month:"Feb",val:12400},
              ].map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] font-mono text-text-muted">{Math.round(m.val/1000)}K</div>
                  <div className="w-full bg-gold rounded-t-md transition-all duration-500" style={{height: `${(m.val/15000)*100}%`}} />
                  <div className="text-[10px] text-text-muted">{m.month}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Top Contributors</h2>
            <div className="space-y-3">
              {[
                {name:"Jean Baptiste Mugisha",amount:3400},
                {name:"Agnès Niyomukunzi",amount:3100},
                {name:"Marie Claire Uwase",amount:2800},
                {name:"Paul Habimana",amount:2600},
                {name:"Emmanuel Bizimana",amount:2200},
              ].map((m,i) => (
                <div key={m.name} className={`flex items-center gap-3 p-2 rounded-lg ${i===0 ? 'bg-gold/10 border border-gold/20' : ''}`}>
                  <div className={`w-6 text-center text-xs font-bold font-mono ${i===0 ? 'text-gold' : 'text-text-muted'}`}>#{i+1}</div>
                  <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary font-bold text-xs shrink-0">{m.name.charAt(0)}</div>
                  <div className="flex-1 text-sm font-medium">{m.name.split(" ")[0]}</div>
                  <div className="text-sm font-bold font-mono text-success">RWF {m.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === "members" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Member Status</h2>
            <div className="space-y-4">
              {[
                {label:"Active",val:7,color:"bg-success"},
                {label:"On Leave",val:1,color:"bg-warning"},
                {label:"Inactive",val:0,color:"bg-error"},
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary w-20">{s.label}</span>
                  <div className="flex-1 h-2 bg-border-subtle rounded-full mx-4 overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{width: `${(s.val/9)*100}%`}} />
                  </div>
                  <span className={`text-sm font-bold w-6 text-right ${s.color.replace('bg-', 'text-')}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Gender Distribution</h2>
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-pink" strokeDasharray={`${(4/9)*251} 251`} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-info" strokeDasharray={`${(5/9)*251} 251`} strokeDashoffset={`-${(4/9)*251}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black font-mono">9</span>
                  <span className="text-[8px] text-text-muted uppercase">Total</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm text-text-secondary">Male: 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink" />
                  <span className="text-sm text-text-secondary">Female: 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
