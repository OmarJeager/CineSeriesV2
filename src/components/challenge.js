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

    const movieQuestions = [
        { question: "Who directed 'Inception'?", options: ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino"], answer: "Christopher Nolan" },
        { question: "Which movie won the Oscar for Best Picture in 1994?", options: ["Forrest Gump", "Pulp Fiction", "The Shawshank Redemption", "The Lion King"], answer: "Forrest Gump" },
        { question: "Which actor starred as the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Jared Leto", "Joaquin Phoenix", "Jack Nicholson"], answer: "Heath Ledger" },
        { question: "Which movie is based on a true story about a man stranded in the ocean?", options: ["Cast Away", "The Martian", "Life of Pi", "Gravity"], answer: "Cast Away" },
        { question: "Who played the lead role in 'Titanic'?", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Matt Damon"], answer: "Leonardo DiCaprio" },
        { question: "Which film won the Oscar for Best Picture in 2012?", options: ["The Artist", "Argo", "Birdman", "12 Years a Slave"], answer: "Argo" },
        { question: "Which movie featured a character named 'Jack Sparrow'?", options: ["Pirates of the Caribbean", "The Black Pearl", "The Lone Ranger", "Jumanji"], answer: "Pirates of the Caribbean" },
        { question: "Who starred in 'The Revenant'?", options: ["Leonardo DiCaprio", "Matthew McConaughey", "Brad Pitt", "Tom Hardy"], answer: "Leonardo DiCaprio" },
        { question: "In which movie did Tom Hanks play a man stranded on a deserted island?", options: ["Cast Away", "Saving Private Ryan", "Forrest Gump", "Big"], answer: "Cast Away" },
        { question: "Which animated movie was released by Pixar in 2003?", options: ["Finding Nemo", "Monsters, Inc.", "Cars", "The Incredibles"], answer: "Finding Nemo" },
        { question: "Who played Harry Potter?", options: ["Daniel Radcliffe", "Rupert Grint", "Johnny Depp", "Eddie Redmayne"], answer: "Daniel Radcliffe" },
        { question: "Who directed 'Pulp Fiction'?", options: ["Quentin Tarantino", "Martin Scorsese", "Steven Spielberg", "George Lucas"], answer: "Quentin Tarantino" },
        { question: "What is the name of the fictional African country in 'Black Panther'?", options: ["Wakanda", "Zamunda", "Genovia", "Narnia"], answer: "Wakanda" },
        { question: "Which movie franchise has a character named 'Luke Skywalker'?", options: ["Star Wars", "Star Trek", "The Matrix", "Indiana Jones"], answer: "Star Wars" },
        { question: "Which actor played 'Iron Man' in the Marvel Cinematic Universe?", options: ["Robert Downey Jr.", "Chris Hemsworth", "Chris Evans", "Mark Ruffalo"], answer: "Robert Downey Jr." },
        { question: "Which 2008 film features a character called 'The Joker'?", options: ["The Dark Knight", "Iron Man", "Spider-Man", "Hancock"], answer: "The Dark Knight" },
        { question: "In which movie did Audrey Hepburn star as 'Holly Golightly'?", options: ["Breakfast at Tiffany's", "Roman Holiday", "My Fair Lady", "Sabrina"], answer: "Breakfast at Tiffany's" },
        { question: "Which film has a character named 'Forrest Gump'?", options: ["Forrest Gump", "The Shawshank Redemption", "The Godfather", "Goodfellas"], answer: "Forrest Gump" },
        { question: "Which actor starred in 'The Matrix'?", options: ["Keanu Reeves", "Hugh Jackman", "Johnny Depp", "Will Smith"], answer: "Keanu Reeves" },
        { question: "Which movie is about a battle between Earth and an alien invasion?", options: ["Independence Day", "E.T.", "War of the Worlds", "Arrival"], answer: "Independence Day" }
    ];

    const seriesQuestions = [
        { question: "Which TV series is known for the phrase 'Winter is Coming'?", options: ["Breaking Bad", "Game of Thrones", "Stranger Things", "The Witcher"], answer: "Game of Thrones" },
        { question: "In which series does the character 'Eleven' appear?", options: ["Stranger Things", "The Umbrella Academy", "The Boys", "Dark"], answer: "Stranger Things" },
        { question: "Which TV series featured a character named 'Walter White'?", options: ["Breaking Bad", "The Sopranos", "Narcos", "Better Call Saul"], answer: "Breaking Bad" },
        { question: "What is the name of the high school in 'Riverdale'?", options: ["Riverdale High", "Sunnydale High", "Hill Valley High", "Rydell High"], answer: "Riverdale High" },
        { question: "Who played the character 'Sherlock Holmes' in the BBC series?", options: ["Benedict Cumberbatch", "Matt Smith", "David Tennant", "Robert Downey Jr."], answer: "Benedict Cumberbatch" },
        { question: "Which TV series takes place in the fictional town of Hawkins?", options: ["Stranger Things", "Twin Peaks", "Dark", "The X-Files"], answer: "Stranger Things" },
        { question: "Which series had a character named 'Jon Snow'?", options: ["Game of Thrones", "The Witcher", "Vikings", "Spartacus"], answer: "Game of Thrones" },
        { question: "In which TV show did 'Phoebe Buffay' appear?", options: ["Friends", "How I Met Your Mother", "Big Bang Theory", "Parks and Recreation"], answer: "Friends" },
        { question: "Which show involves a group of survivors in a zombie apocalypse?", options: ["The Walking Dead", "Fear the Walking Dead", "The 100", "Z Nation"], answer: "The Walking Dead" },
        { question: "Who played 'Rachel Green' in 'Friends'?", options: ["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "Matt LeBlanc"], answer: "Jennifer Aniston" },
        { question: "Which series is set in a dystopian future where 'The Handmaid's Tale' takes place?", options: ["The Handmaid's Tale", "Black Mirror", "The 100", "Orphan Black"], answer: "The Handmaid's Tale" },
        { question: "Which show follows the lives of survivors in a post-apocalyptic world after a viral outbreak?", options: ["The Walking Dead", "The Leftovers", "The Strain", "The Last of Us"], answer: "The Walking Dead" },
        { question: "Which TV series centers around a detective with a unique method of solving crimes?", options: ["Sherlock", "Castle", "Bones", "The Mentalist"], answer: "Sherlock" },
        { question: "Which popular TV series had a character named 'Michael Scott'?", options: ["The Office", "Parks and Recreation", "Brooklyn Nine-Nine", "30 Rock"], answer: "The Office" },
        { question: "Which series featured a team led by a character named 'Jack Bauer'?", options: ["24", "Prison Break", "NCIS", "CSI"], answer: "24" },
        { question: "Which show featured a character named 'Tony Soprano'?", options: ["The Sopranos", "Mad Men", "Breaking Bad", "The Wire"], answer: "The Sopranos" },
        { question: "Which show is based on a comic book series about a vigilante antihero?", options: ["The Punisher", "Daredevil", "Arrow", "The Boys"], answer: "The Punisher" },
        { question: "In which TV series does the character 'Walter White' turn into a drug kingpin?", options: ["Breaking Bad", "Narcos", "Ozark", "Weeds"], answer: "Breaking Bad" },
        { question: "Which TV series is about a family of mutants with superpowers?", options: ["The Gifted", "X-Men", "Heroes", "Strange Angel"], answer: "The Gifted" },
        { question: "Which popular TV show was based on a book series written by George R. R. Martin?", options: ["Game of Thrones", "Vikings", "The Witcher", "Spartacus"], answer: "Game of Thrones" }
    ];

    const categories = {
        movies: movieQuestions,
        series: seriesQuestions,
        people: [
            { question: "Who won the Oscar for Best Actor in 2019?", options: ["Leonardo DiCaprio", "Brad Pitt", "Joaquin Phoenix", "Matthew McConaughey"], answer: "Joaquin Phoenix" },
            { question: "Who is known as the 'King of Pop'?", options: ["Elvis Presley", "Michael Jackson", "Prince", "David Bowie"], answer: "Michael Jackson" },
            { question: "Which actor starred in 'Titanic'?", options: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"], answer: "Leonardo DiCaprio" },
            { question: "Which singer is known for the album 'Thriller'?", options: ["Michael Jackson", "Prince", "Madonna", "David Bowie"], answer: "Michael Jackson" },
            { question: "Who won the Oscar for Best Actress in 2002?", options: ["Halle Berry", "Charlize Theron", "Nicole Kidman", "Reese Witherspoon"], answer: "Halle Berry" },
            { question: "Who is known for the song 'Like a Virgin'?", options: ["Madonna", "Lady Gaga", "Beyoncé", "Adele"], answer: "Madonna" },
            { question: "Who won the Oscar for Best Director in 2018?", options: ["Guillermo del Toro", "Christopher Nolan", "Steven Spielberg", "Martin Scorsese"], answer: "Guillermo del Toro" },
            { question: "Which famous actor is known for his role in 'The Godfather'?", options: ["Marlon Brando", "Al Pacino", "Robert De Niro", "Jack Nicholson"], answer: "Marlon Brando" },
            { question: "Who directed 'The Shawshank Redemption'?", options: ["Frank Darabont", "Steven Spielberg", "Martin Scorsese", "Ridley Scott"], answer: "Frank Darabont" },
            { question: "Which actress starred in 'The Devil Wears Prada'?", options: ["Meryl Streep", "Sandra Bullock", "Julia Roberts", "Nicole Kidman"], answer: "Meryl Streep" },
            { question: "Who won the Grammy for Album of the Year in 2020?", options: ["Billie Eilish", "Ariana Grande", "Taylor Swift", "Lizzo"], answer: "Billie Eilish" },
            { question: "Which actor won an Oscar for playing the Joker in 'Joker'?", options: ["Joaquin Phoenix", "Heath Ledger", "Jack Nicholson", "Jared Leto"], answer: "Joaquin Phoenix" },
            { question: "Who played the role of 'The Terminator'?", options: ["Arnold Schwarzenegger", "Sylvester Stallone", "Bruce Willis", "Mel Gibson"], answer: "Arnold Schwarzenegger" },
            { question: "Which actor is known for starring in 'Iron Man'?", options: ["Robert Downey Jr.", "Chris Hemsworth", "Chris Evans", "Mark Ruffalo"], answer: "Robert Downey Jr." },
            { question: "Which actor starred in the 'Pirates of the Caribbean' series?", options: ["Johnny Depp", "Orlando Bloom", "Hugh Jackman", "Matthew McConaughey"], answer: "Johnny Depp" },
            { question: "Who won the Oscar for Best Supporting Actor in 2017?", options: ["Mahershala Ali", "Michael Shannon", "Dev Patel", "Jeff Bridges"], answer: "Mahershala Ali" },
            { question: "Who won the Oscar for Best Actress in 2014?", options: ["Cate Blanchett", "Meryl Streep", "Emma Stone", "Sandra Bullock"], answer: "Cate Blanchett" },
            { question: "Who won the Oscar for Best Actor in 2018?", options: ["Gary Oldman", "Daniel Day-Lewis", "Matthew McConaughey", "Leonardo DiCaprio"], answer: "Gary Oldman" },
            { question: "Who is known for the song 'Rolling in the Deep'?", options: ["Adele", "Lady Gaga", "Beyoncé", "Rihanna"], answer: "Adele" }
        ],
        tvshows: [
            { question: "Which TV show features a character named 'Rachel Green'?", options: ["Friends", "How I Met Your Mother", "The Office", "Big Bang Theory"], answer: "Friends" },
            { question: "Which TV show has a character named 'The Doctor'?", options: ["Doctor Who", "Sherlock", "The Crown", "Stranger Things"], answer: "Doctor Who" },
            { question: "Which TV series involves a group of survivors during a zombie apocalypse?", options: ["The Walking Dead", "Fear the Walking Dead", "The 100", "Z Nation"], answer: "The Walking Dead" },
            { question: "Which popular show has a character named 'Jon Snow'?", options: ["Game of Thrones", "The Witcher", "Vikings", "Spartacus"], answer: "Game of Thrones" },
            { question: "Which show features a family of mutants with superpowers?", options: ["The Gifted", "X-Men", "Heroes", "Strange Angel"], answer: "The Gifted" },
            { question: "In which TV series does a character named 'Walter White' turn into a drug kingpin?", options: ["Breaking Bad", "Narcos", "Ozark", "Weeds"], answer: "Breaking Bad" },
            { question: "Which TV show has a character named 'Sherlock Holmes'?", options: ["Sherlock", "Castle", "Bones", "The Mentalist"], answer: "Sherlock" },
            { question: "Which show is based on a book series written by George R. R. Martin?", options: ["Game of Thrones", "Vikings", "The Witcher", "Spartacus"], answer: "Game of Thrones" },
            { question: "Which show takes place in a fictional town called 'Hawkins'?", options: ["Stranger Things", "Twin Peaks", "Dark", "The X-Files"], answer: "Stranger Things" },
            { question: "Which show starred Jennifer Aniston as 'Rachel Green'?", options: ["Friends", "How I Met Your Mother", "Big Bang Theory", "Parks and Recreation"], answer: "Friends" },
            { question: "Which TV show has a character named 'Michael Scott'?", options: ["The Office", "Parks and Recreation", "Brooklyn Nine-Nine", "30 Rock"], answer: "The Office" },
            { question: "Which show is about a group of friends in New York City?", options: ["Friends", "How I Met Your Mother", "The Office", "Big Bang Theory"], answer: "Friends" },
            { question: "Which TV show involves the adventures of 'The Doctor'?", options: ["Doctor Who", "Sherlock", "The Crown", "Stranger Things"], answer: "Doctor Who" },
            { question: "In which show did 'Phoebe Buffay' appear?", options: ["Friends", "How I Met Your Mother", "The Office", "Big Bang Theory"], answer: "Friends" },
            { question: "Which series had a character named 'Tony Soprano'?", options: ["The Sopranos", "Mad Men", "Breaking Bad", "The Wire"], answer: "The Sopranos" },
            { question: "Which show has a character named 'Walter White'?", options: ["Breaking Bad", "The Sopranos", "The Wire", "Narcos"], answer: "Breaking Bad" },
            { question: "Which series follows a detective with a unique method of solving crimes?", options: ["Sherlock", "Castle", "Bones", "The Mentalist"], answer: "Sherlock" },
            { question: "Which popular TV series featured a character named 'Dr. Gregory House'?", options: ["House", "The Good Doctor", "Grey's Anatomy", "Scrubs"], answer: "House" }
        ],
        oscars: [
            { question: "Which movie won the Oscar for Best Picture in 2020?", options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"], answer: "Parasite" },
            { question: "Who won the Oscar for Best Actress in 2017?", options: ["Meryl Streep", "Emma Stone", "Natalie Portman", "Cate Blanchett"], answer: "Emma Stone" },
            { question: "Which movie won the Oscar for Best Picture in 2019?", options: ["Green Book", "Bohemian Rhapsody", "The Favourite", "Roma"], answer: "Green Book" },
            { question: "Who won the Oscar for Best Director in 2018?", options: ["Guillermo del Toro", "Christopher Nolan", "Steven Spielberg", "Martin Scorsese"], answer: "Guillermo del Toro" },
            { question: "Which actor won the Oscar for Best Actor in 2020?", options: ["Joaquin Phoenix", "Leonardo DiCaprio", "Adam Driver", "Antonio Banderas"], answer: "Joaquin Phoenix" },
            { question: "Which film won the Oscar for Best Animated Feature in 2017?", options: ["Zootopia", "Moana", "Finding Dory", "Kubo and the Two Strings"], answer: "Zootopia" },
            { question: "Who won the Oscar for Best Supporting Actor in 2018?", options: ["Mahershala Ali", "Sam Rockwell", "Willem Dafoe", "Richard E. Grant"], answer: "Mahershala Ali" },
            { question: "Which film won the Oscar for Best Picture in 2018?", options: ["The Shape of Water", "Darkest Hour", "Dunkirk", "Get Out"], answer: "The Shape of Water" },
            { question: "Which movie won the Oscar for Best Picture in 2014?", options: ["Birdman", "The Theory of Everything", "Boyhood", "The Grand Budapest Hotel"], answer: "Birdman" },
            { question: "Which actor won the Oscar for Best Actor in 2004?", options: ["Jamie Foxx", "Leonardo DiCaprio", "Johnny Depp", "Tom Hanks"], answer: "Jamie Foxx" },
            { question: "Who won the Oscar for Best Director in 2019?", options: ["Alfonso Cuarón", "Quentin Tarantino", "Martin Scorsese", "Bong Joon-ho"], answer: "Alfonso Cuarón" },
            { question: "Which actor won the Oscar for Best Actor in 2012?", options: ["Daniel Day-Lewis", "Brad Pitt", "Hugh Jackman", "Matthew McConaughey"], answer: "Daniel Day-Lewis" },
            { question: "Who won the Oscar for Best Actress in 2015?", options: ["Julianne Moore", "Reese Witherspoon", "Marion Cotillard", "Felicity Jones"], answer: "Julianne Moore" },
            { question: "Who won the Oscar for Best Actor in 2016?", options: ["Leonardo DiCaprio", "Eddie Redmayne", "Matthew McConaughey", "Michael Fassbender"], answer: "Leonardo DiCaprio" },
            { question: "Which film won the Oscar for Best Picture in 2013?", options: ["Argo", "Les Misérables", "Lincoln", "Silver Linings Playbook"], answer: "Argo" },
            { question: "Who won the Oscar for Best Supporting Actress in 2019?", options: ["Laura Dern", "Scarlett Johansson", "Margot Robbie", "Florence Pugh"], answer: "Laura Dern" }
        ],
        anime: [
            { question: "What is the name of the main character in 'Naruto'?", options: ["Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake"], answer: "Naruto Uzumaki" },
            { question: "Which anime features the 'Dragon Balls'?", options: ["Dragon Ball", "One Piece", "Bleach", "Attack on Titan"], answer: "Dragon Ball" },
            { question: "Who is the captain of the Straw Hat Pirates in 'One Piece'?", options: ["Monkey D. Luffy", "Roronoa Zoro", "Sanji", "Nami"], answer: "Monkey D. Luffy" },
            { question: "Which anime features a character named 'Light Yagami'?", options: ["Death Note", "Code Geass", "Attack on Titan", "Tokyo Ghoul"], answer: "Death Note" },
            { question: "What is the name of the school in 'My Hero Academia'?", options: ["UA High School", "Shinobi Academy", "Fairy Tail Guild", "Hunter Academy"], answer: "UA High School" },
            { question: "Which anime features Titans attacking humanity?", options: ["Attack on Titan", "Bleach", "Naruto", "One Piece"], answer: "Attack on Titan" },
            { question: "Who is the main character in 'Demon Slayer'?", options: ["Tanjiro Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira", "Nezuko Kamado"], answer: "Tanjiro Kamado" },
            { question: "Which anime features a character named 'Edward Elric'?", options: ["Fullmetal Alchemist", "Black Clover", "Fairy Tail", "Blue Exorcist"], answer: "Fullmetal Alchemist" },
            { question: "What is the name of the pirate king in 'One Piece'?", options: ["Gol D. Roger", "Monkey D. Luffy", "Shanks", "Whitebeard"], answer: "Gol D. Roger" },
            { question: "Which anime features a character named 'Goku'?", options: ["Dragon Ball", "Naruto", "One Piece", "Bleach"], answer: "Dragon Ball" },
            { question: "What is the name of the main character in 'Bleach'?", options: ["Ichigo Kurosaki", "Rukia Kuchiki", "Renji Abarai", "Uryu Ishida"], answer: "Ichigo Kurosaki" },
            { question: "Which anime features a character named 'Saitama'?", options: ["One Punch Man", "My Hero Academia", "Attack on Titan", "Dragon Ball"], answer: "One Punch Man" },
            { question: "Who is the main character in 'Hunter x Hunter'?", options: ["Gon Freecss", "Killua Zoldyck", "Kurapika", "Leorio Paradinight"], answer: "Gon Freecss" },
            { question: "Which anime features a character named 'Levi Ackerman'?", options: ["Attack on Titan", "Naruto", "Bleach", "One Piece"], answer: "Attack on Titan" },
            { question: "What is the name of the main character in 'Sword Art Online'?", options: ["Kirito", "Asuna", "Sinon", "Leafa"], answer: "Kirito" },
            { question: "Which anime features a character named 'Natsu Dragneel'?", options: ["Fairy Tail", "Black Clover", "Blue Exorcist", "One Piece"], answer: "Fairy Tail" },
            { question: "Who is the main character in 'Tokyo Ghoul'?", options: ["Ken Kaneki", "Touka Kirishima", "Rize Kamishiro", "Amon Koutarou"], answer: "Ken Kaneki" },
            { question: "Which anime features a character named 'Alucard'?", options: ["Hellsing", "Vampire Knight", "Black Butler", "Blue Exorcist"], answer: "Hellsing" },
            { question: "What is the name of the main character in 'Black Clover'?", options: ["Asta", "Yuno", "Noelle", "Yami"], answer: "Asta" },
            { question: "Which anime features a character named 'Shinji Ikari'?", options: ["Neon Genesis Evangelion", "Code Geass", "Steins;Gate", "Gurren Lagann"], answer: "Neon Genesis Evangelion" }
        ]
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
