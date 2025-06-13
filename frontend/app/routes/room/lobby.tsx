import { useParams, useNavigate } from "react-router";
import { use, useEffect, useState } from "react";
import socket from "~/services/socket";
import { useAuth } from "~/contexts/AuthContext";
import api from "~/services/api";

export default function RoomPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<string[]>([]);
  const auth = useAuth();
  const [username] = useState<string>(auth.username || localStorage.getItem("username") || "Guest");
  const [isOwner, setIsOwner] = useState<boolean>();

  const checkIsOwner = async () => {
    try {
      const res = await api.post("/room/check", { roomCode: code });
      setIsOwner(res.data.hostId == auth.userId)
    } catch (err: any) {
      if (err.response?.status == 404)
        return alert("Oda bulunamadı");

      console.error("Error checking room:", err);
      alert("Oda sahibi kontrol edilirken bir hata oluştu");
    }
  };

  useEffect(() => {
    if (!username || !code) return;

    socket.on("user-list", ({ users }) => setUsers(users));

    socket.emit('join-room', { roomCode: code, username });

    checkIsOwner();

    return () => {
      socket.off("user-list");
    };
  }, [username, code]);

  const handleStartQuiz = () => {
    socket.emit("start-quiz", { roomCode: code });

    navigate(`/room/${code}/quiz?q=1`);
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center text-black">
        Oda Kodu: {code}
      </h2>
      {isOwner && (
        <div className="mt-6">
          <button
            className="btn btn-primary w-full text-black border rounded bg-blue-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 px-4 py-2"
            onClick={handleStartQuiz}
          >
            Quiz'i Başlat
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold mt-4 text-black">Katılımcılar: </h3>
      <ul className="list-disc list-inside">
        {users.map((u, i) => (
          <li key={`${u}-${i}`} className="text-gray-700">
            {u}
          </li>
        ))}
      </ul>
    </div>
  );
}
