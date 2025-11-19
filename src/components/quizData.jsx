export const fetchQuizData = async () => {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
    const data = await res.json();

    if (!data || !data.results) return [];

    const decodeHtml = (html) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    return data.results.map((q) => ({
      question: decodeHtml(q.question),
      options: [...q.incorrect_answers, q.correct_answer].map((opt) => decodeHtml(opt)).sort(() => Math.random() - 0.5),
      correctAnswer: decodeHtml(q.correct_answer),
    }));
  } catch (err) {
    console.error("fetchQuizData error:", err);
    return [];
  }
};
