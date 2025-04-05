// src/components/Bee.jsx
import { useEffect, useRef } from 'react';
import { animateBee } from '../utils/animation';

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
      className="bee"
    />
  );
};

export default Bee;