import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "~/services/api";

type Option = string;
type Question = {
  text: string;
  options: Option[];
  answer: number;
  order: number;
};

export default function QuizCreate() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın");
      navigate("/login");
    }
  }, [navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", ""], answer: 0, order: 1 },
  ]);

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "text") updated[idx].text = value;
    else if (field.startsWith("option")) {
      const optIdx = Number(field.split("-")[1]);
      updated[idx].options[optIdx] = value;
    } else if (field === "answer") updated[idx].answer = Number(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", ""], answer: 0, order: questions.length + 1 },
    ]);
  };

  const removeQuestion = (idx: number) => {
    const ordered = questions
      .filter((_, i) => i !== idx)
      .map((q, i) => ({
        ...q,
        order: i + 1,
      }));
    setQuestions(ordered);
  };

  const addOption = (qIdx: number) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx && q.options.length < 6
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const removeOption = (qIdx: number, optIdx: number) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx && q.options.length > 2
          ? {
              ...q,
              options: q.options.filter((_, oi) => oi !== optIdx),
              answer: q.answer >= optIdx ? Math.max(0, q.answer - 1) : q.answer,
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Quiz başlığı zorunludur.");
    for (var q of questions) {
      if (!q.text.trim()) return alert("Tüm soruların metni olmalı.");
      if (q.options.length < 2)
        return alert("Her soru en az 2 şık içermelidir.");
      if (q.options.length > 6)
        return alert("Her soru en fazla 6 şık içerebilir.");
      if (q.options.some((opt) => !opt.trim()))
        return alert("Tüm şıklar doldurulmalıdır.");
    }
    try {
      await api
        .post("/quiz/create", { title, description, questions })
        .catch((err: any) => {
          if (err.response?.status == 401) {
            alert("Lütfen giriş yapın");
            return navigate("/login");
          } else if (err.response?.status != 400)
            return alert("Quiz oluşturulamadı");
        });
      alert("Quiz başarıyla oluşturuldu!");
      navigate("/quiz/list");

    } catch (err: any) {
      alert(err.response?.data?.message || "Quiz oluşturulamadı");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6 text-black">
      <h2 className="text-2xl font-bold text-center text-black">
        Quiz Oluştur
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div>
          <label className="block font-medium mb-1 text-black">
            Quiz Başlığı *
          </label>
          <input
            className="input input-bordered w-full text-black border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">
            Açıklama (isteğe bağlı)
          </label>
          <textarea
            className="input input-bordered w-full text-black border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-8">
          {questions.map((q, idx) => (
            <div key={idx} className="border rounded p-4 space-y-2 text-black">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-black">
                  Soru {idx + 1}
                </label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeQuestion(idx)}
                  >
                    Sil
                  </button>
                )}
              </div>
              <input
                className="input input-bordered w-full text-black"
                placeholder="Soru metni"
                value={q.text}
                onChange={(e) =>
                  handleQuestionChange(idx, "text", e.target.value)
                }
                required
              />
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      className="input input-bordered flex-1 text-black"
                      placeholder={`Şık ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleQuestionChange(
                          idx,
                          `option-${optIdx}`,
                          e.target.value
                        )
                      }
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => removeOption(idx, optIdx)}
                        title="Şık Sil"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {q.options.length < 6 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-outline text-black"
                    onClick={() => addOption(idx)}
                    tabIndex={0}
                  >
                    Şık Ekle
                  </button>
                )}
              </div>
              <div>
                <label className="block mb-1 text-black">Doğru Şık</label>
                <select
                  className="select select-bordered text-black"
                  value={q.answer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "answer", e.target.value)
                  }
                >
                  {q.options.map((_, optIdx) => (
                    <option key={optIdx} value={optIdx} className="text-black">
                      {`Şık ${optIdx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-outline w-full text-black"
          onClick={addQuestion}
        >
          Soru Ekle
        </button>
        <button type="submit" className="btn btn-primary w-full text-black">
          Quiz Oluştur
        </button>
      </form>
    </div>
  );
}
