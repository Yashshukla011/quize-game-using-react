import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1Ry2KzqPfN4M80Gu_iatdCiklRCJI3LQ",
  authDomain: "quize-ee617.firebaseapp.com",
  projectId: "quize-ee617",
  storageBucket: "quize-ee617.appspot.com",
  messagingSenderId: "448358194670",
  appId: "1:448358194670:web:a89c3a3c85a2faeaedc2ff",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const fetchQuizData = async () => {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=50&category=9&difficulty=medium&type=multiple");
    if (res.status === 429) throw new Error("429");

    const data = await res.json();
    const decodeHtml = (html) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    return data.results.map((q) => ({
      question: decodeHtml(q.question),
      options: [...q.incorrect_answers, q.correct_answer]
        .map((opt) => decodeHtml(opt))
        .sort(() => Math.random() - 0.5),
      correctAnswer: decodeHtml(q.correct_answer),
    }));
  } catch (err) {

    return [
      { question: "Which F1 driver has 7 world titles?", options: ["Senna", "Alonso", "Schumacher", "Prost"], correctAnswer: "Schumacher" },
      { question: "Which team does Max Verstappen drive for?", options: ["Ferrari", "Red Bull", "Mercedes", "McLaren"], correctAnswer: "Red Bull" }
    ];
  }
};