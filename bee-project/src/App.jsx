import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './App.css';

// Đăng ký MotionPathPlugin
gsap.registerPlugin(MotionPathPlugin);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bees, setBees] = useState([]); // State lưu danh sách các con ong
  const beeRefs = useRef([]); // Ref để lưu các DOM element của ong

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập đăng nhập (sẽ kết nối backend sau)
    setIsLoggedIn(true);
  };

  const handleBeeClick = () => {
    // Thêm một con ong mới
    const newBee = {
      id: bees.length, // ID để làm key
    };
    setBees([...bees, newBee]); // Thêm con ong mới vào danh sách
  };

  // Hàm tạo đường path ngẫu nhiên
  const generateRandomPath = () => {
    return [
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }, // Điểm 1
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }, // Điểm 2
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }, // Điểm 3
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }, // Điểm 4
    ];
  };

  // Tạo quỹ đạo cong ngẫu nhiên cho mỗi con ong
  useEffect(() => {
    bees.forEach((bee, index) => {
      const beeElement = beeRefs.current[index];
      if (beeElement && !beeElement.dataset.animated) { // Kiểm tra để không chạy lại animation cho ong cũ
        // Đánh dấu con ong đã được animated
        beeElement.dataset.animated = true;

        // Tạo đường path ban đầu
        let currentPath = generateRandomPath();

        // Dùng GSAP để tạo timeline cho animation
        const tl = gsap.timeline({
          repeat: -1, // Lặp vô hạn
          delay: Math.random() * 5, // Độ trễ (0-5 giây)
          onRepeat: () => {
            // Tạo đường path mới mỗi lần lặp
            currentPath = generateRandomPath();
            // Cập nhật quỹ đạo mới
            tl.clear(); // Xóa các animation cũ trong timeline
            let currentPos = gsap.getProperty(beeElement, 'x'); // Lấy vị trí hiện tại
            let currentPosY = gsap.getProperty(beeElement, 'y');

            // Tạo quỹ đạo mới từ vị trí hiện tại
            for (let i = 0; i < currentPath.length; i++) {
              const startPoint = i === 0 ? { x: currentPos, y: currentPosY } : currentPath[i - 1];
              const endPoint = currentPath[i];

              // Tính hướng di chuyển (trái hoặc phải)
              const direction = endPoint.x > startPoint.x ? 1 : -1; // 1: sang phải, -1: sang trái

              // Xoay con ong theo hướng di chuyển
              tl.to(beeElement, {
                rotationY: direction === 1 ? 180 : 0, // Sang phải: xoay 180 độ, sang trái: giữ nguyên
                duration: 0, // Xoay ngay lập tức
              }, i * segmentDuration);

              // Di chuyển con ong đến điểm tiếp theo theo quỹ đạo cong
              tl.to(beeElement, {
                x: endPoint.x,
                y: endPoint.y,
                duration: segmentDuration,
                ease: 'sine.inOut',
                motionPath: {
                  path: [startPoint, endPoint],
                  curviness: 2, // Độ cong của quỹ đạo
                },
              }, i * segmentDuration);
            }
          },
        });

        // Tính thời gian cho mỗi đoạn của quỹ đạo
        const totalDuration = Math.random() * 5 + 5; // Thời gian animation (5-10 giây, nhanh gấp đôi)
        const segmentDuration = totalDuration / currentPath.length; // Thời gian cho mỗi đoạn

        // Tạo quỹ đạo ban đầu
        for (let i = 0; i < currentPath.length; i++) {
          const startPoint = i === 0 ? { x: 0, y: 0 } : currentPath[i - 1];
          const endPoint = currentPath[i];

          // Tính hướng di chuyển (trái hoặc phải)
          const direction = endPoint.x > startPoint.x ? 1 : -1; // 1: sang phải, -1: sang trái

          // Xoay con ong theo hướng di chuyển
          tl.to(beeElement, {
            rotationY: direction === 1 ? 180 : 0, // Sang phải: xoay 180 độ, sang trái: giữ nguyên
            duration: 0, // Xoay ngay lập tức
          }, i * segmentDuration);

          // Di chuyển con ong đến điểm tiếp theo theo quỹ đạo cong
          tl.to(beeElement, {
            x: endPoint.x,
            y: endPoint.y,
            duration: segmentDuration,
            ease: 'sine.inOut',
            motionPath: {
              path: [startPoint, endPoint],
              curviness: 2, // Độ cong của quỹ đạo
            },
          }, i * segmentDuration);
        }

        // Đảm bảo đầu ong luôn hướng lên trên (trục Z)
        gsap.set(beeElement, {
          rotation: 0, // Giữ góc xoay trục Z là 0 (đầu hướng lên trên)
        });
      }
    });
  }, [bees]); // Chạy lại mỗi khi danh sách ong thay đổi

  return (
    <div className="app">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Đăng nhập</h2>
          <input type="text" placeholder="Tên người dùng" required />
          <input type="password" placeholder="Mật khẩu" required />
          <button type="submit">Đăng nhập</button>
        </form>
      ) : (
        <div className="bee-container">
          <h2>Chào mừng đến tổ ong!</h2>
          <div className="hive">
            {/* Tổ ong */}
            <img src="/hive.png" alt="Tổ ong" className="hive-img" />
            {/* Ong bay */}
            {bees.map((bee, index) => (
              <img
                key={bee.id}
                ref={(el) => (beeRefs.current[index] = el)} // Lưu ref của từng con ong
                src="/bee.png"
                alt="Ong"
                className="bee"
              />
            ))}
          </div>
          <button onClick={handleBeeClick} className="bee-button">
            Thêm ong (1 lần/ngày)
          </button>
          <p>Số ong: {bees.length}</p>
        </div>
      )}
    </div>
  );
}

export default App;