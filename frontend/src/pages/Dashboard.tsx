import React, { useEffect, useState } from 'react';
import { LogOut, PlusCircle, ListTodo, CheckCircle2, AlertCircle } from 'lucide-react';
import { tasksApi } from '../api/tasks';

interface DashboardProps {
  onNavigate: (route: 'login' | 'register' | 'dashboard') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await tasksApi.getAll();
      setTasks(res.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onNavigate('login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', position: 'relative' }}>
      {/* Subtle Grid Background Pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Top Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1F2937', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: '18px' }}>Taskly</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ background: 'transparent', border: 'none', fontWeight: 500, cursor: 'pointer', color: '#4B5563' }}>Blog</button>
          <button onClick={handleLogout} className="pill-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: '#8898AA', marginBottom: '16px' }}>Stay organized!</p>
        <h1 style={{ fontSize: '48px', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Your Tasks Are Waiting.<br/>Are You Ready?
        </h1>
        <p style={{ color: '#5C7186', fontSize: '16px', maxWidth: '500px', margin: '0 auto 48px auto' }}>
          Manage your daily objectives, stay on top of priorities, and track your progress effortlessly with Taskly.
        </p>

        {/* Action Menu (Mockup Style) */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '16px', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          
          <div className="action-item" style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <PlusCircle style={{ color: '#8898AA', marginRight: '16px', marginTop: '2px' }} size={24} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Create New Task</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#8898AA' }}>Add a new objective to your list</p>
            </div>
          </div>
          
          <div className="action-item" style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <AlertCircle style={{ color: '#8898AA', marginRight: '16px', marginTop: '2px' }} size={24} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>High Priority</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#8898AA' }}>View urgent tasks needing attention</p>
            </div>
          </div>

          <div className="action-item" style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <ListTodo style={{ color: '#8898AA', marginRight: '16px', marginTop: '2px' }} size={24} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>All Pending</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#8898AA' }}>Review everything on your plate</p>
            </div>
          </div>

          <div className="action-item" style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <CheckCircle2 style={{ color: '#8898AA', marginRight: '16px', marginTop: '2px' }} size={24} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Completed</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#8898AA' }}>See what you've accomplished</p>
            </div>
          </div>

        </div>
      </div>

      <style>
        {`
          .action-item:hover {
            background-color: #F8F9FA;
          }
        `}
      </style>
    </div>
  );
}
