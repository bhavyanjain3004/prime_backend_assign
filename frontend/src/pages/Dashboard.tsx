import React, { useEffect, useState } from 'react';
import { LogOut, PlusCircle, CheckCircle2, Cloud, Sun, Star } from 'lucide-react';
import { tasksApi } from '../api/tasks';
import { authApi } from '../api/auth';
import TaskModal from '../components/TaskModal';

interface DashboardProps {
  onNavigate: (route: 'login' | 'register' | 'dashboard') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

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

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.data) setUserRole(res.data.role);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onNavigate('login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Decorative Doodles */}
      <Cloud className="floating-doodle" size={64} color="#A7C7E7" style={{ top: '10%', left: '5%', animationDelay: '0.2s' }} />
      <Sun className="floating-doodle" size={72} color="#F4A261" style={{ top: '15%', right: '8%', animationDelay: '1.2s' }} />
      <Star className="floating-doodle" size={48} color="#E76F51" style={{ bottom: '15%', left: '10%', animationDelay: '0.8s' }} />
      
      {/* Top Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: 'var(--font-heading)', fontSize: '24px' }}>T</div>
          <span style={{ fontWeight: 700, fontSize: '24px', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>Taskly</span>
          {userRole && (
            <span style={{ 
              marginLeft: '8px', 
              padding: '4px 12px', 
              background: userRole === 'ADMIN' ? '#F4A261' : 'var(--border-color)', 
              color: userRole === 'ADMIN' ? '#FFF9EF' : 'var(--text-secondary)',
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: 700,
              letterSpacing: '1px'
            }}>
              {userRole === 'ADMIN' ? 'ADMIN MODE' : 'USER'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={handleLogout} className="pill-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'transparent', border: '2px solid var(--text-primary)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <h1 style={{ fontSize: '56px', lineHeight: '1.2', marginBottom: '16px' }}>
          Your Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '500px', margin: '0 auto 48px auto' }}>
          Manage your daily tasks, stay organized, and track your progress.
        </p>

        {/* Action Button */}
        <div style={{ marginBottom: '60px' }}>
           <button onClick={() => setIsModalOpen(true)} className="pill-button primary" style={{ fontSize: '20px', padding: '16px 32px', display: 'inline-flex', gap: '12px', alignItems: 'center' }}>
             <PlusCircle size={24} /> Create a New Task
           </button>
        </div>

        {/* Task List Section */}
        {tasks.length > 0 ? (
          <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '32px', border: '2px solid var(--text-primary)', boxShadow: '4px 4px 0px rgba(62, 54, 46, 0.1)' }}>
            <h3 style={{ fontSize: '28px', marginBottom: '24px', borderBottom: '2px dashed var(--border-color)', paddingBottom: '16px' }}>Recent Tasks</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {tasks.map((task: any) => (
                <div key={task.id} style={{ 
                  background: 'var(--bg-primary)', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }} className="task-card">
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{task.title}</h4>
                    {task.description && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px' }}>{task.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ padding: '8px 16px', background: '#F4EBE1', borderRadius: '20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {task.status}
                    </span>
                    <span style={{ padding: '8px 16px', background: task.priority === 'HIGH' ? '#FAD4D4' : '#E2D5C8', borderRadius: '20px', fontSize: '14px', fontWeight: 700, color: task.priority === 'HIGH' ? '#D62828' : 'var(--text-primary)' }}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: '60px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircle2 size={48} color="#A7C7E7" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '24px' }}>All caught up!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You don't have any tasks right now.</p>
          </div>
        )}
      </div>

      {/* Render Modal */}
      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => fetchTasks()} 
        />
      )}

      <style>
        {`
          .task-card:hover {
            border-color: var(--text-primary);
            transform: translateX(4px);
          }
        `}
      </style>
    </div>
  );
}
