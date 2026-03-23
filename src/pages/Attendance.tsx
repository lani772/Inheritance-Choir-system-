import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, XCircle, Save, Search } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  voice: string;
  attendanceRate: number;
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Jean Baptiste Mugisha', voice: 'Tenor', attendanceRate: 98 },
  { id: '2', name: 'Marie Claire Uwase', voice: 'Soprano', attendanceRate: 92 },
  { id: '3', name: 'Paul Habimana', voice: 'Bass', attendanceRate: 88 },
  { id: '4', name: 'Agnès Niyomukunzi', voice: 'Alto', attendanceRate: 95 },
  { id: '5', name: 'Pierre Ndayisaba', voice: 'Tenor', attendanceRate: 76 },
];

const MOCK_EVENTS = [
  { id: '1', title: 'Sunday Morning Rehearsal', date: '2026-02-22' },
  { id: '2', title: 'Easter Concert Practice', date: '2026-02-25' },
];

type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent' | null;

export default function Attendance() {
  const [selectedEvent, setSelectedEvent] = useState(MOCK_EVENTS[0].id);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [search, setSearch] = useState('');

  const handleStatusChange = (memberId: string, status: AttendanceStatus) => {
    setRecords(prev => ({ ...prev, [memberId]: status }));
  };

  const handleSave = () => {
    console.log('Saving attendance for event', selectedEvent, records);
    alert('Attendance saved successfully!');
  };

  const markAll = (status: AttendanceStatus) => {
    const newRecords: Record<string, AttendanceStatus> = {};
    MOCK_MEMBERS.forEach(m => {
      newRecords[m.id] = status;
    });
    setRecords(newRecords);
  };

  const filteredMembers = MOCK_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const summary = {
    present: Object.values(records).filter(s => s === 'present').length,
    late: Object.values(records).filter(s => s === 'late').length,
    excused: Object.values(records).filter(s => s === 'excused').length,
    absent: Object.values(records).filter(s => s === 'absent').length,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Mark Attendance</h1>
          <p className="text-sm text-text-muted">Record attendance for choir events</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all"
        >
          <Save size={18} /> Save Attendance
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 mb-6">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Select Event</label>
        <select 
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-1/2 p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
        >
          {MOCK_EVENTS.map(event => (
            <option key={event.id} value={event.id}>{event.title} - {event.date}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 text-center">
          <div className="text-success flex justify-center mb-2"><CheckCircle size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-success">{summary.present}</div>
          <div className="text-xs text-text-muted mt-1">Present</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 text-center">
          <div className="text-warning flex justify-center mb-2"><Clock size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-warning">{summary.late}</div>
          <div className="text-xs text-text-muted mt-1">Late</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 text-center">
          <div className="text-info flex justify-center mb-2"><FileText size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-info">{summary.excused}</div>
          <div className="text-xs text-text-muted mt-1">Excused</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 text-center">
          <div className="text-error flex justify-center mb-2"><XCircle size={24} /></div>
          <div className="text-2xl font-black font-cinzel text-error">{summary.absent}</div>
          <div className="text-xs text-text-muted mt-1">Absent</div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text"
              placeholder="Search members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-9 pr-4 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => markAll('present')} className="flex-1 md:flex-none px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-bold hover:bg-success/20 transition-colors">
              Mark All Present
            </button>
            <button onClick={() => setRecords({})} className="flex-1 md:flex-none px-3 py-1.5 bg-transparent text-text-muted border border-border-default rounded-lg text-xs font-bold hover:bg-white/5 transition-colors">
              Clear All
            </button>
          </div>
        </div>

        <div className="divide-y divide-border-subtle">
          {filteredMembers.map(member => (
            <div key={member.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div>
                <div className="font-semibold text-sm">{member.name}</div>
                <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border-subtle">{member.voice}</span>
                  <span>Avg: {member.attendanceRate}%</span>
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleStatusChange(member.id, 'present')}
                  className={`flex-1 md:flex-none flex justify-center items-center p-2 rounded-lg border transition-all ${records[member.id] === 'present' ? 'bg-success/20 border-success text-success' : 'bg-transparent border-border-subtle text-text-muted hover:border-success/50'}`}
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={() => handleStatusChange(member.id, 'late')}
                  className={`flex-1 md:flex-none flex justify-center items-center p-2 rounded-lg border transition-all ${records[member.id] === 'late' ? 'bg-warning/20 border-warning text-warning' : 'bg-transparent border-border-subtle text-text-muted hover:border-warning/50'}`}
                >
                  <Clock size={18} />
                </button>
                <button 
                  onClick={() => handleStatusChange(member.id, 'excused')}
                  className={`flex-1 md:flex-none flex justify-center items-center p-2 rounded-lg border transition-all ${records[member.id] === 'excused' ? 'bg-info/20 border-info text-info' : 'bg-transparent border-border-subtle text-text-muted hover:border-info/50'}`}
                >
                  <FileText size={18} />
                </button>
                <button 
                  onClick={() => handleStatusChange(member.id, 'absent')}
                  className={`flex-1 md:flex-none flex justify-center items-center p-2 rounded-lg border transition-all ${records[member.id] === 'absent' ? 'bg-error/20 border-error text-error' : 'bg-transparent border-border-subtle text-text-muted hover:border-error/50'}`}
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
