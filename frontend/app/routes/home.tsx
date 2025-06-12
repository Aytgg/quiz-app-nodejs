import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import useAuth from "../hooks/useAuth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz App" },
    { name: "description", content: "Quiz App via NodeJS" },
  ];
}

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

	useEffect(() => {
		const roomCode = localStorage.getItem("roomCode");
	}, []);

	const { isLoggedIn } = useAuth();

	const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toUpperCase().slice(0, 6).replace(/[^A-Z0-9]/g, "");
		setRoomCode(value);
	};

  const handleJoin = () => (roomCode.length == 6 ? navigate(`/room/${roomCode}`) : alert("Room ID must be 6 characters long"));
  const handleCreateQuiz = () => navigate('/rooms/create');

return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Odaya Katıl</h1>
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