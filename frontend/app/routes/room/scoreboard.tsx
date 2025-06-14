import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "~/services/api";
import socket from "~/services/socket";

export default function ResultPage() {
  const { code } = useParams();
  const [scoreboard, setScoreboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScoreboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/room/${code}/scoreboard`);
      setScoreboard(res.data.scoreboard || res.data.participants || []);
    } catch (err) {
      alert("Sonuçlar alınamadı");
    }
    setLoading(false);
  };

  // Sadece ilk renderda ve code değişince çalışsın
  useEffect(() => {
    fetchScoreboard();
  }, [code]);

  // Oyun bitince tekrar skorları çekmek için (opsiyonel)
  useEffect(() => {
    socket.on("game-ended", fetchScoreboard);
    return () => {
      socket.off("game-ended", fetchScoreboard);
    };
  }, [code]);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        Quiz Sonuçları
      </h2>
      <ul className="divide-y">
        {scoreboard.map((user, i) => (
          <li key={user.username + "-" + i} className="py-2 flex justify-between text-blue-300">
            <span>
              {i + 1}. {user.username}
            </span>
            <span className="font-bold">{user.score} puan</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
