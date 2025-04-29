import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';

function AuthForm({ isLogin = false }) { // Default to register form
  const [formData, setFormData] = useState({
    username: '', // Only needed for registration
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
        if (!email || !password) {
           setError("Please enter email and password.");
           setLoading(false);
           return;
        }
      result = await login(email, password);
    } else {
        if (!username || !email || !password) {
           setError("Please fill in all fields.");
           setLoading(false);
           return;
        }
        if (password.length < 6) {
             setError("Password must be at least 6 characters long.");
             setLoading(false);
             return;
        }
      result = await register(username, email, password);
    }

    setLoading(false);
    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard on successful login/register
    } else {
      setError(result.message || `An error occurred during ${isLogin ? 'login' : 'registration'}.`);
    }
  };

  return (
    <div className="auth-form card" style={{ maxWidth: '400px', margin: 'var(--spacing-xl) auto' }}>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit}>
        {!isLogin && ( // Show username field only for registration
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={onChange}
              required={!isLogin}
              aria-required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
            aria-required="true"
            minLength={isLogin ? undefined : 6} // Minlength only for register
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
          {loading ? <LoadingSpinner /> : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;