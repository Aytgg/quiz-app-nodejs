import { useEffect, useState } from 'react';

export default function useAuth() {
  const [auth, setAuth] = useState({
    token: null as string | null,
    username: null as string | null,
    isLoggedIn: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    setAuth({
      token,
      username,
      isLoggedIn: !!token
    });
  }, []);

  return auth;
}
