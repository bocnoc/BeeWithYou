// src/App.jsx
import LoginForm from './components/LoginForm';
import BeeContainer from './components/BeeContainer';
import { useAuth } from './hooks/useAuth';
import { useBees } from './hooks/useBees';
import './styles/App.css';

function App() {
  const { isLoggedIn, user, error, appError, login, logout } = useAuth();
  const { bees, beeCount, clickMessage, addBee, getRemainingTime } = useBees(user);

  return (
    <div className="app">
      {appError && <p className="error">{appError}</p>}
      {!isLoggedIn ? (
        <LoginForm onLogin={login} error={error} />
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