import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router';
import { useAuth, AuthProvider } from '~/contexts/AuthContext';

function Header() {
	const { username, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

	const handleLogout = () => {
    logout();
		navigate('/');
	};

  const links = isLoggedIn ?
		[
			{ to: '/', label: 'Ana Sayfa' },
			{ to: '/quiz/create', label: 'Quiz Oluştur' },
			{ to: '/quiz/list', label: 'Quizler' },
			{ to: '/quiz/history', label: username || 'Profilim' },
			{ to: '/', label: 'Çıkış', onClick: handleLogout }
		] :
		[
			{ to: '/', label: 'Ana Sayfa' },
			{ to: '/login', label: 'Giriş Yap' },
			{ to: '/register', label: 'Kayıt Ol' }
		];

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Quiz App
        </Link>
          <ul className="flex space-x-8">
            {links.map(({ to, label, onClick }) => (
              <li key={`${to}-${label}`}>
                {onClick ? (
                  <button
                    onClick={onClick}
                    className="hover:text-indigo-300 transition bg-transparent border-none cursor-pointer text-inherit"
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    to={to}
                    className="hover:text-indigo-300 transition"
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
      </nav>
    </header>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
      <Outlet />
        </main>
        <footer className="bg-gray-200 text-center py-4 mt-8">
          &copy; 2025 Quiz App.
        </footer>
      </div>
    </AuthProvider>
  );
}