import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import socket from '~/services/socket';
import { useAuth } from '~/contexts/AuthContext';

export default function RoomPage() {
  const { code } = useParams();
  const [users, setUsers] = useState<string[]>([]);
  const { username } = useAuth();

  useEffect(() => {
    if (!username || !code) return;

    socket.emit('join-room', { roomCode: code, username });

    socket.on('user-joined', (data) => {
      setUsers((prev) => [...prev, data.username]);
    });

    return () => {
      socket.off('user-joined');
    };
  }, [username, code]);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">Oda Kodu: {code}</h2>
      <h3 className="text-lg font-semibold mt-4">Katılımcılar:</h3>
      <ul className="list-disc list-inside">
        {users.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </ul>
    </div>
  );
}
