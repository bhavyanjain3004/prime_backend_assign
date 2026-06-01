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
      backgroundColor: 'rgba(203, 213, 225, 0.4)',
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        background: '#FFFFFF',
        width: '100%', maxWidth: '500px',
        padding: '32px',
        borderRadius: '24px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'transparent', border: 'none', cursor: 'pointer', color: '#8898AA'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#3A4B5C' }}>Create New Task</h2>
        <p style={{ color: '#8898AA', fontSize: '14px', marginBottom: '24px' }}>Add a new objective to your board.</p>

        {error && (
          <div style={{ padding: '12px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', fontSize: '14px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Task Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="pill-input" 
              style={{ background: '#F8F5F1' }}
              placeholder="E.g. Complete Backend Assignment"
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Description (Optional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="pill-input" 
              style={{ background: '#F8F5F1', borderRadius: '16px', minHeight: '100px', resize: 'vertical' }}
              placeholder="Add more details..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="pill-input" style={{ background: '#F8F5F1', appearance: 'none' }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="pill-input" style={{ background: '#F8F5F1', appearance: 'none' }}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="pill-button primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
