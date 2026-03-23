import React, { useState } from 'react';
import { Shield, Check, X, Bell, FileText, Loader2 } from 'lucide-react';

const MOCK_PENDING = [
  {id:1,name:"Grace Uwimana",email:"grace.uwi@gmail.com",voice:"Soprano",date:"2026-02-20",verified:true,phone:"+250 788 999 001"},
  {id:2,name:"Alexis Nkundimana",email:"alexis.nkundi@gmail.com",voice:"Tenor",date:"2026-02-21",verified:true,phone:"+250 788 999 002"},
];

export default function Admin() {
  const [tab, setTab] = useState("registrations");
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const handleSendReminder = async () => {
    if (!emailSubject || !emailBody) {
      alert('Please enter both subject and message body.');
      return;
    }
    
    setEmailSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'laurentniyigena1@gmail.com', // Sending to the user's email for testing
          subject: emailSubject,
          text: emailBody,
        })
      });
      
      if (response.ok) {
        alert('Reminder email sent successfully!');
        setEmailSubject('');
        setEmailBody('');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the email.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Admin Control Panel</h1>
        <p className="text-sm text-text-muted">System administration · User management · Audit trail</p>
      </div>

      <div className="flex gap-2 mb-6 bg-bg-elevated p-1.5 rounded-xl w-fit">
        {[{id:"registrations",label:"Pending Registrations",icon:Shield},{id:"reminders",label:"Send Reminders",icon:Bell},{id:"audit",label:"Audit Log",icon:FileText}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "registrations" && (
        <div className="grid gap-4">
          {MOCK_PENDING.map(reg => (
            <div key={reg.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 flex items-center gap-4 hover:border-border-gold transition-colors">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold font-cinzel text-lg">
                {reg.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-primary mb-1">{reg.name}</h3>
                <div className="text-xs text-text-muted mb-2">{reg.email} · {reg.phone}</div>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${reg.voice === 'Soprano' ? 'bg-pink/10 text-pink border border-pink/20' : reg.voice === 'Alto' ? 'bg-violet/10 text-violet border border-violet/20' : reg.voice === 'Tenor' ? 'bg-info/10 text-info border border-info/20' : 'bg-success/10 text-success border border-success/20'}`}>{reg.voice}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${reg.verified ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>{reg.verified ? '✅ Email Verified' : '⚠️ Not Verified'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/5 text-text-muted border border-border-subtle">Applied: {reg.date}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => alert('Registration rejected.')} className="flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-bold hover:bg-error/20 transition-colors"><X size={14} /> Reject</button>
                <button onClick={() => alert('Registration approved!')} className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-bold hover:bg-success/20 transition-colors"><Check size={14} /> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reminders" && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 max-w-2xl">
          <h2 className="font-cinzel font-bold text-lg mb-4">Send Email Reminder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Recipients</label>
              <select className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                <option>All Active Members (47)</option>
                <option>Soprano Section (14)</option>
                <option>Alto Section (11)</option>
                <option>Tenor Section (13)</option>
                <option>Bass Section (9)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Subject</label>
              <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="e.g. Rehearsal Reminder — Sunday 9 AM" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Message Body</label>
              <textarea rows={5} value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Write your reminder message here..." className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none" />
            </div>
            <button onClick={handleSendReminder} disabled={emailSending} className="w-full py-3 gold-bg text-bg-base font-bold font-cinzel tracking-wide rounded-xl hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
              {emailSending ? <Loader2 size={18} className="animate-spin" /> : <><Bell size={18} /> Send Reminder Email</>}
            </button>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle">
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Action</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Resource</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">IP Address</th>
                <th className="py-3 px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {[
                {user:"laurentniyigena2@gmail.com",action:"login_success",resource:"auth",ip:"41.186.12.x",time:"08:30:12",type:"success"},
                {user:"jean.baptiste@choir.rw",action:"attendance_marked",resource:"attendance/1",ip:"196.45.3.x",time:"08:15:40",type:"info"},
                {user:"unknown",action:"login_failed",resource:"auth",ip:"92.168.0.x",time:"02:14:33",type:"danger"},
              ].map((log,i) => (
                <tr key={i} className="border-b border-border-subtle hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-xs text-text-secondary">{log.user.split("@")[0]}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${log.type === 'success' ? 'bg-success/10 text-success border border-success/20' : log.type === 'danger' ? 'bg-error/10 text-error border border-error/20' : 'bg-info/10 text-info border border-info/20'}`}>{log.action.replace(/_/g, " ")}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-text-muted">{log.resource}</td>
                  <td className="py-3 px-4 text-xs font-mono text-text-muted">{log.ip}</td>
                  <td className="py-3 px-4 text-xs font-mono text-text-muted">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
