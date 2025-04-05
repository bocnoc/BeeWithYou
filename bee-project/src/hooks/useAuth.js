// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [appError, setAppError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        setIsLoading(true); // Bắt đầu loading
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
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError('');
    setIsLoading(true); // Bắt đầu loading khi đăng nhập
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.');
      console.error('Sign in error:', err);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const logout = async () => {
    setIsLoading(true); // Bắt đầu loading khi đăng xuất
    try {
      await signOut(auth);
      setError('');
      setAppError('');
    } catch (err) {
      console.error('Logout error:', err);
      setAppError('Có lỗi khi đăng xuất. Vui lòng thử lại.');
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const register = async (email, password) => {
    setError('');
    setIsLoading(true); // Bắt đầu loading khi đăng ký
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully:', userCredential.user);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng kiểm tra email/mật khẩu.');
      console.error('Register error:', err);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return { isLoggedIn, user, error, appError, isLoading, login, logout, register }; // Export isLoading
};