import { useSearchParams, useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import api from "~/services/api";
import socket from "~/services/socket";

export default function QuestionPage() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const order = Number(searchParams.get("q")) || 1;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await api.post(`/room/${code}/questions`);
        setQuestions(res.data.questions);
      } catch (err) {
        alert("Sorular yüklenemedi");
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [code]);

  const question = questions.find(q => q.order === order);

  // Timer
  useEffect(() => {
    if (!question) return;
    setSelectedOption(null);
    setTimer(question.timeLimit);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question?.id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!questions.length) return <div>Soru bulunamadı.</div>;
  if (!question) return <div>Soru bulunamadı.</div>;

  const isLast = order == questions.length;

  const handleOptionSelect = (option: string, idx: number) => {
    setSelectedOption(option);
    socket.emit("submit-answer", {
      roomCode: code,
      username: localStorage.getItem("username") || "Guest",
      question: question,
      answer: idx,
    });
  }

  const handleNext = () => {
    if (!isLast)
      navigate(`/room/${code}/question?q=${order + 1}`);
    else {
      socket.emit("end-quiz", { code, username: localStorage.getItem("username") || "Guest" });
      navigate(`/room/${code}/scoreboard`);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-black mb-4">
        Soru {order}
      </h2>
      <div className="text-lg text-black mb-2">{question.text}</div>
      <div className="mb-4 text-gray-700">Süre: <span className="font-bold">{timer}</span> sn</div>
      <ul className="space-y-2">
        {question.options.map((option: string, idx: number) => (
          <li key={idx}>
            <button
              className={`w-full text-left px-4 py-2 rounded border text-black ${
                selectedOption === option
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-blue-100"
              }`}
              disabled={!!selectedOption || timer === 0}
              onClick={() => handleOptionSelect(option, idx)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
	{/* 
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleNext}
        disabled={timer > 0}
      >
        {isLast ? "Bitir" : "Sonraki Soru"}
      </button>
	*/}
    </div>
  );
}