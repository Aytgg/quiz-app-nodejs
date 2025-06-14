import { useEffect, useState } from "react";
import api from "~/services/api";

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.post("/quiz/history");
        setHistory(res.data.history || []);
      } catch (err) {
        alert("Geçmiş quizler alınamadı");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6 text-black">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        Quiz Geçmişi
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {history.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-4 px-6 rounded bg-gray-100 border border-gray-300 font-medium text-black">
            Hiç quiz geçmişiniz yok.
          </div>
        ) : (
          history.map((h, i) => (
            <div
              key={i}
              className="border rounded-lg shadow p-6 flex flex-col justify-between bg-white text-black"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-xl text-black">
                    {h.roomTitle || h.quizTitle || "Quiz"}
                  </h3>
                  <span className="text-gray-600 text-sm">
                    {h.updatedAt
                      ? new Date(h.updatedAt).toLocaleString()
                      : h.playedAt
                      ? new Date(h.playedAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Toplam Soru:{" "}
                  <span className="font-medium">{h.totalQuestions}</span>
                </p>
                <div>
                  <span className="font-semibold text-black">Katılımcılar:</span>
                  <ul className="ml-2 mt-1">
                    {(h.results || []).map((p: any, idx: number) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-blue-600">{idx+1 + ". " + p.username}</span>
                        <span className="text-blue-500">
                          {p.score} puan | Doğru: {p.correctAnswers} / {h.totalQuestions}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}