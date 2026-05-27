import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>🎯 ResumeAI</h1>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <button style={styles.navBtnOutline} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Analysis History</h2>

        {loading && <p style={styles.loading}>Loading...</p>}

        {!loading && history.length === 0 && (
          <div style={styles.empty}>
            <p style={{ fontSize: '48px' }}>📭</p>
            <p>No analyses yet. Go analyze your resume!</p>
            <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
              Analyze Now
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {history.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
            >
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.fileName}>📄 {item.fileName}</p>
                  <p style={styles.role}>🎯 {item.targetRole}</p>
                  <p style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div style={{ ...styles.score, color: getScoreColor(item.atsScore) }}>
                  {item.atsScore}
                  <span style={styles.scoreLabel}>/100</span>
                </div>
              </div>

              {/* Expanded Result */}
              {selected?.id === item.id && (() => {
                const data = JSON.parse(item.result);
                return (
                  <div style={styles.expanded}>
                    <hr style={styles.divider} />

                    <div style={styles.section}>
                      <h4 style={{ color: '#22c55e' }}>✅ Strengths</h4>
                      <ul>{data.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>

                    <div style={styles.section}>
                      <h4 style={{ color: '#f59e0b' }}>⚡ Improvements</h4>
                      <ul>{data.improvements?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>

                    <div style={styles.section}>
                      <h4 style={{ color: '#3b82f6' }}>🔑 Missing Keywords</h4>
                      <div style={styles.tags}>
                        {data.missing_keywords?.map((k, i) => (
                          <span key={i} style={styles.tag}>{k}</span>
                        ))}
                      </div>
                    </div>

                    <div style={styles.section}>
                      <h4 style={{ color: '#8b5cf6' }}>🎤 Interview Questions</h4>
                      {data.interview_questions?.map((q, i) => (
                        <div key={i} style={styles.questionCard}>
                          <p><strong>Q{i + 1}:</strong> {q.question}</p>
                          <p style={styles.tip}>🎯 {q.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc' },
  navbar: {
    background: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
 logo: {
  margin: 0,
  fontSize: '28px',
  color: '#222',
  fontWeight: 'bold'
},
  navRight: { display: 'flex', gap: '12px' },
  navBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  navBtnOutline: {
    padding: '8px 16px',
    background: 'white',
    color: '#667eea',
    border: '1px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
 pageTitle: {
  fontSize: '32px',
  marginBottom: '24px',
  color: '#1e293b',
  fontWeight: 'bold'
},
  loading: { textAlign: 'center', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  fileName: {
  fontWeight: 'bold',
  fontSize: '18px',
  margin: '0 0 4px',
  color: '#374151'
},
  role: { color: '#667eea', margin: '0 0 4px' },
  date: { color: '#999', fontSize: '13px', margin: 0 },
  score: { fontSize: '48px', fontWeight: 'bold', lineHeight: 1 },
  scoreLabel: { fontSize: '16px', color: '#999' },
  expanded: { marginTop: '16px' },
  divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' },
  section: { marginBottom: '16px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: {
    background: '#eff6ff',
    color: '#3b82f6',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  questionCard: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
  },
  tip: { color: '#666', fontSize: '14px', margin: 0 },
};