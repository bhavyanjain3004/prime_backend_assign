import React, { useState } from 'react';
import { X } from 'lucide-react';
import { tasksApi } from '../api/tasks';

interface TaskModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskModal({ onClose, onSuccess }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await tasksApi.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to create task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(62, 54, 46, 0.4)',
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '500px',
        padding: '40px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'
        }}>
          <X size={28} />
        </button>

        <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Create New Task</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>Add a new task to your board.</p>

        {error && (
          <div style={{ padding: '12px', borderRadius: '12px', background: '#FAD4D4', color: '#D62828', fontSize: '15px', marginBottom: '24px', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Task Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="pill-input" 
              placeholder="E.g. Complete the backend assignment"
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Description (Optional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="pill-input" 
              style={{ borderRadius: '16px', minHeight: '120px', resize: 'vertical' }}
              placeholder="Add more details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="pill-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="pill-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="pill-button primary" style={{ width: '100%', marginTop: '24px', padding: '16px', fontSize: '18px' }}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
