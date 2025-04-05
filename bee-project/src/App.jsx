import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { auth, db } from './firebase/firebase'; // Import Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore
import './App.css';

// Đăng ký MotionPathPlugin
gsap.registerPlugin(MotionPathPlugin);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bees, setBees] = useState([]); // Danh sách ong để hiển thị
  const [beeCount, setBeeCount] = useState(0); // Số ong từ Firestore
  const [lastClickTime, setLastClickTime] = useState(null); // Thời gian click cuối cùng
  const [clickMessage, setClickMessage] = useState(''); // Thông báo giới hạn click
  const beeRefs = useRef([]); // Ref để lưu các DOM element của ong

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Lấy dữ liệu người dùng từ Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBeeCount(data.beeCount || 0);
          setLastClickTime(data.lastClickTime ? data.lastClickTime.toDate() : null);
          // Khôi phục danh sách ong để hiển thị
          setBees(Array.from({ length: data.beeCount || 0 }, (_, i) => ({ id: i })));
        } else {
          // Nếu người dùng chưa có dữ liệu, tạo mới
          await setDoc(userDocRef, { beeCount: 0, lastClickTime: null });
        }
      } else {
        setIsLoggedIn(false);
        setBeeCount(0);
        setBees([]);
        setLastClickTime(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.');
      console.error(err);
    }
  };

  // Kiểm tra xem có thể click "Thêm ong" không
  const canAddBee = () => {
    if (!lastClickTime) return true; // Nếu chưa click lần nào, cho phép
    const now = new Date();
    const timeDiff = now - lastClickTime; // Thời gian chênh lệch (ms)
    const hoursDiff = timeDiff / (1000 * 60 * 60); // Chuyển sang giờ
    return hoursDiff >= 24; // Cho phép nếu đã qua 24 giờ
  };

  // Xử lý khi nhấn nút "Thêm ong"
  const handleBeeClick = async () => {
    if (!canAddBee()) {
      setClickMessage('Bạn chỉ có thể thêm ong 1 lần/ngày. Vui lòng thử lại sau!');
      return;
    }

    // Thêm ong mới
    const newBee = { id: bees.length };
    setBees([...bees, newBee]);
    const newBeeCount = beeCount + 1;
    setBeeCount(newBeeCount);

    // Cập nhật Firestore
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        beeCount: newBeeCount,
        lastClickTime: new Date(),
      });
      setLastClickTime(new Date());
      setClickMessage('');
    }
  };

  // Hàm tạo đường path ngẫu nhiên
  const generateRandomPath = () => {
    return [
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
      { x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 },
    ];
  };

  // Tạo quỹ đạo cong ngẫu nhiên cho mỗi con ong
  useEffect(() => {
    bees.forEach((bee, index) => {
      const beeElement = beeRefs.current[index];
      if (beeElement && !beeElement.dataset.animated) {
        beeElement.dataset.animated = true;

        let currentPath = generateRandomPath();
        const tl = gsap.timeline({
          repeat: -1,
          delay: Math.random() * 5,
          onRepeat: () => {
            currentPath = generateRandomPath();
            tl.clear();
            let currentPos = gsap.getProperty(beeElement, 'x');
            let currentPosY = gsap.getProperty(beeElement, 'y');
            for (let i = 0; i < currentPath.length; i++) {
              const startPoint = i === 0 ? { x: currentPos, y: currentPosY } : currentPath[i - 1];
              const endPoint = currentPath[i];
              const direction = endPoint.x > startPoint.x ? 1 : -1;
              tl.to(beeElement, {
                rotationY: direction === 1 ? 180 : 0,
                duration: 0,
              }, i * segmentDuration);
              tl.to(beeElement, {
                x: endPoint.x,
                y: endPoint.y,
                duration: segmentDuration,
                ease: 'sine.inOut',
                motionPath: {
                  path: [startPoint, endPoint],
                  curviness: 2,
                },
              }, i * segmentDuration);
            }
          },
        });

        const totalDuration = Math.random() * 5 + 5;
        const segmentDuration = totalDuration / currentPath.length;

        for (let i = 0; i < currentPath.length; i++) {
          const startPoint = i === 0 ? { x: 0, y: 0 } : currentPath[i - 1];
          const endPoint = currentPath[i];
          const direction = endPoint.x > startPoint.x ? 1 : -1;
          tl.to(beeElement, {
            rotationY: direction === 1 ? 180 : 0,
            duration: 0,
          }, i * segmentDuration);
          tl.to(beeElement, {
            x: endPoint.x,
            y: endPoint.y,
            duration: segmentDuration,
            ease: 'sine.inOut',
            motionPath: {
              path: [startPoint, endPoint],
              curviness: 2,
            },
          }, i * segmentDuration);
        }

        gsap.set(beeElement, { rotation: 0 });
      }
    });
  }, [bees]);

  return (
    <div className="app">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Đăng nhập</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Đăng nhập</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div className="bee-container">
          <h2>Chào mừng đến tổ ong!</h2>
          <div className="hive">
            <img src="/hive.png" alt="Tổ ong" className="hive-img" />
            {bees.map((bee, index) => (
              <img
                key={bee.id}
                ref={(el) => (beeRefs.current[index] = el)}
                src="/bee.png"
                alt="Ong"
                className="bee"
              />
            ))}
          </div>
          <button onClick={handleBeeClick} className="bee-button">
            Thêm ong (1 lần/ngày)
          </button>
          {clickMessage && <p className="click-message">{clickMessage}</p>}
          <p>Số ong: {beeCount}</p>
        </div>
      )}
    </div>
  );
}

export default App;