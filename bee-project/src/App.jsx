// src/App.jsx
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BeeContainer from './components/BeeContainer';
import { useAuth } from './hooks/useAuth';
import { useBees } from './hooks/useBees';
import styles from './styles/App.module.css';

function App() {
  const { isLoggedIn, user, error, appError, isLoading: authLoading, login, logout, register } = useAuth();
  const { bees, beeCount, clickMessage, addBee, getRemainingTime, isLoading: beesLoading } = useBees(user);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className={styles.app}>
      {appError && <p className={styles.error}>{appError}</p>}
      {!isLoggedIn ? (
        <div className={styles.authContainer}>
          {showRegister ? (
            <>
              <RegisterForm onRegister={register} error={error} isLoading={authLoading} />
              <p className={styles.switchAuth}>
                Đã có tài khoản?{' '}
                <button onClick={() => setShowRegister(false)} className={styles.switchButton}>
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={login} error={error} isLoading={authLoading} />
              <p className={styles.switchAuth}>
                Chưa có tài khoản?{' '}
                <button onClick={() => setShowRegister(true)} className={styles.switchButton}>
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
          isLoading={authLoading || beesLoading}
        />
      )}
    </div>
  );
}

export default App;