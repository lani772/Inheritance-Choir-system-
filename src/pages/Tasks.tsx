import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, Plus, Trash2, Calendar, Filter, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDueDate, setFilterDueDate] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      
      if (response.ok) {
        const { task } = await response.json();
        setTasks([task, ...tasks]);
        setIsAddModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskToDelete));
        setTaskToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    
    let matchDueDate = true;
    if (filterDueDate !== 'all') {
      if (!task.due_date) {
        matchDueDate = false;
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        if (filterDueDate === 'overdue') {
          matchDueDate = dueDate < today && task.status !== 'completed';
        } else if (filterDueDate === 'today') {
          matchDueDate = dueDate.getTime() === today.getTime();
        } else if (filterDueDate === 'upcoming') {
          matchDueDate = dueDate > today;
        }
      }
    }
    
    return matchPriority && matchStatus && matchDueDate;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-muted bg-bg-elevated border-border-subtle';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Tasks</h1>
          <p className="text-sm text-text-muted">Manage your organization's tasks</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 gold-bg text-bg-base font-bold font-cinzel tracking-wide px-4 py-2.5 rounded-xl hover:brightness-110 transition-all">
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-bg-card p-4 rounded-2xl border border-border-subtle">
        <div className="flex items-center gap-2 text-text-muted">
          <Filter size={16} />
          <span className="text-sm font-bold">Filters:</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-bg-input border border-border-default rounded-lg text-sm px-3 py-1.5 outline-none focus:border-gold"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-bg-input border border-border-default rounded-lg text-sm px-3 py-1.5 outline-none focus:border-gold"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select 
            value={filterDueDate} 
            onChange={(e) => setFilterDueDate(e.target.value)}
            className="bg-bg-input border border-border-default rounded-lg text-sm px-3 py-1.5 outline-none focus:border-gold"
          >
            <option value="all">Any Due Date</option>
            <option value="today">Due Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-text-muted bg-bg-card rounded-2xl border border-border-subtle">
            No tasks found. Create one to get started.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`bg-bg-card border rounded-2xl p-4 transition-colors flex items-start gap-4 ${task.status === 'completed' ? 'border-border-subtle opacity-70' : 'border-border-default hover:border-gold/50'}`}>
              <button 
                onClick={() => handleToggleStatus(task)}
                className={`mt-1 shrink-0 ${task.status === 'completed' ? 'text-success' : 'text-text-muted hover:text-gold transition-colors'}`}
              >
                {task.status === 'completed' ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg truncate ${task.status === 'completed' ? 'line-through text-text-muted' : ''}`}>
                    {task.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">{task.description}</p>
                )}
                
                {task.due_date && (
                  <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                    <Calendar size={14} />
                    <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setTaskToDelete(task.id)}
                className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border-subtle">
              <h2 className="font-cinzel font-bold text-lg">Add New Task</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Task Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Description (Optional)</label>
                <textarea rows={3} value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Due Date (Optional)</label>
                  <input type="date" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 gold-bg text-bg-base rounded-xl text-sm font-bold hover:brightness-110 transition-all">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 border-2 border-error/20 flex items-center justify-center mx-auto mb-4 text-error">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-cinzel font-bold mb-2">Delete Task?</h2>
            <p className="text-sm text-text-muted mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setTaskToDelete(null)} className="flex-1 py-2.5 border border-border-default rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleDeleteTask} className="flex-1 py-2.5 bg-error text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
