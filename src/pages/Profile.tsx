import React, { useState } from 'react';
import { User, Lock, Monitor, Camera } from 'lucide-react';

export default function Profile() {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: "Laurent Niyigena", phone: "+250 788 000 001", bio: "System administrator for INHERITANCE CHOIR management system." });
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">My Profile</h1>
        <p className="text-sm text-text-muted">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-2 mb-6 bg-bg-elevated p-1.5 rounded-xl w-fit">
        {[{id:"profile",label:"Profile Info",icon:User},{id:"security",label:"Security",icon:Lock},{id:"sessions",label:"Active Sessions",icon:Monitor}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border-subtle">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold font-cinzel text-3xl border-2 border-gold">
                {form.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-bg-elevated border border-border-default rounded-full flex items-center justify-center text-text-muted hover:text-gold transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-cinzel font-bold text-text-primary mb-1">{form.name}</h2>
              <div className="text-sm text-text-muted mb-2">laurentniyigena2@gmail.com</div>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gold/10 text-gold border border-gold/20">Admin</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-info/10 text-info border border-info/20">Tenor</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone Number</label>
                <input type="text" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="w-full p-2.5 bg-white/5 border border-border-subtle rounded-xl text-sm text-text-muted cursor-not-allowed">laurentniyigena2@gmail.com</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Bio</label>
              <textarea rows={3} value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none" />
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => alert('Profile updated successfully!')} className="gold-bg text-bg-base font-bold font-cinzel tracking-wide px-6 py-2.5 rounded-xl hover:brightness-110 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
          <h2 className="font-cinzel font-bold text-lg mb-4">Change Password</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Current Password</label>
              <input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm, current: e.target.value})} placeholder="Enter current password" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">New Password</label>
              <input type="password" value={pwForm.new} onChange={e=>setPwForm({...pwForm, new: e.target.value})} placeholder="Min 8 chars, uppercase, number, special" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm, confirm: e.target.value})} placeholder="Repeat new password" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
            <button onClick={() => alert('Password updated successfully!')} className="gold-bg text-bg-base font-bold font-cinzel tracking-wide px-6 py-2.5 rounded-xl hover:brightness-110 transition-all">Update Password</button>
          </div>

          <div className="pt-6 border-t border-border-subtle">
            <h2 className="font-cinzel font-bold text-lg mb-4">Account Security</h2>
            <div className="space-y-3">
              {[
                {label:"Login Count",val:"247"},
                {label:"Last Login",val:"Today at 08:30 AM"},
                {label:"Sessions",val:"2 active"},
                {label:"2FA",val:"Not enabled"},
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center p-3 bg-bg-elevated rounded-xl">
                  <span className="text-sm text-text-muted">{s.label}</span>
                  <span className="text-sm font-bold text-text-primary">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "sessions" && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
          <h2 className="font-cinzel font-bold text-lg mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {[
              {device:"Chrome on Windows",ip:"41.186.12.x",location:"Kigali, Rwanda",time:"Current",current:true},
              {device:"Mobile App on Android",ip:"196.45.3.x",location:"Kigali, Rwanda",time:"2h ago",current:false},
            ].map((s,i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${s.current ? 'bg-success/5 border-success/20' : 'bg-bg-elevated border-border-subtle'}`}>
                <div>
                  <div className="text-sm font-bold text-text-primary mb-1">{s.device}</div>
                  <div className="text-xs text-text-muted">{s.ip} · {s.location} · {s.time}</div>
                </div>
                {s.current ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-success/10 text-success border border-success/20">Current</span>
                ) : (
                  <button onClick={() => alert('Session revoked!')} className="px-3 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-bold hover:bg-error/20 transition-colors">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
