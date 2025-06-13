import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import socket from "~/services/socket";

type Quiz = {
  id: number;
  title: string;
  description?: string;
  creator: string;
  questionCount: number;
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    api
      .get("/quiz/list")
      .then((res) => setQuizzes(res.data))
      .catch((err: any) => {
        if (err.response?.status == 401) {
          alert("Lütfen giriş yapın");
          return navigate("/login");
        } else if (err.response?.status != 404)
          return alert("Quiz listesi alınamadı");
      });
  }, []);

  const handleStart = async (quiz: Quiz) => {
    try {
      const res = await api.post("/room", { quiz });

      const roomCode = res.data.roomCode;
      socket.emit("join-room", { roomCode, username });
      navigate(`/room/${roomCode}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Oda oluşturulamadı");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6 text-black">
      <h2 className="text-2xl font-bold text-center text-black">Tüm Quizler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quizzes.length === 0 ? (
          <div className="col-span-full text-center text-red-700 py-4 px-6 rounded bg-red-100 border border-red-300 font-medium text-black">
            Henüz quiz bulunmamaktadır.
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="border rounded-lg shadow p-6 flex flex-col justify-between bg-white text-black"
            >
              <div>
                <h3 className="font-semibold text-xl mb-2 text-black">
                  {quiz.title}
                </h3>
                {quiz.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {quiz.description}
                  </p>
                )}
                <p className="text-sm text-gray-700 mb-1">
                  Hazırlayan:{" "}
                  <span className="font-medium">{quiz.creator}</span>
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Toplam Soru:{" "}
                  <span className="font-medium">{quiz.questionCount}</span>
                </p>
              </div>
              <button
                className="btn btn-primary mt-auto text-black"
                onClick={() => handleStart(quiz)}
              >
                Başlat
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
