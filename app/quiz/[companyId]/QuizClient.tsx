"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
  options: string[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

export default function QuizClient({ 
  quiz, 
  companyName, 
  companyLogo,
  userId 
}: { 
  quiz: Quiz, 
  companyName: string, 
  companyLogo: string | null,
  userId: string 
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSubmit = async () => {
    if (selectedOption === null) {
      alert("Please select an option first.");
      return;
    }

    setIsCheckingAnswer(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/quiz/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOption: selectedOption,
        }),
      });

      const data = await res.json();

      if (data.isCorrect) {
        setScore((prev) => prev + 1);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          setIsFinished(true);
        }
        setIsCheckingAnswer(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Error checking answer.");
      setIsCheckingAnswer(false);
    }
  };

  const submitScore = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          userId: userId,
          points: score,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save score.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Quiz Completed!</h2>
        <p className="text-gray-800 dark:text-white text-lg mb-2">Your Score:</p>
        <p className="text-5xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-8">{score} / {quiz.questions.length}</p>
        <Button onClick={submitScore} disabled={isSubmitting} className="w-full !bg-itf-blue !text-white">
          {isSubmitting ? "Saving..." : "Save & Return to Dashboard"}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 md:p-8 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 shadow-2xl">
      <div className="text-center mb-6">
        {companyLogo && (
          <div className="flex justify-center mb-4">
            <img src={companyLogo} alt={companyName} className="h-16 w-16 object-contain bg-white/10 rounded-xl p-2" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{companyName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{quiz.title}</p>
        <p className="text-cyan-600 dark:text-cyan-400 font-semibold mt-2">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{currentQuestion.text}</p>
      </div>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            disabled={isCheckingAnswer}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
              selectedOption === index
                ? "border-cyan-500 bg-cyan-500/20 text-gray-900 dark:text-white"
                : "border-gray-300 bg-white/30 text-gray-700 hover:bg-white/50 dark:border-white/10 dark:bg-black/30 dark:text-gray-300 dark:hover:bg-black/50"
            } ${
              feedback === "correct" && selectedOption === index ? "!bg-green-500/50 !text-white" :
              feedback === "wrong" && selectedOption === index ? "!bg-red-500/50 !text-white" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <Button 
        onClick={handleAnswerSubmit} 
        disabled={selectedOption === null || isCheckingAnswer}
        className="w-full !bg-itf-blue !text-white py-6"
      >
        {isCheckingAnswer ? "Checking..." : "Submit Answer"}
      </Button>
    </div>
  );
}