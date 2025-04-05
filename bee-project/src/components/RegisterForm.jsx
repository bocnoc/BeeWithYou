// src/components/RegisterForm.jsx
import { useState } from 'react';
import '../styles/RegisterForm.css';

const RegisterForm = ({ onRegister, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  };

  return (
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
      <button type="submit">Đăng ký</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default RegisterForm;