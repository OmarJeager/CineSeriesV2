import React, { useState } from "react";
import "./Challenge.css"; // Add a CSS file for styling

const Challenge = () => {
    const [category, setCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const moviesQuestions = [
        { question: "Who directed the movie 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Quentin Tarantino"], answer: "Christopher Nolan" },
        { question: "Which movie won the Oscar for Best Picture in 2020?", options: ["1917", "Parasite", "Once Upon a Time in Hollywood", "The Irishman"], answer: "Parasite" },
        { question: "Who starred as the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Jared Leto", "Jack Nicholson", "Joaquin Phoenix"], answer: "Heath Ledger" },
        { question: "Which movie franchise is known for 'The Force Awakens'?", options: ["Star Wars", "The Hunger Games", "Marvel Cinematic Universe", "Harry Potter"], answer: "Star Wars" },
        { question: "In which movie does the character 'Forrest Gump' appear?", options: ["Forrest Gump", "The Green Mile", "Cast Away", "A Beautiful Mind"], answer: "Forrest Gump" },
        { question: "Which movie is known for the line 'Here's looking at you, kid'?", options: ["Casablanca", "Gone with the Wind", "Citizen Kane", "The Godfather"], answer: "Casablanca" },
        { question: "Who directed 'Jurassic Park'?", options: ["Steven Spielberg", "James Cameron", "George Lucas", "Ridley Scott"], answer: "Steven Spielberg" },
        { question: "What year was 'Titanic' released?", options: ["1995", "1997", "2000", "2003"], answer: "1997" },
        { question: "What is the title of the first Harry Potter movie?", options: ["Harry Potter and the Philosopher's Stone", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire"], answer: "Harry Potter and the Philosopher's Stone" },
        { question: "In which movie does the character 'Rocky Balboa' appear?", options: ["Rocky", "The Fighter", "Million Dollar Baby", "Creed"], answer: "Rocky" },
        { question: "What movie features a character named 'E.T.'?", options: ["E.T. the Extra-Terrestrial", "Close Encounters of the Third Kind", "The Abyss", "The Terminator"], answer: "E.T. the Extra-Terrestrial" },
        { question: "In which movie do we see the character 'Jack Sparrow'?", options: ["Pirates of the Caribbean", "Indiana Jones", "The Lone Ranger", "Jumanji"], answer: "Pirates of the Caribbean" },
        { question: "Which actor played 'The Terminator'?", options: ["Arnold Schwarzenegger", "Bruce Willis", "Sylvester Stallone", "Tom Cruise"], answer: "Arnold Schwarzenegger" },
        { question: "In which movie does 'The Godfather' character appear?", options: ["The Godfather", "Scarface", "Goodfellas", "Casino"], answer: "The Godfather" },
        { question: "What year was the movie 'The Matrix' released?", options: ["1997", "1999", "2000", "2002"], answer: "1999" },
        { question: "Who starred in 'The Pursuit of Happyness'?", options: ["Will Smith", "Tom Hanks", "Brad Pitt", "Matthew McConaughey"], answer: "Will Smith" },
        { question: "What movie did Leonardo DiCaprio win his first Oscar for?", options: ["The Revenant", "Titanic", "Inception", "The Wolf of Wall Street"], answer: "The Revenant" },
        { question: "Which film features the song 'My Heart Will Go On'?", options: ["Titanic", "The Bodyguard", "The Sound of Music", "La La Land"], answer: "Titanic" },
        { question: "What was the first animated movie to be nominated for an Academy Award for Best Picture?", options: ["Beauty and the Beast", "The Lion King", "Toy Story", "Shrek"], answer: "Beauty and the Beast" },
        { question: "Which movie has the quote 'I see dead people'?", options: ["The Sixth Sense", "The Others", "The Ring", "Signs"], answer: "The Sixth Sense" },
        { question: "Who played 'Indiana Jones'?", options: ["Harrison Ford", "Matt Damon", "Tom Hanks", "Johnny Depp"], answer: "Harrison Ford" },
        { question: "Which movie is about a young girl named Dorothy in a magical land?", options: ["The Wizard of Oz", "Peter Pan", "Alice in Wonderland", "The Chronicles of Narnia"], answer: "The Wizard of Oz" },
        { question: "Who played 'The Bride' in 'Kill Bill'?", options: ["Uma Thurman", "Zoe Saldana", "Scarlett Johansson", "Angelina Jolie"], answer: "Uma Thurman" },
        // Add more movie-related questions here to complete the 50
    ];

    const animeQuestions = [
        { question: "Which anime features the character Goku?", options: ["Naruto", "Dragon Ball", "One Piece", "Attack on Titan"], answer: "Dragon Ball" },
        { question: "Who is the creator of 'Naruto'?", options: ["Masashi Kishimoto", "Eiichiro Oda", "Akira Toriyama", "Yoshihiro Togashi"], answer: "Masashi Kishimoto" },
        { question: "What is the name of Naruto's ninja village?", options: ["Konoha", "Suna", "Kiri", "Kumo"], answer: "Konoha" },
        { question: "Who is the main protagonist in 'One Piece'?", options: ["Luffy", "Zoro", "Nami", "Sanji"], answer: "Luffy" },
        { question: "In 'Attack on Titan', who is the titan shifter with the power of the Armored Titan?", options: ["Reiner Braun", "Annie Leonhart", "Eren Yeager", "Levi Ackerman"], answer: "Reiner Braun" },
        { question: "What is the main goal of the character 'Light Yagami' in 'Death Note'?", options: ["Become a god", "Destroy the world", "Create a utopia", "Take over Japan"], answer: "Become a god" },
        { question: "Which anime features a character named 'Edward Elric'?", options: ["Fullmetal Alchemist", "Naruto", "One Piece", "Attack on Titan"], answer: "Fullmetal Alchemist" },
        { question: "What is the name of the main character in 'My Hero Academia'?", options: ["Izuku Midoriya", "Katsuki Bakugo", "Shoto Todoroki", "All Might"], answer: "Izuku Midoriya" },
        { question: "What is the famous phrase from 'Naruto'?", options: ["Believe it!", "I am the Hokage", "Itachi was right", "I'm going to be the Pirate King"], answer: "Believe it!" },
        { question: "Which anime has the theme of 'Titan vs Humanity'?", options: ["Attack on Titan", "Naruto", "Fullmetal Alchemist", "Sword Art Online"], answer: "Attack on Titan" },
        { question: "Which anime is based on a manga by Yoshihiro Togashi?", options: ["Hunter x Hunter", "Bleach", "Tokyo Ghoul", "Death Note"], answer: "Hunter x Hunter" },
        // Add more anime-related questions here to complete the 50
    ];

    const seriesQuestions = [
        { question: "What is the name of the main character in 'Breaking Bad'?", options: ["Walter White", "Jesse Pinkman", "Saul Goodman", "Hank Schrader"], answer: "Walter White" },
        { question: "Which series features the character 'Jon Snow'?", options: ["Game of Thrones", "The Witcher", "Vikings", "The Mandalorian"], answer: "Game of Thrones" },
        { question: "In 'Friends', who was Ross married to three times?", options: ["Carol", "Emily", "Rachel", "Susan"], answer: "Carol" },
        { question: "In 'Stranger Things', what is Eleven's real name?", options: ["Millie Bobby Brown", "Natalia Dyer", "Sadie Sink", "Winona Ryder"], answer: "Millie Bobby Brown" },
        { question: "What is the title of the spin-off series from 'Better Call Saul'?", options: ["Breaking Bad", "El Camino", "The Sopranos", "The Walking Dead"], answer: "El Camino" },
        { question: "In 'The Office', who is the regional manager of Dunder Mifflin Scranton?", options: ["Michael Scott", "Jim Halpert", "Dwight Schrute", "Ryan Howard"], answer: "Michael Scott" },
        { question: "In 'The Simpsons', what is the name of Bart's sister?", options: ["Lisa", "Maggie", "Marge", "Marge", "Patty"], answer: "Lisa" },
        { question: "Which 'Doctor Who' companion traveled with the Tenth Doctor?", options: ["Rose Tyler", "Martha Jones", "Donna Noble", "Amy Pond"], answer: "Rose Tyler" },
        { question: "In 'Sherlock', who plays Sherlock Holmes?", options: ["Benedict Cumberbatch", "Martin Freeman", "Matt Smith", "David Tennant"], answer: "Benedict Cumberbatch" },
        { question: "In 'The Crown', who plays Queen Elizabeth II?", options: ["Claire Foy", "Olivia Colman", "Vanessa Kirby", "Emma Corrin"], answer: "Claire Foy" },
        // Add more series-related questions here to complete the 50
    ];

    const peopleQuestions = [
        { question: "Who was the first president of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: "George Washington" },
        { question: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Bessie Coleman"], answer: "Marie Curie" },
        { question: "Who is known as the 'Father of Computers'?", options: ["Charles Babbage", "Alan Turing", "John von Neumann", "Bill Gates"], answer: "Charles Babbage" },
        { question: "Who was the first human to travel into space?", options: ["Yuri Gagarin", "Neil Armstrong", "John Glenn", "Buzz Aldrin"], answer: "Yuri Gagarin" },
        { question: "Who invented the telephone?", options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Michael Faraday"], answer: "Alexander Graham Bell" },
        { question: "Who was the first African American president of the United States?", options: ["George Washington", "Barack Obama", "Abraham Lincoln", "John F. Kennedy"], answer: "Barack Obama" },
        { question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"], answer: "Leonardo da Vinci" },
        { question: "Who developed the theory of relativity?", options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], answer: "Albert Einstein" },
        { question: "Who was the first man to walk on the moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"], answer: "Neil Armstrong" },
        { question: "Who is known for the invention of the airplane?", options: ["Orville and Wilbur Wright", "Charles Lindbergh", "Amelia Earhart", "Howard Hughes"], answer: "Orville and Wilbur Wright" },
        // Add more people-related questions here to complete the 50
    ];

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
    };

    const handleAnswer = (selectedOption) => {
        const currentQuestions =
            category === "movies"
                ? moviesQuestions
                : category === "anime"
                ? animeQuestions
                : category === "series"
                ? seriesQuestions
                : peopleQuestions;

        if (selectedOption === currentQuestions[currentQuestion].answer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < currentQuestions.length) {
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
    };

    const getCurrentQuestions = () => {
        if (category === "movies") return moviesQuestions;
        if (category === "anime") return animeQuestions;
        if (category === "series") return seriesQuestions;
        if (category === "people") return peopleQuestions;
        return [];
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
                    <h2>Your Score: {score}/{getCurrentQuestions().length}</h2>
                    <button onClick={restartGame}>Restart Quiz</button>
                </div>
            ) : (
                <div className="question-section">
                    <h2>{getCurrentQuestions()[currentQuestion].question}</h2>
                    <div className="options">
                        {getCurrentQuestions()[currentQuestion].options.map((option, index) => (
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
