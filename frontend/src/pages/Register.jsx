import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const res = await register(form);

      localStorage.setItem(
        'token',
        res.data.token
      );

      localStorage.setItem(
        'name',
        res.data.name
      );

      localStorage.setItem(
        'email',
        res.data.email
      );

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          🎯 ResumeAI
        </h1>

        <h2 style={styles.subtitle}>
          Create your account
        </h2>

        {error &&
          <div style={styles.error}>
            {error}
          </div>
        }

        <form onSubmit={handleSubmit}>

          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            required
          />

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Register'}
          </button>

        </form>

        <p style={styles.link}>
          Already have an account?

          <Link
            to="/login"
            style={styles.login}
          >
            {" "}Login
          </Link>

        </p>

      </div>

    </div>
  );
}

const styles = {

  container: {
    width: '100vw',
    height: '100vh',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    background:
      'linear-gradient(135deg,#4F6EF7,#8E44AD)'
  },

  card: {

    width: '100%',
    maxWidth: '500px',

    padding: '45px',

    background:
      'rgba(255,255,255,0.95)',

    borderRadius: '20px',

    backdropFilter: 'blur(10px)',

    boxShadow:
      '0px 15px 50px rgba(0,0,0,0.25)'
  },

  title: {
    textAlign: 'center',
    fontSize: '34px',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '5px'
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '25px',
    fontWeight: 'normal'
  },

  error: {
    background: '#ffe6e6',
    color: 'red',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px'
  },

  input: {

    width: '100%',
    padding: '14px',

    marginBottom: '16px',

    border: '1px solid #ddd',
    borderRadius: '10px',

    fontSize: '16px',

    boxSizing: 'border-box'
  },

  button: {

    width: '100%',
    padding: '14px',

    border: 'none',

    borderRadius: '10px',

    background:
      'linear-gradient(135deg,#4F6EF7,#8E44AD)',

    color: 'white',

    fontWeight: 'bold',

    fontSize: '17px',

    cursor: 'pointer'
  },

  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666'
  },

  login: {
    color: '#8E44AD',
    fontWeight: 'bold',
    textDecoration: 'none'
  }

};