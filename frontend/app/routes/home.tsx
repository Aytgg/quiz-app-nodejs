import type { Route } from "./+types/home";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from '~/contexts/AuthContext';
import socket from "~/services/socket";
import api from "~/services/api";
import { W } from "node_modules/react-router/dist/development/lib-C1JSsICm.mjs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz App" },
    { name: "description", content: "Quiz App via NodeJS" },
  ];
}

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
	const [username, setUsername] = useState("");
  const navigate = useNavigate();

	useEffect(() => {
		const roomCode = localStorage.getItem("roomCode");
	}, []);

	const { isLoggedIn } = useAuth();

	const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toUpperCase().slice(0, 6).replace(/[^A-Z0-9]/g, "");
		setRoomCode(value);
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.slice(0, 20);
		setUsername(value);
	};

	const handleJoin = async () => {
    if (roomCode.length != 6)
      return alert("Oda ID 6 karakter uzunluğunda olmalıdır");

    try {
      const res = await api.post("/room/check", { roomCode });

      navigate(`/room/${roomCode}`);
    } catch (err: any) {
      if (err.response?.status == 404 || err.response?.status == 500)
        return alert(err.response?.data?.message || "Oda bulunamadı");

      console.error("Error checking room code:", err);
      return alert("Oda kontrol edilirken bir hata oluştu");
    }

    socket.emit("user-joined", { username: username || "Guest", roomCode });
  }

	const handleCreateQuiz = () => {
		socket.emit("user-joined", { username: username || "Guest" });

		navigate('/rooms/create');
	}

	return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Odaya Katıl</h1>
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={handleUsernameChange}
        className="input input-bordered w-full text-center text-xl tracking-widest text-black"
        maxLength={20}
        autoComplete="off"
      />
      <input
        type="text"
        placeholder="6 Haneli Oda ID"
        value={roomCode}
        onChange={handleRoomCodeChange}
        className="input input-bordered w-full text-center text-xl tracking-widest uppercase text-black"
        maxLength={6}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleJoin}
        disabled={roomCode.length !== 6}
        className={`btn btn-primary w-full text-black ${
          roomCode.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Odaya Katıl
      </button>
      {isLoggedIn ? (
        <button
          type="button"
          onClick={handleCreateQuiz}
          className="btn btn-secondary w-full mt-4 text-black"
        >
          Oda Oluştur
        </button>
      ) : (
        <p className="text-center text-gray-500 mt-4 text-black">
          Oda oluşturmak için lütfen <a href="/auth/login" className="text-indigo-600 underline">giriş yapın</a>.
        </p>
      )}
    </div>
  );
};