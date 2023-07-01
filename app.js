// Get the necessary DOM elements
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const createFlashcardBtn = document.getElementById('create-flashcard-btn');
const displayFlashcardBtn = document.getElementById('display-flashcard-btn');
const currentFlashcard = document.getElementById('current-flashcard');
const flashcardCount = document.getElementById('flashcard-count');
const clearFlashcardsBtn = document.getElementById('clear-flashcards-btn');
const shuffleFlashcardsBtn = document.getElementById('shuffle-flashcards-btn');
const previousFlashcardBtn = document.getElementById('previous-flashcard-btn');
const nextFlashcardBtn = document.getElementById('next-flashcard-btn');

// Create an empty array to store the flashcards
let flashcards = [];
let currentFlashcardIndex = 0;

// Function to create a flashcard
const createFlashcard = (question, answer) => {
	// Create a flashcard object
	const flashcard = {
		question,
		answer,
	};

	// Add flashcard to the array
	flashcards.push(flashcard);
	updateFlashcardCount();
	saveFlashcards();
};

// Function to display flashcard
const displayFlashcard = () => {
	if (flashcards.length === 0) {
		// Display a message if no flashcards are available
		currentFlashcard.classList.add('hidden');
		flashcardCount.textContent = 'No flashcards available.';
		return;
	}

	const flashcard = flashcards[currentFlashcardIndex];
	const flashcardQuestion = document.getElementById('flashcard-question');
	const flashcardAnswer = document.getElementById('flashcard-answer');
	const revealAnswerBtn = document.getElementById('reveal-answer-btn');

	if (!flashcardQuestion || !flashcardAnswer || !revealAnswerBtn) {
		console.error('Failed to find the necessary HTML elements.');
		return;
	}

	flashcardQuestion.textContent = flashcard.question;
	flashcardAnswer.textContent = flashcard.answer;
	flashcardAnswer.classList.add('hidden');

	revealAnswerBtn.addEventListener('click', () => {
		flashcardAnswer.classList.remove('hidden');
	});

	currentFlashcard.classList.remove('hidden');
	updateFlashcardCount();
	saveFlashcards();
};

// Function to delete a flashcard
const deleteFlashcard = currentIndex => {
	// Show confirmation dialog
	const confirmDelete = confirm(
		'Are you sure you want to delete this flashcard?'
	);

	if (confirmDelete) {
		flashcards.splice(currentIndex, 1);
		const nextIndex =
			currentIndex >= flashcards.length ? flashcards.length - 1 : currentIndex;
		updateFlashcardCount(); // update the flashcard count
		displayFlashcard(nextIndex); // display the next flashcard
		saveFlashcards();
	}
};

// Function to edit a flashcard
const editFlashcard = currentIndex => {
	const flashcard = flashcards[currentIndex];
	const newQuestion = prompt('Enter the new question:', flashcard.question);
	const newAnswer = prompt('Enter the new answer:', flashcard.answer);

	if (newQuestion !== null && newAnswer !== null) {
		flashcard.question = newQuestion;
		flashcard.answer = newAnswer;
		displayFlashcard(currentIndex);
		saveFlashcards();
	}
};

// Function to update the count
const updateFlashcardCount = () => {
	const count = flashcards.length;
	flashcardCount.textContent = `Total Flashcards: ${count}`;
};

// Function to clear all flashcards
const clearFlashcards = () => {
	flashcards = [];
	currentFlashcardIndex = 0;
	displayFlashcard();
	saveFlashcards();
};

// Function to save flashcards in local storage
const saveFlashcards = () => {
	localStorage.setItem('flashcards', JSON.stringify(flashcards));
};

// Function to load flashcards from local storage
const loadFlashcards = () => {
	const savedFlashcards = localStorage.getItem('flashcards');
	if (savedFlashcards) {
		flashcards = JSON.parse(savedFlashcards);
		updateFlashcardCount();
	}
};

// Function to shuffle flashcards
const shuffleFlashcards = () => {
	for (let i = flashcards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
	}

	currentFlashcardIndex = 0;
	displayFlashcard();
	saveFlashcards();
};

// Event Listener for creating a Flashcard
createFlashcardBtn.addEventListener('click', () => {
	const question = questionInput.value;
	const answer = answerInput.value;
	createFlashcard(question, answer);
	questionInput.value = '';
	answerInput.value = '';
});

// Event listener for displaying a flashcard
displayFlashcardBtn.addEventListener('click', () => {
	currentFlashcardIndex = 0;
	displayFlashcard();
});

// Event listener for clearing all flashcards
clearFlashcardsBtn.addEventListener('click', clearFlashcards);

// Event listener for navigating using left and right arrow keys
document.addEventListener('keydown', event => {
	if (event.key === 'ArrowLeft') {
		currentFlashcardIndex =
			(currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
		displayFlashcard();
	} else if (event.key === 'ArrowRight') {
		currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
		displayFlashcard();
	}
});

// Event listener for shuffling flashcards
shuffleFlashcardsBtn.addEventListener('click', shuffleFlashcards);

// Event listener for deleting a flashcard
currentFlashcard.addEventListener('click', event => {
	if (event.target.classList.contains('delete-flashcard-btn')) {
		const currentIndex = currentFlashcardIndex;
		deleteFlashcard(currentIndex);
	}
});

// Event listener for editing a flashcard
currentFlashcard.addEventListener('click', event => {
	if (event.target.classList.contains('edit-flashcard-btn')) {
		const currentIndex = currentFlashcardIndex;
		editFlashcard(currentIndex);
	}
});

// Event listener for the "Previous" button
previousFlashcardBtn.addEventListener('click', () => {
	currentFlashcardIndex =
		(currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
	displayFlashcard();
});

// Event listener for the "Next" button
nextFlashcardBtn.addEventListener('click', () => {
	currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
	displayFlashcard();
});

loadFlashcards();
