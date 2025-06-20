import React, { useState, useEffect } from 'react';
import { 
  getEarningsSummary, 
  getReferralAnalytics, 
  getLevelBreakdown, 
  getEarningSources,
  getMonthlyTrend 
} from '../api/reports';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState({
    summary: null,
    analytics: null,
    levelBreakdown: null,
    sources: null,
    monthlyTrend: null
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, analyticsRes, levelRes, sourcesRes, trendRes] = await Promise.all([
        getEarningsSummary(),
        getReferralAnalytics(),
        getLevelBreakdown(),
        getEarningSources(),
        getMonthlyTrend()
      ]);

      setData({
        summary: summaryRes.data.data,
        analytics: analyticsRes.data.data,
        levelBreakdown: levelRes.data.data,
        sources: sourcesRes.data.data,
        monthlyTrend: trendRes.data.data
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading analytics...
        </div>
      </div>
    );
  }

  // Helper to check if an object is empty
  const isEmpty = (obj) => !obj || (Array.isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0);

  return (
    <div>
      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--border)',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'summary', label: 'Summary' },
            { key: 'analytics', label: 'Referral Analytics' },
            { key: 'levels', label: 'Level Breakdown' },
            { key: 'sources', label: 'Earning Sources' },
            { key: 'trend', label: 'Monthly Trend' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: activeTab === tab.key ? 'var(--primary-color)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary-color)' : '2px solid transparent',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        isEmpty(data.summary) ? (
          <div className="card text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
            <p>No summary data available yet.</p>
            <p style={{ fontSize: '0.9rem' }}>You will see your earnings summary here once you or your referrals make purchases.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">Earnings Overview</h3>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="stats-card">
                  <div className="stats-number">₹{data.summary.totalEarnings.toFixed(2)}</div>
                  <div className="stats-label">Total Earnings</div>
                </div>
                <div className="stats-card">
                  <div className="stats-number">₹{data.summary.directEarnings.toFixed(2)}</div>
                  <div className="stats-label">Direct Earnings</div>
                </div>
                <div className="stats-card">
                  <div className="stats-number">₹{data.summary.indirectEarnings.toFixed(2)}</div>
                  <div className="stats-label">Indirect Earnings</div>
                </div>
                <div className="stats-card">
                  <div className="stats-number">{data.summary.directReferrals + data.summary.indirectReferrals}</div>
                  <div className="stats-label">Total Referrals</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Recent Earnings</h3>
              <div className="list">
                {data.summary.recentEarnings.map((earning, index) => (
                  <div key={earning._id || index} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>₹{earning.amount.toFixed(2)}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        From {earning.referral?.name || 'Unknown'} • Level {earning.level}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'analytics' && (
        isEmpty(data.analytics) ? (
          <div className="card text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
            <p>No referral analytics data available yet.</p>
            <p style={{ fontSize: '0.9rem' }}>Invite users with your referral code to see analytics here.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-title">Direct Referrals ({data.analytics.directReferrals.count})</h3>
              <div className="stats-card">
                <div className="stats-number">₹{data.analytics.directReferrals.totalEarnings.toFixed(2)}</div>
                <div className="stats-label">Total Earnings from Direct</div>
              </div>
              <div className="list" style={{ marginTop: '16px' }}>
                {data.analytics.directReferrals.referrals.map((referral, index) => (
                  <div key={referral.id || index} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>{referral.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {referral.email} • {referral.purchaseCount} purchases
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                        ₹{referral.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Indirect Referrals ({data.analytics.indirectReferrals.count})</h3>
              <div className="stats-card">
                <div className="stats-number">₹{data.analytics.indirectReferrals.totalEarnings.toFixed(2)}</div>
                <div className="stats-label">Total Earnings from Indirect</div>
              </div>
              <div className="list" style={{ marginTop: '16px' }}>
                {data.analytics.indirectReferrals.referrals.map((referral, index) => (
                  <div key={referral.id || index} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>{referral.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {referral.email} • {referral.purchaseCount} purchases
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>
                        ₹{referral.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'levels' && (
        isEmpty(data.levelBreakdown) ? (
          <div className="card text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
            <p>No level breakdown data available yet.</p>
          </div>
        ) : (
          <div className="card">
            <h3 className="card-title">Level-wise Earnings Breakdown</h3>
            <div className="grid grid-2" style={{ gap: '16px' }}>
              {data.levelBreakdown.map((level, index) => (
                <div key={level.level} className="stats-card">
                  <div className="stats-number">₹{level.totalEarnings.toFixed(2)}</div>
                  <div className="stats-label">Level {level.level} ({level.commissionRate}%)</div>
                  <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {level.earningCount} transactions
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {activeTab === 'sources' && (
        isEmpty(data.sources) ? (
          <div className="card text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💡</div>
            <p>No earning sources data available yet.</p>
          </div>
        ) : (
          <div className="card">
            <h3 className="card-title">Earning Sources</h3>
            <div className="list">
              {data.sources.map((source, index) => (
                <div key={source.name || index} className="list-item">
                  <div>
                    <div style={{ fontWeight: '500' }}>{source.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {source.email} • Level {source.level} • {source.purchaseCount} purchases
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                      ₹{source.totalEarnings.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {activeTab === 'trend' && (
        isEmpty(data.monthlyTrend) ? (
          <div className="card text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
            <p>No monthly trend data available yet.</p>
          </div>
        ) : (
          <div className="card">
            <h3 className="card-title">Monthly Earnings Trend</h3>
            <div className="list">
              {data.monthlyTrend.map((month, index) => (
                <div key={month.month || index} className="list-item">
                  <div>
                    <div style={{ fontWeight: '500' }}>{month.month}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {month.earningCount} transactions
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                      ₹{month.totalEarnings.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Direct: ₹{month.directEarnings.toFixed(2)} | Indirect: ₹{month.indirectEarnings.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Analytics; 