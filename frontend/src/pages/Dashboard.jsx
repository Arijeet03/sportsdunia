import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEarnings, getPurchases } from '../api/referrals';
import { getReferralTree } from '../api/user';
import { createPurchase } from '../api/purchases';
import { useSocket } from '../hooks/useSocket';
import Navigation from '../components/Navigation';
import ReferralTree from '../components/ReferralTree';
import LoadingSpinner from '../components/LoadingSpinner';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseForm, setPurchaseForm] = useState({ amount: '', description: '' });
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const socket = useSocket();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('earning', (data) => {
        setEarnings(prev => [data, ...prev]);
        showNotification(`New earning: ₹${data.amount} from ${data.referralName}`, 'success');
      });
      return () => {
        socket.off('earning');
      };
    }
  }, [socket]);

  const loadData = async () => {
    try {
      // Fetch referral tree and flatten for visualization
      const referralTreeRes = await getReferralTree(token);
      const direct = (referralTreeRes.data.directReferrals || []).map(r => ({ ...r, level: 1 }));
      const indirect = (referralTreeRes.data.indirectReferrals || []).map(r => ({ ...r, level: 2 }));
      setReferrals([...direct, ...indirect]);

      // Fetch earnings and purchases as before
      const [earningsRes, purchasesRes] = await Promise.all([
        getEarnings(),
        getPurchases()
      ]);
      setEarnings(Array.isArray(earningsRes.data.data) ? earningsRes.data.data : []);
      setPurchases(Array.isArray(purchasesRes.data.data) ? purchasesRes.data.data : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setPurchaseLoading(true);
    try {
      const res = await createPurchase(purchaseForm);
      setPurchases(prev => [res.data, ...prev]);
      setPurchaseForm({ amount: '', description: '' });
      showNotification('Purchase created successfully!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create purchase', 'error');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const directReferrals = referrals.filter(r => r.level === 1).length;
  const indirectReferrals = referrals.filter(r => r.level > 1).length;

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <LoadingSpinner size="large" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        {/* Stats Overview */}
        <div className="grid grid-3 mb-3">
          <div className="card stats-card">
            <div className="stats-number">₹{totalEarnings.toFixed(2)}</div>
            <div className="stats-label">Total Earnings</div>
          </div>
          <div className="card stats-card">
            <div className="stats-number">{directReferrals}</div>
            <div className="stats-label">Direct Referrals</div>
          </div>
          <div className="card stats-card">
            <div className="stats-number">{indirectReferrals}</div>
            <div className="stats-label">Indirect Referrals</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            borderBottom: '2px solid var(--border)',
            gap: '32px'
          }}>
            {['overview', 'referrals', 'earnings', 'purchases', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 0',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">Your Referral Code</h3>
              <div style={{
                background: 'var(--background)',
                padding: '16px',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--border)',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                textAlign: 'center',
                fontWeight: '600',
                color: 'var(--primary-color)'
              }}>
                {user.referralCode}
              </div>
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Share this code with friends to earn 5% on their purchases above ₹1000
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Quick Purchase</h3>
              <form onSubmit={handlePurchaseSubmit}>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter amount"
                    value={purchaseForm.amount}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="What did you purchase?"
                    value={purchaseForm.description}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, description: e.target.value })}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={purchaseLoading}
                >
                  {purchaseLoading ? (
                    <>
                      <div className="spinner"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Purchase'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <ReferralTree referrals={referrals} />
        )}

        {activeTab === 'earnings' && (
          <div className="card">
            <h3 className="card-title">Earnings History</h3>
            {earnings.length === 0 ? (
              <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                <p>No earnings yet. Your earnings will appear here when referrals make purchases.</p>
              </div>
            ) : (
              <div className="list">
                {earnings.map((earning, index) => (
                  <div key={earning._id} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>₹{earning.amount.toFixed(2)}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        From {earning.referralName} • {earning.level ? `Level ${earning.level}` : earning.type}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {earning.createdAt ? new Date(earning.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="card">
            <h3 className="card-title">Purchase History</h3>
            {purchases.length === 0 ? (
              <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                <p>No purchases yet. Create your first purchase above!</p>
              </div>
            ) : (
              <div className="list">
                {purchases.map((purchase, index) => (
                  <div key={purchase._id} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>₹{purchase.amount.toFixed(2)}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {purchase.description}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 