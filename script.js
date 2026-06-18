/**
 * Saves the player's score to localStorage
 * @param {string} username - The player's username
 * @param {number} score - The player's score
 */
async function saveScore(username, score) {
    try {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        
        scores.push({
            player: username,
            score: score
        });

        localStorage.setItem("scores", JSON.stringify(scores));
        console.log("Score saved successfully");
    }
    catch(error){
        console.error("Failed to save score:", error.message);
    }
}


/**
 * Retrieves and displays all saved scores in the table
 * Reads scores from localStorage and updates the UI
 */
async function displayScores() {
    try { 
       
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const tableBody = document.querySelector("#score-table tbody");
        
        
        tableBody.innerHTML = "";

        
        scores.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.player}</td>
                <td>${entry.score}/10</td>
            `;
            tableBody.appendChild(row);
        });

        console.log("Scores displayed successfully");
    }
    catch(error){
        console.error("Failed to display scores:", error.message);
    }
}



/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    // checkUsername(); Uncomment once completed
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    /**
     * Stores a cookie with a name, value, and expiration days
     * @param {string} cname - The name of the cookie
     * @param {string} cvalue - The value to store
     * @param {number} exdays - Number of days until cookie expires
     */
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     *  Retrieves the value of a specific cookie by name
     * @param {string} cname - The name of the cookie
     * @returns {string} - The cookie value or empty string if not found
     */
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function checkUsername() {
    let username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}

    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);
    
    /**
     *  Calculates the user's score based on their answers
     * Counts all checked radio buttons that have data-correct attribute
     * @returns {number} - The total score (0-10)
     */
    function calculateScore() {
        let score = 0;
        const allRadios = document.querySelectorAll("input[type='radio']:checked");

        allRadios.forEach((radio) => {
            if (radio.hasAttribute("data-correct")) {
                score++;
            }
        });

        return score;
    }

    function handleFormSubmit(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();

    if (username != "" && getCookie("username") == "") {
        setCookie("username", username, 365);
    }

    const score = calculateScore();
    saveScore(username, score);
    displayScores();

    newPlayerButton.classList.remove("hidden");

    fetchQuestions();
    form.reset();
    }

    function newPlayer() {
    setCookie("username", "", -1);
    document.getElementById("username").value = "";
    newPlayerButton.classList.add("hidden");
    fetchQuestions();
}


});