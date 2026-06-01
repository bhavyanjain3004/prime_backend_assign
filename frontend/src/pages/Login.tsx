import React, { useState } from 'react';
import { Facebook, Twitter, Chrome } from 'lucide-react';
import { authApi } from '../api/auth';

interface LoginProps {
  onNavigate: (route: 'login' | 'register' | 'dashboard') => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login(formData);
      if (res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Left side: Beautiful Meadow Illustration */}
      <div style={{
        flex: '1',
        position: 'relative',
        overflow: 'hidden',
        display: 'none',
      }} className="desktop-only-illustration">
        <img 
          src="/auth_meadow.png" 
          alt="Scenic mountain meadow with bears" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, width: '10%',
          background: 'linear-gradient(to right, transparent, var(--bg-primary))',
        }}></div>
      </div>

      {/* Right side: Form Panel */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 8%',
        position: 'relative',
        zIndex: 10,
      }}>
        
        <div className="animate-fade-in" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', color: '#3A4B5C', marginBottom: '8px' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#5C7186', fontSize: '16px' }}>
              We are so happy to see you again
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button className="pill-button" style={{ flex: 2, display: 'flex', gap: '10px', background: '#F8F5F1' }}>
              <Chrome size={18} /> Log in with Google
            </button>
            <button className="pill-button" style={{ flex: 1, background: '#F8F5F1' }}>
              <Facebook size={18} />
            </button>
            <button className="pill-button" style={{ flex: 1, background: '#F8F5F1' }}>
              <Twitter size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#8898AA', fontSize: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: '#CBD5E1' }}></div>
            <span style={{ padding: '0 16px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#CBD5E1' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {error && (
                <div style={{ padding: '12px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', fontSize: '14px', textAlign: 'center' }}>
                  {error}
                </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pill-input" 
                  style={{ background: '#F8F5F1' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pill-input" 
                  style={{ background: '#F8F5F1' }}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="pill-button" style={{ width: '100%', background: '#F8F5F1', color: '#3A4B5C', padding: '14px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5C7186' }}>
              Don't have an account? <span onClick={() => onNavigate('register')} style={{ color: '#3A4B5C', fontWeight: 600, cursor: 'pointer' }}>Sign up</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
