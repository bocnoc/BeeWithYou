// src/components/Bee.jsx
import { useEffect, useRef } from 'react';
import { animateBee } from '../utils/animation';
import styles from '../styles/BeeContainer.module.css'; // Import styles từ BeeContainer.module.css

const Bee = ({ index }) => {
  const beeRef = useRef(null);

  useEffect(() => {
    if (beeRef.current) {
      animateBee(beeRef.current, index);
    }
  }, [index]);

  return (
    <img
      ref={beeRef}
      src="/bee.png"
      alt="Ong"
      className={styles.bee} // Sử dụng styles.bee
    />
  );
};

export default Bee;