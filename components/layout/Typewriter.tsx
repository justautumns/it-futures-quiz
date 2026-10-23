"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delay?: number;
}

export default function Typewriter({
  text,
  typingSpeed = 100,
  deletingSpeed = 50,
  delay = 2000,
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      // Silme işlemi
      if (currentText === "") {
        setIsDeleting(false);
        // Text değiştiğinde veya silme bittiğinde bekle
        return;
      }
      timeout = setTimeout(() => {
        setCurrentText(text.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      // Yazma işlemi
      if (currentText === text) {
        // Yazma bitti, silmeye başlamadan önce bekle
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
        return;
      }
      timeout = setTimeout(() => {
        setCurrentText(text.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, text, typingSpeed, deletingSpeed, delay]);

  return <span>{currentText}</span>;
}