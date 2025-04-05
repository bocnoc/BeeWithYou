// src/utils/animation.js
import { gsap } from 'gsap';

export const animateBee = (beeElement, index) => {
  const hiveWidth = 400; // Kích thước tổ ong (px)
  const hiveHeight = 400;
  const beeSize = 40; // Kích thước ong (px)

  // Hàm tạo vị trí ngẫu nhiên trong khu vực tổ ong
  const getRandomPosition = () => {
    // Tính toán để ong không bay ra ngoài khu vực tổ ong
    const maxX = hiveWidth - beeSize;
    const maxY = hiveHeight - beeSize;
    const x = Math.random() * maxX; // Vị trí x ngẫu nhiên
    const y = Math.random() * maxY; // Vị trí y ngẫu nhiên
    return { x, y };
  };

  // Hàm di chuyển ong đến vị trí ngẫu nhiên
  const moveBee = () => {
    const { x, y } = getRandomPosition();
    const duration = 2 + Math.random() * 3; // Thời gian di chuyển: 2-5 giây
    const delay = Math.random() * 1; // Độ trễ ngẫu nhiên: 0-1 giây

    gsap.to(beeElement, {
      x: x - hiveWidth / 2, // Điều chỉnh để vị trí tương đối với trung tâm tổ ong
      y: y - hiveHeight / 2,
      duration: duration,
      ease: 'power1.inOut', // Chuyển động mượt mà, tự nhiên
      delay: delay,
      onComplete: moveBee, // Gọi lại hàm để di chuyển đến vị trí mới
    });
  };

  // Đặt vị trí ban đầu của ong ở trung tâm tổ ong
  gsap.set(beeElement, {
    x: 0,
    y: 0,
  });

  // Bắt đầu di chuyển
  moveBee();
};