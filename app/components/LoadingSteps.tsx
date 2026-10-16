"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading your message...",
  "Searching Google Drive...",
  "Asking Gemini to pick the right file...",
  "Fetching the file...",
  "Preparing your answer...",
];

export default function LoadingSteps() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // stop on the last step instead of looping
      setIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="loading-steps"
      role="status"
      aria-live="polite"
      aria-label={`${STEPS[index]} Step ${index + 1} of ${STEPS.length}`}
    >
      <div className="loading-indicator" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="loading-copy">
        <span key={index} className="loading-label animate-fade-in">
          {STEPS[index]}
        </span>
        <span className="loading-count">
          {index + 1}/{STEPS.length}
        </span>
        <span className="loading-track" aria-hidden="true">
          <span
            className="loading-progress"
            style={{ width: `${((index + 1) / STEPS.length) * 100}%` }}
          />
        </span>
      </div>
    </div>
  );
}