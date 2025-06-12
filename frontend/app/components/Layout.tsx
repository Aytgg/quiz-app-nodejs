import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';

function Header() {
	const { username, isLoggedIn } = useAuth();
  const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	};

  const links = isLoggedIn ?
		[
			{ to: '/', label: 'Ana Sayfa' },
			{ to: '/quiz-create', label: 'Quiz Oluştur' },
			{ to: '/quizzes', label: 'Quizler' },
			{ to: '/profile', label: username || 'Profilim' },
			{ to: '/logout', label: 'Çıkış', onClick: handleLogout }
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
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`hover:text-indigo-300 transition`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
		<Outlet />
      </main>
      <footer className="bg-gray-200 text-center py-4 mt-8">
        &copy; 2025 Quiz App.
      </footer>
    </div>
  );
}