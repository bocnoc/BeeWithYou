// src/App.jsx
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BeeContainer from './components/BeeContainer';
import { useAuth } from './hooks/useAuth';
import { useBees } from './hooks/useBees';
import './styles/App.css';

function App() {
  const { isLoggedIn, user, error, appError, isLoading: authLoading, login, logout, register } = useAuth();
  const { bees, beeCount, clickMessage, addBee, getRemainingTime, isLoading: beesLoading } = useBees(user);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="app">
      {appError && <p className="error">{appError}</p>}
      {!isLoggedIn ? (
        <div className="auth-container">
          {showRegister ? (
            <>
              <RegisterForm onRegister={register} error={error} isLoading={authLoading} />
              <p className="switch-auth">
                Đã có tài khoản?{' '}
                <button onClick={() => setShowRegister(false)} className="switch-button">
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={login} error={error} isLoading={authLoading} />
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
          isLoading={authLoading || beesLoading} // Kết hợp cả hai loading state
        />
      )}
    </div>
  );
}

export default App;