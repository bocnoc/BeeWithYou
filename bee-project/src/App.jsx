// src/App.jsx
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BeeContainer from './components/BeeContainer';
import { useAuth } from './hooks/useAuth';
import { useBees } from './hooks/useBees';
import './styles/App.css';

function App() {
  const { isLoggedIn, user, error, appError, login, logout, register } = useAuth();
  const { bees, beeCount, clickMessage, addBee, getRemainingTime } = useBees(user);
  const [showRegister, setShowRegister] = useState(false); // Trạng thái để chuyển đổi giữa đăng nhập và đăng ký

  return (
    <div className="app">
      {appError && <p className="error">{appError}</p>}
      {!isLoggedIn ? (
        <div className="auth-container">
          {showRegister ? (
            <>
              <RegisterForm onRegister={register} error={error} />
              <p className="switch-auth">
                Đã có tài khoản?{' '}
                <button onClick={() => setShowRegister(false)} className="switch-button">
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={login} error={error} />
              <p className="switch-auth">
                Chưa có tài khoản?{' '}
                <button onClick={() => setShowRegister(true)} className="switch-button">
                  Đăng ký
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <BeeContainer
          bees={bees}
          beeCount={beeCount}
          clickMessage={clickMessage}
          onAddBee={addBee}
          getRemainingTime={getRemainingTime}
          onLogout={logout}
        />
      )}
    </div>
  );
}

export default App;