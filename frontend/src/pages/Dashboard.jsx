import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleAnalyze = async () => {
    if (!file) return setError('Please select a file');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', targetRole);
      const res = await analyzeResume(formData);
      const data = JSON.parse(res.data.result);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>🎯 ResumeAI</h1>
        <div style={styles.navRight}>
          
          <button style={styles.navBtn} onClick={() => navigate('/history')}>History</button>
          <button style={styles.navBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Upload Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Analyze Your Resume</h2>
          <p style={styles.cardSubtitle}>Upload your resume and get instant AI-powered feedback</p>

          <div
            style={styles.dropzone}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {file ? (
              <p>📄 {file.name}</p>
            ) : (
              <>
                <p style={{ fontSize: '40px' }}>📂</p>
                <p>Click to upload your resume (PDF or DOCX)</p>
              </>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Target Role (e.g. Backend Engineer, ML Engineer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={styles.button}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? '🔄 Analyzing... (this takes ~15 seconds)' : '🚀 Analyze Resume'}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div style={styles.results}>
            {/* ATS Score */}
           <div style={styles.scoreCard}>
  <h2 style={styles.scoreTitle}>
    ATS Score
  </h2>

  <div style={styles.scoreCircle}>
    <span style={styles.scoreNumber}>
      {result.ats_score}
    </span>

    <span style={styles.scoreMax}>
      /100
    </span>
  </div>

  <p style={styles.scoreReasoning}>
    {result.score_reasoning}
  </p>
</div>

            {/* Grid */}
            <div style={styles.grid}>
              {/* Strengths */}
              <div style={styles.resultCard}>
                <h3 style={{ color: '#22c55e' }}>✅ Strengths</h3>
                <ul style={styles.list}>
                  {result.strengths?.map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                </ul>
              </div>

              {/* Improvements */}
              <div style={styles.resultCard}>
                <h3 style={{ color: '#f59e0b' }}>⚡ Improvements</h3>
                <ul style={styles.list}>
                  {result.improvements?.map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                </ul>
              </div>

              {/* Missing Keywords */}
              <div style={styles.resultCard}>
                <h3 style={{ color: '#3b82f6' }}>🔑 Missing Keywords</h3>
                <div style={styles.tags}>
                  {result.missing_keywords?.map((k, i) => (
                    <span key={i} style={styles.tag}>{k}</span>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div style={styles.resultCard}>
                <h3 style={{ color: '#ef4444' }}>📊 Skill Gaps</h3>
                <ul style={styles.list}>
                  {result.skill_gaps?.map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div style={styles.resultCard}>
              <h3 style={{ color: '#8b5cf6' }}>🎤 Interview Questions</h3>
              {result.interview_questions?.map((q, i) => (
                <div key={i} style={styles.questionCard}>
                  <p style={styles.question}><strong>Q{i + 1}:</strong> {q.question}</p>
                  <p style={styles.whyAsked}>💡 <strong>Why asked:</strong> {q.why_asked}</p>
                  <p style={styles.tip}>🎯 <strong>Tip:</strong> {q.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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
  margin:0,
  fontSize:'28px',
  color:'#222',
  fontWeight:'bold'
},
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  navName: { color: '#666' },
  navBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  cardTitle: {
  fontSize:'24px',
  marginBottom:'8px',
  color:'#1e293b',
  fontWeight:'bold'
},
  cardSubtitle: { color: '#666', marginBottom: '24px' },
  dropzone: {
    border: '2px dashed #667eea',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '16px',
    color: '#667eea',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  results: { display: 'flex', flexDirection: 'column', gap: '24px' },
 scoreCard: {
  background: 'linear-gradient(135deg,#667eea,#764ba2)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center',
  color: 'white'
},

scoreTitle: {
  margin: '0 0 16px',
  fontSize: '24px',
  fontWeight: 'bold'
},

scoreCircle: {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  gap: '6px',
  marginBottom: '20px'
},

scoreNumber: {
  fontSize: '80px',
  fontWeight: 'bold',
  lineHeight: '1'
},

scoreMax: {
  fontSize: '24px',
  opacity: 0.8
},

scoreReasoning: {
  marginTop: '16px',
  opacity: 0.95,
  lineHeight: '1.8',
  fontSize: '16px'
},
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  resultCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  list: { paddingLeft: '20px' },
  listItem: { marginBottom: '8px', lineHeight: 1.5, color: '#444' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  tag: {
    background: '#eff6ff',
    color: '#3b82f6',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  questionCard: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  question: { marginBottom: '8px', color: '#1e293b' },
  whyAsked: { marginBottom: '4px', color: '#666', fontSize: '14px' },
  tip: { color: '#666', fontSize: '14px', margin: 0 },
};