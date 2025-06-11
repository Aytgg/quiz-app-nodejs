import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

import { useState } from "react";
import { useNavigate } from "react-router";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  //return <Welcome />;
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => (roomCode.length == 6 ? navigate(`/room/${roomCode}`) : alert("Room ID must be 6 characters long"));
  const handleCreateQuiz = () => alert("Create Quiz functionality is not implemented yet");

return (
	<div style={{ padding: "20px", textAlign: "center" }}>
		<h1>Quiz App</h1>
		<Input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0,6))} placeholder="Room ID"></Input>
		<Button onClick={handleJoin} disabled={roomCode.length != 6}>Katıl</Button>
		{!roomCode && <Button onClick={handleCreateQuiz}>Quiz Oluştur</Button>}
	</div>
);
};