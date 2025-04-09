import React, { useState } from "react";
import "./Challenge.css"; // Add a CSS file for styling

const Challenge = () => {
    const questions = [
        {
            question: "Who directed the movie 'Inception'?",
            options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Quentin Tarantino"],
            answer: "Christopher Nolan",
        },
        {
            question: "Which anime features the character Goku?",
            options: ["Naruto", "Dragon Ball", "One Piece", "Attack on Titan"],
            answer: "Dragon Ball",
        },
        {
            question: "What is the name of the main character in 'Breaking Bad'?",
            options: ["Walter White", "Jesse Pinkman", "Saul Goodman", "Hank Schrader"],
            answer: "Walter White",
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const handleAnswer = (selectedOption) => {
        if (selectedOption === questions[currentQuestion].answer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
    };

    return (
        <div className="quiz-container">
            {showScore ? (
                <div className="score-section">
                    <h2>Your Score: {score}/{questions.length}</h2>
                    <button onClick={restartGame}>Restart Quiz</button>
                </div>
            ) : (
                <div className="question-section">
                    <h2>{questions[currentQuestion].question}</h2>
                    <div className="options">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Challenge;