"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Question = {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

export default function EditQuizClient({ quiz }: { quiz: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuestions(newQuestions);
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || questions.length === 0) {
      alert("Please enter a title and at least one question.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/company/quiz/${quiz.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      });

      if (res.ok) {
        router.push("/company/dashboard");
      } else {
        alert("Failed to update quiz.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400">Edit Quiz</h1>
        <Link href="/company/dashboard" className="w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto border-gray-300 text-gray-700 dark:border-white/20 dark:text-gray-300">Cancel</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white/40 p-4 md:p-6 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 mb-8">
        <Label className="text-lg font-semibold mb-2 block text-gray-800 dark:text-white">Quiz Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-gray-300 bg-white/50 text-black dark:border-white/20 dark:bg-black/30 dark:text-white"
        />
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-2xl border border-gray-300 bg-white/40 p-4 md:p-6 backdrop-blur-xl dark:border-cyan-500/30 dark:bg-black/40 relative">
            <button
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-bold"
            >
              Remove
            </button>
            <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-4">Question {qIndex + 1}</h3>
            
            <div className="space-y-4">
              <Input
                value={q.text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                placeholder="Enter your question"
                className="border-gray-300 bg-white/50 text-black dark:border-white/20 dark:bg-black/30 dark:text-white"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => setCorrectAnswer(qIndex, oIndex)}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Correct</span>
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="border-gray-300 bg-white/50 text-black dark:border-white/20 dark:bg-black/30 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={addQuestion} variant="outline" className="w-full border-dashed border-2 border-cyan-500/50 text-cyan-600 dark:text-cyan-500 hover:bg-cyan-500/10">
          + Add Question
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full !bg-itf-blue !text-white text-lg py-6">
          {isLoading ? "Updating..." : "Update Quiz"}
        </Button>
      </div>
    </div>
  );
}