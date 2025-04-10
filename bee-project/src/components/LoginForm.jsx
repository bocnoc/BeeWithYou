// src/components/LoginForm.jsx
import { useState } from 'react';
import Spinner from './Spinner';
import styles from '../styles/LoginForm.module.css';

const LoginForm = ({ onLogin, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className={styles.loginFormContainer}>
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
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
          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default LoginForm;