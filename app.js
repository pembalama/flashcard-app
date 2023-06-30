// Get the necessary DOM elements
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const createFlashcardBtn = document.getElementById('create-flashcard-btn');
const displayFlashcardBtn = document.getElementById('display-flashcard-btn');
const currentFlashcard = document.getElementById('current-flashcard');
const flashcardCount = document.getElementById('flashcard-count');
const clearFlashcardsBtn = document.getElementById('clear-flashcards-btn');

// Create an empty array to store the flashcards
const flashcards = [];

// Function to create a flashcard
function createFlashcard(question, answer) {
	// Create a flashcard object
	const flashcard = {
		question: question,
		answer: answer,
	};

	// Add flashcard to the array
	flashcards.push(flashcard);
	updateFlashcardCount();
	saveFlashcards();
}

let flashcard;
// Function to display flashcard
function displayFlashcard(currentIndex) {
	if (flashcards.length === 0) {
		// Display a message if no flashcards are available
		currentFlashcard.textContent = 'No flashcards available.';
		return;
	}

	flashcard = flashcards[currentIndex];
	// Display the flashcard in the HTML
	currentFlashcard.innerHTML = `
        <h2>Question:</h2>
        <p>${flashcard.question}</p>
        <h2>Answer:</h2>
        <p>${flashcard.answer}</p>
        <button class="edit-flashcard-btn">Edit Flashcard</button>
        <button class="delete-flashcard-btn">Delete Flashcard</button>
    `;

	const deleteFlashcardBtn = document.querySelector('.delete-flashcard-btn');
	deleteFlashcardBtn.removeEventListener('click', handleDeleteFlashcard);
	deleteFlashcardBtn.addEventListener('click', () =>
		handleDeleteFlashcard(currentIndex)
	);

	const editFlashcardBtn = document.querySelector('.edit-flashcard-btn');
	editFlashcardBtn.removeEventListener('click', handleEditFlashcard);
	editFlashcardBtn.addEventListener('click', handleEditFlashcard);

	saveFlashcards();
}

function handleDeleteFlashcard(currentIndex) {
	flashcards.splice(currentIndex, 1);
	updateFlashcardCount();
	const nextIndex = currentIndex % flashcards.length;
	displayFlashcard(nextIndex);
	saveFlashcards();
}

function handleEditFlashcard() {
	const currentIndex = flashcards.findIndex(card => card === flashcard);
	editFlashcard(currentIndex);
}

// Function to update the count
function updateFlashcardCount() {
	const count = flashcards.length;
	flashcardCount.textContent = `Total Flashcards: ${count}`;
}

// Function to clear all flashcards
function clearFlashcards() {
	flashcards.length = 0;
	updateFlashcardCount();
	displayFlashcard(0);
	saveFlashcards();
}

// Function to save flashcards in local storage
function saveFlashcards() {
	localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Function to load flashcards from local storage
function loadflashcards() {
	const savedFlashcards = localStorage.getItem('flashcards');
	if (savedFlashcards) {
		flashcards.push(...JSON.parse(savedFlashcards));
	}
	updateFlashcardCount();
}

function editFlashcard(index) {
	const flashcard = flashcards[index];

	const newQuestion = prompt('Enter the new question:', flashcard.question);
	const newAnswer = prompt('Enter the new answer:', flashcard.answer);

	if (newQuestion !== null && newAnswer !== null) {
		flashcard.question = newQuestion;
		flashcard.answer = newAnswer;
		displayFlashcard(index);
		saveFlashcards();
	}
}

function displayPreviousFlashcard(currentIndex) {
	if (flashcards.length === 0) {
		return;
	}

	const currentFlashcard = document.getElementById('current-flashcard');
	const previousIndex =
		(currentIndex - 1 + flashcards.length) % flashcards.length;
	const previousFlashcard = flashcards[previousIndex];

	displayFlashcard(previousIndex);
}

function displayNextFlashcard(currentIndex) {
	if (flashcards.length === 0) {
		return;
	}

	const currentFlashcard = document.getElementById('current-flashcard');
	const nextIndex = (currentIndex + 1) % flashcards.length;
	const nextFlashcard = flashcards[nextIndex];

	displayFlashcard(nextIndex);
}

// Event Listener for creating a Flashcard
createFlashcardBtn.addEventListener('click', () => {
	// Get values from the input fields
	const question = questionInput.value;
	const answer = answerInput.value;

	// Call a function to create a flashcard
	createFlashcard(question, answer);

	// Clear the input fields
	questionInput.value = '';
	answerInput.value = '';
});

// Event listener for displaying a flashcard
displayFlashcardBtn.addEventListener('click', () => {
	const currentIndex = 0; // Set the initial currentIndex

	// Call a function to display the flashcard
	displayFlashcard(currentIndex);
});

// Event listener for clearing all flashcards
clearFlashcardsBtn.addEventListener('click', () => {
	clearFlashcards();
});

document.addEventListener('keydown', event => {
	if (event.key === 'ArrowLeft') {
		// Previous flashcard
		const currentIndex = flashcards.findIndex(card => card === flashcard);
		displayPreviousFlashcard(currentIndex);
	} else if (event.key === 'ArrowRight') {
		// Next flashcard
		const currentIndex = flashcards.findIndex(card => card === flashcard);
		displayNextFlashcard(currentIndex);
	}
});

loadflashcards();
