import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, Clock, X, Users, Bell, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  attendees: string[];
}

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Sunday Morning Rehearsal', date: '2026-02-22', time: '09:00', location: 'Main Sanctuary', type: 'Rehearsal', attendees: ['Jean Baptiste Mugisha', 'Marie Claire Uwase'] },
  { id: '2', title: 'Easter Concert 2026', date: '2026-03-29', time: '18:00', location: 'Kigali Convention Centre', type: 'Performance', attendees: [] },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newAttendee, setNewAttendee] = useState('');
  const [sendingReminderFor, setSendingReminderFor] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Rehearsal'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = { ...formData, id: Date.now().toString(), attendees: [] };
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      
      if (response.ok) {
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
        setFormData({ title: '', date: '', time: '', location: '', type: 'Rehearsal' });
      }
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !newAttendee.trim()) return;
    
    const attendeeName = newAttendee.trim();
    
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: attendeeName })
      });
      
      if (response.ok) {
        const updatedEvents = events.map(ev => {
          if (ev.id === selectedEvent.id) {
            return { ...ev, attendees: [...ev.attendees, attendeeName] };
          }
          return ev;
        });
        
        setEvents(updatedEvents);
        setSelectedEvent({ ...selectedEvent, attendees: [...selectedEvent.attendees, attendeeName] });
        setNewAttendee('');
      }
    } catch (error) {
      console.error('Failed to add attendee:', error);
    }
  };

  const handleRemoveAttendee = async (attendeeToRemove: string) => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}/attendees/${encodeURIComponent(attendeeToRemove)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const updatedEvents = events.map(ev => {
          if (ev.id === selectedEvent.id) {
            return { ...ev, attendees: ev.attendees.filter(a => a !== attendeeToRemove) };
          }
          return ev;
        });

        setEvents(updatedEvents);
        setSelectedEvent({ ...selectedEvent, attendees: selectedEvent.attendees.filter(a => a !== attendeeToRemove) });
      }
    } catch (error) {
      console.error('Failed to remove attendee:', error);
    }
  };

  const handleSendReminder = async (event: Event) => {
    setSendingReminderFor(event.id);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'laurentniyigena1@gmail.com', // Sending to the user's email for testing
          subject: `Reminder: ${event.title}`,
          text: `This is a reminder for the upcoming event: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}`,
        })
      });
      
      if (response.ok) {
        alert(`Reminder sent for: ${event.title}`);
      } else {
        alert('Failed to send reminder.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the reminder.');
    } finally {
      setSendingReminderFor(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Events & Rehearsals</h1>
          <p className="text-sm text-text-muted">Manage choir schedule and activities</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all"
        >
          <Plus size={18} /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            No events found. Create one to get started.
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-border-gold transition-colors">
              <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                event.type === 'Performance' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-violet/10 text-violet border border-violet/20'
              }`}>
                {event.type}
              </span>
            </div>
            <h3 className="font-cinzel font-bold text-lg mb-3">{event.title}</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-text-muted" />
                <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-text-muted" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-text-muted" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-text-muted" />
                <span>{event.attendees.length} Attendees</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-subtle flex gap-2">
              <button 
                onClick={() => { setSelectedEvent(event); setIsAttendeesModalOpen(true); }}
                className="flex-1 py-2 bg-bg-elevated border border-border-default rounded-lg text-xs font-bold hover:bg-white/5 transition-colors"
              >
                Manage Attendees
              </button>
              <button 
                onClick={() => handleSendReminder(event)}
                disabled={sendingReminderFor === event.id}
                className="flex-1 py-2 bg-info/10 text-info border border-info/20 rounded-lg text-xs font-bold hover:bg-info/20 transition-colors flex items-center justify-center gap-1 disabled:opacity-70"
              >
                {sendingReminderFor === event.id ? <Loader2 size={14} className="animate-spin" /> : <><Bell size={14} /> Reminder</>}
              </button>
            </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-subtle">
              <h2 className="font-cinzel font-bold text-lg">Create New Event</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Time</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Event Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                  <option>Rehearsal</option><option>Performance</option><option>Meeting</option><option>Service</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 gold-bg text-bg-base rounded-xl text-sm font-bold hover:brightness-110 transition-all">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAttendeesModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-5 border-b border-border-subtle">
              <div>
                <h2 className="font-cinzel font-bold text-lg">Manage Attendees</h2>
                <p className="text-xs text-text-muted">{selectedEvent.title}</p>
              </div>
              <button onClick={() => setIsAttendeesModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 border-b border-border-subtle">
              <form onSubmit={handleAddAttendee} className="flex gap-2">
                <input 
                  type="text" 
                  value={newAttendee} 
                  onChange={e => setNewAttendee(e.target.value)} 
                  placeholder="Enter attendee name..." 
                  className="flex-1 p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" 
                />
                <button type="submit" disabled={!newAttendee.trim()} className="px-4 py-2.5 gold-bg text-bg-base font-bold rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-50">
                  Add
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {selectedEvent.attendees.length === 0 ? (
                <p className="text-center text-text-muted text-sm py-4">No attendees added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedEvent.attendees.map((attendee, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 bg-bg-elevated border border-border-subtle rounded-xl text-sm">
                      <span>{attendee}</span>
                      <button onClick={() => handleRemoveAttendee(attendee)} className="text-error hover:text-red-400 transition-colors p-1">
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
