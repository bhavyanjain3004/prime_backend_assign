import React, { useState } from 'react';
import { Mail, Facebook, Twitter, Chrome } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend auth service
    console.log('Register attempt', formData);
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
        {/* Soft overlay gradient to blend with background if needed */}
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
        
        <div className="animate-fade-in" style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', color: '#3A4B5C', marginBottom: '8px' }}>
              Hello! Welcome Aboard
            </h1>
            <p style={{ color: '#5C7186', fontSize: '16px' }}>
              We are Glad to see you 😊
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button className="pill-button" style={{ flex: 2, display: 'flex', gap: '10px', background: '#F8F5F1' }}>
              <Chrome size={18} /> Sign up with Google
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pill-input" 
                  style={{ background: '#F8F5F1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pill-input" 
                  style={{ background: '#F8F5F1' }}
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
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#3A4B5C', fontWeight: 500 }}>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pill-input" 
                  style={{ background: '#F8F5F1' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', marginTop: '32px' }}>
              <input 
                type="checkbox" 
                id="terms" 
                style={{ width: '18px', height: '18px', marginRight: '12px', accentColor: '#3A4B5C', cursor: 'pointer' }}
                required 
              />
              <label htmlFor="terms" style={{ fontSize: '14px', color: '#3A4B5C' }}>
                I agree terms of service and privacy policy
              </label>
            </div>

            <button type="submit" className="pill-button" style={{ width: '100%', background: '#F8F5F1', color: '#3A4B5C', padding: '14px', fontSize: '16px' }}>
              Sign up
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5C7186' }}>
              Already have an account? <span onClick={() => onNavigate('login')} style={{ color: '#3A4B5C', fontWeight: 600, cursor: 'pointer' }}>Log in</span>
            </div>
          </form>
        </div>
      </div>
      
      <style>
        {`
          @media (min-width: 900px) {
            .desktop-only-illustration {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
}
