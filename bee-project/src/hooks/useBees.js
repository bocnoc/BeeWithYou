// src/hooks/useBees.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const useBees = (user) => {
  const [bees, setBees] = useState([]);
  const [beeCount, setBeeCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [clickMessage, setClickMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setBeeCount(data.beeCount || 0);
            setLastClickTime(data.lastClickTime ? data.lastClickTime.toDate() : null);
            setBees(Array.from({ length: data.beeCount || 0 }, (_, i) => ({ id: i })));
          }
        } else {
          setBeeCount(0);
          setBees([]);
          setLastClickTime(null);
        }
      } catch (err) {
        console.error('Error fetching bee data:', err);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, [user]);

  const canAddBee = () => {
    if (!lastClickTime) return true;
    const now = new Date();
    const timeDiff = now - lastClickTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const getRemainingTime = () => {
    if (!lastClickTime) return null;
    const now = new Date();
    const timeDiff = now - lastClickTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const hoursRemaining = 24 - hoursDiff;
    if (hoursRemaining <= 0) return null;

    const minutesRemaining = (hoursRemaining % 1) * 60;
    return `${Math.floor(hoursRemaining)} giờ ${Math.floor(minutesRemaining)} phút`;
  };

  const addBee = async () => {
    if (!canAddBee()) {
      setClickMessage('Bạn chỉ có thể thêm ong 1 lần/ngày. Vui lòng thử lại sau!');
      return;
    }

    try {
      const newBee = { id: bees.length };
      setBees([...bees, newBee]);
      const newBeeCount = beeCount + 1;
      setBeeCount(newBeeCount);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          beeCount: newBeeCount,
          lastClickTime: new Date(),
        });
        setLastClickTime(new Date());
        setClickMessage('');
      }
    } catch (err) {
      console.error('Error updating bee count:', err);
      setClickMessage('Có lỗi khi lưu số ong. Vui lòng thử lại.');
    }
  };

  return { bees, beeCount, clickMessage, addBee, getRemainingTime, isLoading }; // Export isLoading
};