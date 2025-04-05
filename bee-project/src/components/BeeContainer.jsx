// src/components/BeeContainer.jsx
import Bee from './Bee';
import '../styles/BeeContainer.css';

const BeeContainer = ({ bees, beeCount, clickMessage, onAddBee, getRemainingTime, onLogout }) => {
  return (
    <div className="bee-container">
      <h2>Chào mừng đến tổ ong!</h2>
      <button onClick={onLogout} className="logout-button">Đăng xuất</button>
      <div className="hive">
        <img src="/hive.png" alt="Tổ ong" className="hive-img" />
        {bees.map((bee, index) => (
          <Bee key={bee.id} index={index} />
        ))}
      </div>
      <button onClick={onAddBee} className="bee-button">
        Thêm ong (1 lần/ngày)
      </button>
      {clickMessage && <p className="click-message">{clickMessage}</p>}
      {getRemainingTime() && (
        <p className="remaining-time">
          Thời gian còn lại để thêm ong: {getRemainingTime()}
        </p>
      )}
      <p>Số ong: {beeCount}</p>
    </div>
  );
};

export default BeeContainer;