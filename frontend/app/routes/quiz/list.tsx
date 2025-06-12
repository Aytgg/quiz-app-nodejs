import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';

type Quiz = {
  id: number;
  title: string;
  creator: string;
  questionCount: number;
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/quiz')
      .then(res => setQuizzes(res.data))
      .catch(() => alert('Quiz listesi alınamadı'));
  }, []);

	const { userId } = useAuth();

	const handleStart = async () => {
		try {
			const token = localStorage.getItem('token');
			const res = await api.post(
				'/room',
				{ userId },
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			const roomCode = res.data.roomCode;
			navigate(`/room/${roomCode}`);
		} catch (err: any) {
			alert(err.response?.data?.message || 'Oda oluşturulamadı');
		}
	};

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">Tüm Quizler</h2>
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{quiz.title}</h3>
              <p className="text-sm text-gray-500">Hazırlayan: {quiz.creator} • {quiz.questionCount} soru</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleStart()}
            >
              Başlat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
