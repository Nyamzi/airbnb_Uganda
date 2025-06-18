import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const userCredential = await signup(email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      navigate('/');
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            className="toggle-auth"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </button>
        </div>

        <div className="social-auth">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button
              className="google-button"
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width="18"
                height="18"
              />
              Google
            </button>
            <button
              className="facebook-button"
              onClick={handleFacebookSignIn}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg"
                alt="Facebook"
                width="18"
                height="18"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth; 