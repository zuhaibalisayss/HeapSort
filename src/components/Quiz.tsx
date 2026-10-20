import React, { useState, useMemo } from 'react';
import { quizQuestions, QuizQuestion } from '../utils/quizData';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffleArray(quizQuestions));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      if (submitted[q.id] && answers[q.id] === q.correctAnswer) {
        correct++;
      }
    }
    return correct;
  }, [answers, submitted, questions]);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted[questionId]) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuestion = (questionId: number) => {
    setSubmitted(prev => ({ ...prev, [questionId]: true }));
  };

  const handleSubmitAll = () => {
    const newSubmitted: Record<number, boolean> = {};
    questions.forEach(q => { newSubmitted[q.id] = true; });
    setSubmitted(newSubmitted);
    setQuizComplete(true);
  };

  const handleRetry = () => {
    setQuestions(shuffleArray(quizQuestions));
    setAnswers({});
    setSubmitted({});
    setQuizComplete(false);
  };

  const answeredCount = Object.keys(submitted).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Answered: {answeredCount} / {questions.length}
            {quizComplete && ` | Score: ${score} / ${questions.length} (${Math.round(score / questions.length * 100)}%)`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleSubmitAll}>Submit All</button>
          <button className="btn" onClick={handleRetry}>Retry</button>
        </div>
      </div>

      {questions.map((q, qIndex) => {
        const isSubmitted = submitted[q.id];
        const selectedAnswer = answers[q.id];
        const isCorrect = selectedAnswer === q.correctAnswer;

        return (
          <div key={q.id} className="quiz-question">
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              {qIndex + 1}. {q.question}
            </div>

            {q.options?.map((option, optIndex) => {
              let className = 'quiz-option';
              if (selectedAnswer === optIndex) className += ' selected';
              if (isSubmitted) {
                if (optIndex === q.correctAnswer) className += ' correct';
                else if (optIndex === selectedAnswer && optIndex !== q.correctAnswer) className += ' incorrect';
              }

              return (
                <div
                  key={optIndex}
                  className={className}
                  onClick={() => handleSelect(q.id, optIndex)}
                  role="radio"
                  aria-checked={selectedAnswer === optIndex}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(q.id, optIndex); }}
                >
                  <div className="quiz-radio"></div>
                  <span>{option}</span>
                </div>
              );
            })}

            {!isSubmitted && selectedAnswer !== undefined && (
              <button
                className="btn btn-sm btn-primary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => handleSubmitQuestion(q.id)}
              >
                Check Answer
              </button>
            )}

            {isSubmitted && (
              <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {quizComplete && (
        <div className="card" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <h3>Quiz Complete</h3>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>
            {score} / {questions.length} ({Math.round(score / questions.length * 100)}%)
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {score === questions.length ? 'Perfect score! You have a strong understanding of heaps and priority queues.' :
             score >= questions.length * 0.7 ? 'Good work! Review the topics you missed and try again.' :
             'Keep studying! Review the sections above and retry the quiz.'}
          </p>
          <button className="btn btn-primary" onClick={handleRetry} style={{ marginTop: '0.75rem' }}>
            Try Again (Shuffled)
          </button>
        </div>
      )}
    </div>
  );
};
