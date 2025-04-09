import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash"; // Import lodash for shuffling
import "./Challenge.css"; // Add a CSS file for styling

const Challenge = () => {
    const [category, setCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [questions, setQuestions] = useState([]);

    const fetchQuestions = async (category) => {
        try {
            let response;
            const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

            const generateOptions = (correctAnswer, allOptions) => {
                const randomOptions = _.sampleSize(
                    allOptions.filter(option => option !== correctAnswer),
                    3
                );
                return _.shuffle([correctAnswer, ...randomOptions]);
            };

            if (category === "movies") {
                response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
                const allTitles = response.data.results.map(movie => movie.title);
                const movieQuestions = response.data.results.slice(0, 10).map((movie) => ({
                    question: `What is the title of this movie?`,
                    options: generateOptions(movie.title, allTitles),
                    answer: movie.title,
                    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }));
                setQuestions(movieQuestions);
            } else if (category === "anime") {
                response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=anime`);
                const allTitles = response.data.results.map(anime => anime.name);
                const animeQuestions = response.data.results.slice(0, 10).map((anime) => ({
                    question: `What is the title of this anime?`,
                    options: generateOptions(anime.name, allTitles),
                    answer: anime.name,
                    image: `https://image.tmdb.org/t/p/w500${anime.poster_path}`,
                }));
                setQuestions(animeQuestions);
            } else if (category === "series") {
                response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`);
                const allTitles = response.data.results.map(series => series.name);
                const seriesQuestions = response.data.results.slice(0, 10).map((series) => ({
                    question: `What is the title of this series?`,
                    options: generateOptions(series.name, allTitles),
                    answer: series.name,
                    image: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
                }));
                setQuestions(seriesQuestions);
            } else if (category === "people") {
                response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`);
                const allNames = response.data.results.map(person => person.name);
                const peopleQuestions = response.data.results.slice(0, 10).map((person) => ({
                    question: `Who is this person?`,
                    options: generateOptions(person.name, allNames),
                    answer: person.name,
                    image: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
                }));
                setQuestions(peopleQuestions);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setQuestions([]); // Clear previous questions
        fetchQuestions(selectedCategory);
    };

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
        setCategory(null);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setQuestions([]); // Clear previous questions
    };

    return (
        <div className="quiz-container">
            {!category ? (
                <div className="category-selection">
                    <h2>Select a Category</h2>
                    <button onClick={() => handleCategorySelect("movies")}>Movies</button>
                    <button onClick={() => handleCategorySelect("anime")}>Anime</button>
                    <button onClick={() => handleCategorySelect("series")}>Series</button>
                    <button onClick={() => handleCategorySelect("people")}>People</button>
                </div>
            ) : showScore ? (
                <div className="score-section">
                    <h2>Your Score: {score}/{questions.length}</h2>
                    <button onClick={restartGame}>Restart Quiz</button>
                </div>
            ) : questions.length > 0 && currentQuestion < questions.length ? (
                <div className="question-section">
                    <h2>{questions[currentQuestion]?.question}</h2>
                    {questions[currentQuestion]?.image && (
                        <img
                            src={questions[currentQuestion].image}
                            alt="Question visual"
                            className="question-image"
                        />
                    )}
                    <div className="options">
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)}>
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
