import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web"; // Import react-spring for animations
import "./Challenge.css"; // Add a CSS file for styling

const Challenge = () => {
    const [category, setCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [showMistakes, setShowMistakes] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        category: "",
    });

    const categories = {
        movies: [
            { question: "Who directed 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"], answer: "Christopher Nolan" },
        ],
        series: [
            { question: "Which TV series is known for the phrase 'Winter is Coming'?", options: ["Breaking Bad", "Game of Thrones", "Stranger Things", "The Witcher"], answer: "Game of Thrones" },
        ],
        people: [
            { question: "Who won the Oscar for Best Actor in 2019?", options: ["Leonardo DiCaprio", "Brad Pitt", "Joaquin Phoenix", "Matthew McConaughey"], answer: "Joaquin Phoenix" },
        ],
        tvshows: [
            { question: "Which TV show features a character named 'Rachel Green'?", options: ["Friends", "How I Met Your Mother", "The Office", "Big Bang Theory"], answer: "Friends" },
        ],
        oscars: [
            { question: "Which movie won the Oscar for Best Picture in 2020?", options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"], answer: "Parasite" },
        ],
        anime: [
            { question: "What is the name of the main character in 'Naruto'?", options: ["Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake"], answer: "Naruto Uzumaki" },
        ],
    };

    const fetchQuestions = (selectedCategory) => {
        setQuestions(categories[selectedCategory] || []);
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setIncorrectAnswers([]);
        setShowMistakes(false);
        fetchQuestions(selectedCategory);
    };

    const handleAddQuestion = () => {
        const { category, question, options, answer } = newQuestion;
        if (category && question && options.every((opt) => opt) && answer) {
            categories[category].push({ question, options, answer });
            alert("Question added successfully!");
            setNewQuestion({ question: "", options: ["", "", "", ""], answer: "", category: "" });
        } else {
            alert("Please fill out all fields.");
        }
    };

    // Animation for input and select elements
    const inputAnimation = useSpring({
        from: { opacity: 0, transform: "translateY(-10px)" },
        to: { opacity: 1, transform: "translateY(0)" },
    });

    return (
        <div className="quiz-container">
            {!category ? (
                <animated.div style={inputAnimation} className="category-selection">
                    <h2>Select a Category</h2>
                    <button className="hover-button" onClick={() => handleCategorySelect("movies")}>Movies</button>
                    <button className="hover-button" onClick={() => handleCategorySelect("series")}>Series</button>
                    <button className="hover-button" onClick={() => handleCategorySelect("people")}>People</button>
                    <button className="hover-button" onClick={() => handleCategorySelect("tvshows")}>TV Shows</button>
                    <button className="hover-button" onClick={() => handleCategorySelect("oscars")}>Oscars</button>
                    <button className="hover-button" onClick={() => handleCategorySelect("anime")}>Anime</button>
                    <div className="add-question-section">
                        <h3>Add a New Question</h3>
                        <animated.input
                            style={inputAnimation}
                            type="text"
                            placeholder="Question"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            className="animated-input"
                        />
                        {newQuestion.options.map((option, index) => (
                            <animated.input
                                key={index}
                                style={inputAnimation}
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                    const updatedOptions = [...newQuestion.options];
                                    updatedOptions[index] = e.target.value;
                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                }}
                                className="animated-input"
                            />
                        ))}
                        <animated.input
                            style={inputAnimation}
                            type="text"
                            placeholder="Correct Answer"
                            value={newQuestion.answer}
                            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                            className="animated-input"
                        />
                        <animated.select
                            style={inputAnimation}
                            value={newQuestion.category}
                            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                            className="animated-select"
                        >
                            <option value="">Select Category</option>
                            <option value="movies">Movies</option>
                            <option value="series">Series</option>
                            <option value="people">People</option>
                            <option value="tvshows">TV Shows</option>
                            <option value="oscars">Oscars</option>
                            <option value="anime">Anime</option>
                        </animated.select>
                        <button onClick={handleAddQuestion}>Add Question</button>
                    </div>
                </animated.div>
            ) : showScore ? (
                <div className="score-section">
                    <h2>Your Score: {score}/{questions.length}</h2>
                    <button onClick={() => setCategory(null)}>Restart Quiz</button>
                    {incorrectAnswers.length > 0 && (
                        <button onClick={() => setShowMistakes(true)}>Review Mistakes</button>
                    )}
                    {showMistakes && (
                        <div className="mistakes-section">
                            <h3>Review Mistakes</h3>
                            {incorrectAnswers.map((item, index) => (
                                <div key={index} className="mistake-item">
                                    <p><strong>Question:</strong> {item.question}</p>
                                    <p><strong>Your Answer:</strong> {item.selectedAnswer}</p>
                                    <p><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : questions.length > 0 && currentQuestion < questions.length ? (
                <div className="question-section">
                    <h2>{questions[currentQuestion]?.question}</h2>
                    <div className="options">
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <button
                                key={index}
                                className="hover-button"
                                onClick={() => {
                                    if (option === questions[currentQuestion].answer) {
                                        setScore(score + 1);
                                    } else {
                                        setIncorrectAnswers((prev) => [
                                            ...prev,
                                            {
                                                question: questions[currentQuestion].question,
                                                correctAnswer: questions[currentQuestion].answer,
                                                selectedAnswer: option,
                                            },
                                        ]);
                                    }

                                    const nextQuestion = currentQuestion + 1;
                                    if (nextQuestion < questions.length) {
                                        setCurrentQuestion(nextQuestion);
                                    } else {
                                        setShowScore(true);
                                    }
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>Loading questions...</div>
            )}
        </div>
    );
};

export default Challenge;
