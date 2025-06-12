import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Giriş başarısız');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center text-black">Giriş Yap</h2>

        <input
          name="username"
          type="text"
          placeholder="Kullanıcı Adı"
          className="input input-bordered w-full text-gray-700"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Şifre"
          className="input input-bordered w-full text-gray-700"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary w-full text-black">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}