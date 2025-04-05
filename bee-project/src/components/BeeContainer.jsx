// src/components/BeeContainer.jsx
import Bee from './Bee';
import Spinner from './Spinner';
import styles from '../styles/BeeContainer.module.css';

const BeeContainer = ({ bees, beeCount, clickMessage, onAddBee, getRemainingTime, onLogout, isLoading }) => {
  return (
    <div className={styles.beeContainer}>
      <h2>Chào mừng đến tổ ong!</h2>
      <button onClick={onLogout} className={styles.logoutButton} disabled={isLoading}>
        Đăng xuất
      </button>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.hive}>
            <img src="/hive.png" alt="Tổ ong" className={styles.hiveImg} />
            {bees.map((bee, index) => (
              <Bee key={bee.id} index={index} />
            ))}
          </div>
          <button onClick={onAddBee} className={styles.beeButton} disabled={isLoading}>
            Thêm ong (1 lần/ngày)
          </button>
          {clickMessage && <p className={styles.clickMessage}>{clickMessage}</p>}
          {getRemainingTime() && (
            <p className={styles.remainingTime}>
              Thời gian còn lại để thêm ong: {getRemainingTime()}
            </p>
          )}
          <p>Số ong: {beeCount}</p>
        </>
      )}
    </div>
  );
};

export default BeeContainer;