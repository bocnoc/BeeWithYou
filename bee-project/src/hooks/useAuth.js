// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth'; // Thêm createUserWithEmailAndPassword
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [appError, setAppError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, { beeCount: 0, lastClickTime: null });
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setAppError('Có lỗi xảy ra khi kết nối với Firebase. Vui lòng thử lại sau.');
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.');
      console.error('Sign in error:', err);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError('');
      setAppError('');
    } catch (err) {
      console.error('Logout error:', err);
      setAppError('Có lỗi khi đăng xuất. Vui lòng thử lại.');
    }
  };

  // Thêm hàm register
  const register = async (email, password) => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully:', userCredential.user);
      // Document người dùng sẽ được tạo tự động bởi useEffect khi đăng nhập thành công
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng kiểm tra email/mật khẩu.');
      console.error('Register error:', err);
      setIsLoggedIn(false);
    }
  };

  return { isLoggedIn, user, error, appError, login, logout, register }; // Export thêm hàm register
};