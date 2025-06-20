import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'var(--surface)',
      boxShadow: 'var(--shadow)',
      padding: '16px 0',
      marginBottom: '32px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{
              margin: 0,
              color: 'var(--primary-color)',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              SportsDunia
            </h1>
            <span style={{
              marginLeft: '16px',
              padding: '4px 12px',
              background: 'var(--primary-light)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              Referral System
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {user.email}
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 