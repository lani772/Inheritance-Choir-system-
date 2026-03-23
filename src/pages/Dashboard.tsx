import { Users, CalendarDays, DollarSign, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { icon: Users, label: "Active Members", value: "47", sub: "9 online now", color: "text-violet", bg: "bg-violet/10", border: "border-violet/20" },
    { icon: CalendarDays, label: "Upcoming Events", value: "4", sub: "Next: Tomorrow 9AM", color: "text-info", bg: "bg-info/10", border: "border-info/20" },
    { icon: DollarSign, label: "Feb Contributions", value: "RWF 12.4K", sub: "↑ 12% vs January", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { icon: CheckCircle, label: "Avg Attendance", value: "87%", sub: "This month — 47 events", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-5 bg-gradient-to-br from-gold/5 to-transparent border border-border-gold rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Good morning, Laurent 👋</h1>
          <p className="text-sm text-text-secondary">Sunday, February 22, 2026 · 3 pending registrations await your review</p>
        </div>
        <button className="gold-bg text-bg-base border-none font-bold font-cinzel tracking-wide px-5 py-2.5 rounded-xl hover:brightness-110 transition-all">
          Review Now →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative overflow-hidden p-5 bg-bg-card border border-border-subtle rounded-2xl hover:border-border-gold hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all cursor-default">
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[80px] ${s.bg} opacity-50`} />
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.border} border flex items-center justify-center ${s.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={`text-3xl font-black font-cinzel mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs font-bold text-text-primary mb-0.5">{s.label}</div>
              <div className="text-[11px] text-text-muted">{s.sub}</div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
         <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Recent Activity</h2>
            <div className="text-text-muted text-sm flex items-center justify-center h-40 border border-dashed border-border-subtle rounded-xl">
              Activity feed will appear here
            </div>
         </div>
         <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="font-cinzel font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-bg-elevated border border-border-subtle rounded-xl text-left hover:border-gold/50 transition-colors">
                <Users className="text-violet mb-2" size={24} />
                <div className="font-bold text-sm">Add Member</div>
                <div className="text-xs text-text-muted mt-1">Register a new choir member</div>
              </button>
              <button className="p-4 bg-bg-elevated border border-border-subtle rounded-xl text-left hover:border-gold/50 transition-colors">
                <CalendarDays className="text-info mb-2" size={24} />
                <div className="font-bold text-sm">Schedule Event</div>
                <div className="text-xs text-text-muted mt-1">Create a rehearsal or performance</div>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
