import React from 'react';

const ReferralTree = ({ referrals }) => {
  const directReferrals = referrals.filter(r => r.level === 1);
  const indirectReferrals = referrals.filter(r => r.level > 1);

  return (
    <div className="card">
      <h3 className="card-title">Referral Network Visualization</h3>
      
      {/* Direct Referrals */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ 
          color: 'var(--primary-color)', 
          marginBottom: '16px',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          Direct Referrals ({directReferrals.length})
        </h4>
        
        {directReferrals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👥</div>
            <p>No direct referrals yet</p>
            <p style={{ fontSize: '0.9rem' }}>Share your referral code to start building your network</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {directReferrals.map((referral) => (
              <div key={referral._id} style={{
                background: 'var(--background)',
                padding: '16px',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--primary-light)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '16px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  5% Commission
                </div>
                
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {referral.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {referral.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Joined: {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indirect Referrals */}
      <div>
        <h4 style={{ 
          color: 'var(--secondary-color)', 
          marginBottom: '16px',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          Indirect Referrals ({indirectReferrals.length})
        </h4>
        
        {indirectReferrals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🌳</div>
            <p>No indirect referrals yet</p>
            <p style={{ fontSize: '0.9rem' }}>These will appear when your direct referrals bring in new users</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {indirectReferrals.map((referral) => (
              <div key={referral._id} style={{
                background: 'var(--background)',
                padding: '16px',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--secondary-color)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '16px',
                  background: 'var(--secondary-color)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  Level {referral.level} • 1% Commission
                </div>
                
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {referral.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {referral.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Joined: {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralTree; 