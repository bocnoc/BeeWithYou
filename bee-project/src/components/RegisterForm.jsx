// src/components/RegisterForm.jsx
import { useState } from 'react';
import Spinner from './Spinner';
import '../styles/RegisterForm.css';

const RegisterForm = ({ onRegister, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  };

  return (
    <div className="register-form-container">
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Đăng ký</h2>
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
            Đăng ký
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default RegisterForm;