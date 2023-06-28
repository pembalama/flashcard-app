//Get the necessary DOM elements
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const createFlashcardBtn = document.getElementById('create-flashcard-btn');
const displayFlashcardBtn = document.getElementById('display-flashcard-btn');
const currentFlashcard = document.getElementById('current-flashcard');
const flashcardCount = document.getElementById('flashcard-count');
const clearFlashcardsBtn = document.getElementById('clear-flashcards-btn');

//Event Listener for creating a Flashcard
createFlashcardBtn.addEventListener('click', () => {
	//Get values from the input fields
	const question = questionInput.value;
	const answer = answerInput.value;

	//Call a function to create a flashcard
	createFlashcard(question, answer);

	//Clear the input fields
	questionInput.value = '';
	answerInput.value = '';
});

//Event listener for displaying a flashcard
displayFlashcardBtn.addEventListener('click', () => {
	const question = questionInput.value;
	const answer = answerInput.value;

	//call a function to display the flashcard
	displayFlashcard(question, answer);
});

//Event listener for clearing all flashcards
clearFlashcardsBtn.addEventListener('click', () => {
	clearFlashcards();
});

//Create an empty array to store the flashcards
const flashcards = [];

//function to create a flashcard
function createFlashcard(question, answer) {
	//create a flashcard object
	const flashcard = {
		question: question,
		answer: answer,
	};

	//add flashcard to the array
	flashcards.push(flashcard);
	updateFlashcardCount();
	saveFlashcards();
}

//function to display flashcard
function displayFlashcard(question, answer) {
	if (flashcards.length === 0) {
		//Display a message if no flashcards are available
		currentFlashcard.textContent = 'No flashcards available.';
		return;
	}

	//randomly select a flashcard index
	const randomIndex = Math.floor(Math.random() * flashcards.length);
	const flashcard = flashcards[randomIndex];
	//Display the flashcard in the HTML
	currentFlashcard.innerHTML = `
        <h2>Question:</h2>
        <p>${flashcard.question}</p>
        <h2>Answer:</h2>
        <p>${flashcard.answer}</p>
        <button class="delete-flashcard-btn">Delete Flashcard</button>
    `;

	const deleteFlashcardBtn = document.querySelector('.delete-flashcard-btn');
	deleteFlashcardBtn.addEventListener('click', () => {
		deleteFlashcard(randomIndex);
	});

	saveFlashcards();
}

//function to delete flashcard
function deleteFlashcard(index) {
	flashcards.splice(index, 1);
	updateFlashcardCount();
	displayFlashcard();
	saveFlashcards();
}

//function to update the count
function updateFlashcardCount() {
	const count = flashcards.length;
	flashcardCount.textContent = `Total Flashcards: ${count}`;
}

//function to clear all flashcards
function clearFlashcards() {
	flashcards.length = 0;
	updateFlashcardCount();
	displayFlashcard();
	saveFlashcards();
}

//function to save flashcards in local storage
function saveFlashcards() {
	localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

//function to load flashcards from local storage
function loadflashcards() {
	const savedFlashcards = localStorage.getItem('flashcards');
	if (savedFlashcards) {
		flashcards.push(...JSON.parse(savedFlashcards));
		updateFlashcardCount();
	}
}

loadflashcards();
