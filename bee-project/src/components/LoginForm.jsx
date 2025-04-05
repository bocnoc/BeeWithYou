// src/components/LoginForm.jsx
import { useState } from 'react';
import Spinner from './Spinner';
import '../styles/LoginForm.css';

const LoginForm = ({ onLogin, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-form-container">
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Đăng nhập</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            Đăng nhập
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default LoginForm;