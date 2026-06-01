import React, { useState } from 'react';
import { authApi } from '../api/auth';
import { Sparkles, Cloud, Sun, Star, Heart, CloudLightning } from 'lucide-react';

interface RegisterProps {
  onNavigate: (route: 'login' | 'register' | 'dashboard') => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Oops! Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        onNavigate('dashboard');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Doodles */}
      <Cloud className="floating-doodle" size={48} color="#A7C7E7" style={{ top: '15%', left: '15%', animationDelay: '0s' }} />
      <Sun className="floating-doodle" size={56} color="#F4A261" style={{ top: '20%', right: '20%', animationDelay: '1s' }} />
      <Sparkles className="floating-doodle" size={32} color="#E9C46A" style={{ bottom: '25%', left: '20%', animationDelay: '2s' }} />
      <Star className="floating-doodle" size={40} color="#E76F51" style={{ bottom: '20%', right: '15%', animationDelay: '0.5s' }} />
      <Heart className="floating-doodle" size={36} color="#E07A5F" style={{ top: '40%', left: '8%', animationDelay: '1.5s' }} />
      <CloudLightning className="floating-doodle" size={44} color="#8AB17D" style={{ top: '50%', right: '10%', animationDelay: '2.5s' }} />

      {/* Main Form Container */}
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '48px',
        margin: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>Join in...</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '12px', borderRadius: '12px', background: '#FAD4D4', color: '#D62828', fontSize: '15px', textAlign: 'center', marginBottom: '24px', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Your Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pill-input" 
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pill-input" 
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pill-input" 
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '15px', fontWeight: 700 }}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pill-input" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="pill-button primary" style={{ width: '100%', padding: '16px', fontSize: '18px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: 'var(--text-secondary)' }}>
            Already have an account? <span onClick={() => onNavigate('login')} style={{ color: 'var(--accent-color)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Log in</span>
          </div>
        </form>
      </div>
    </div>
  );
}
