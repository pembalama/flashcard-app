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
const alertContainer = document.getElementById('alert-container');
const alertMessage = document.getElementById('alert-message');
const alertOk = document.getElementById('alert-ok');
const toggleAnswerBtn = document.getElementById('toggle-answer-btn');
const flashcardAnswer = document.getElementById('flashcard-answer');

// Create an empty array to store the flashcards
let flashcards = [];
let currentFlashcardIndex = 0;
let isAnswerVisible = false; // Track answer visibility

// Function to show alert
const showAlert = (message, callback) => {
	alertMessage.textContent = message;
	alertContainer.classList.remove('hidden');

	// Event listener for OK button in the alert
	alertOk.addEventListener('click', () => {
		hideAlert();
		if (callback && typeof callback === 'function') {
			callback();
		}
	});
};

// Function to hide alert
const hideAlert = () => {
	alertContainer.classList.add('hidden');
	alertOk.removeEventListener('click', hideAlert);
};

// Function to create a flashcard
const createFlashcard = (question, answer) => {
	// Check if the question and answer are not empty
	if (!question || !answer) {
		showAlert('Please enter a question and an answer.');
		return;
	}

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
	const revealAnswerBtn = document.getElementById('toggle-answer-btn');

	if (!flashcardQuestion || !flashcardAnswer || !revealAnswerBtn) {
		console.error('Failed to find the necessary HTML elements.');
		return;
	}

	flashcardQuestion.textContent = flashcard.question;
	flashcardAnswer.textContent = flashcard.answer;
	flashcardAnswer.classList.toggle('hidden', !isAnswerVisible); // Toggle answer visibility
	toggleAnswerBtn.textContent = isAnswerVisible
		? 'Hide Answer'
		: 'Reveal Answer';

	// Remove the existing event listener before adding a new one
	revealAnswerBtn.removeEventListener('click', toggleAnswerVisibility);

	revealAnswerBtn.addEventListener('click', toggleAnswerVisibility);

	currentFlashcard.classList.remove('hidden');
	updateFlashcardCount();
	saveFlashcards();
};

const toggleAnswerVisibility = () => {
	isAnswerVisible = !isAnswerVisible; // Toggle answer visibility
	flashcardAnswer.classList.toggle('hidden', !isAnswerVisible); // Toggle answer visibility
	toggleAnswerBtn.textContent = isAnswerVisible
		? 'Hide Answer'
		: 'Reveal Answer';
};

// Function to delete a flashcard
const deleteFlashcard = currentIndex => {
	// Check if there is already a delete prompt
	const existingPrompt = document.querySelector('.delete-prompt-container');
	if (existingPrompt) {
		return; // Exit the function if a delete prompt is already displayed
	}

	// Create prompt elements
	const promptContainer = document.createElement('div');
	promptContainer.classList.add('delete-prompt-container');

	const promptText = document.createElement('p');
	promptText.classList.add('prompt-text');
	promptText.textContent = 'Are you sure you want to delete this flashcard?';

	const confirmButton = document.createElement('button');
	confirmButton.classList.add('prompt-button');
	confirmButton.textContent = 'Delete';

	const cancelButton = document.createElement('button');
	cancelButton.classList.add('prompt-button');
	cancelButton.textContent = 'Cancel';

	// Append elements to prompt container
	promptContainer.appendChild(promptText);
	promptContainer.appendChild(confirmButton);
	promptContainer.appendChild(cancelButton);

	// Display the prompt container
	document.body.appendChild(promptContainer);

	// Event listener for confirm button
	confirmButton.addEventListener('click', () => {
		flashcards.splice(currentIndex, 1);
		const nextIndex =
			currentIndex >= flashcards.length ? flashcards.length - 1 : currentIndex;
		displayFlashcard(nextIndex);
		updateFlashcardCount(); // Update flashcard count after deleting a flashcard
		saveFlashcards();

		// Remove the prompt container
		document.body.removeChild(promptContainer);
	});

	// Event listener for cancel button
	cancelButton.addEventListener('click', () => {
		// Remove the prompt container
		document.body.removeChild(promptContainer);
	});
};

let editPromptContainer = null; // Keep track of the edit prompt container

const editFlashcard = currentIndex => {
	if (editPromptContainer) {
		// A prompt container already exists, so exit the function
		return;
	}

	const flashcard = flashcards[currentIndex];

	// Create prompt elements
	const promptContainer = document.createElement('div');
	promptContainer.classList.add('prompt-container');

	const promptHeading = document.createElement('h2');
	promptHeading.classList.add('prompt-heading');
	promptHeading.textContent = 'Edit Flashcard';

	const questionInput = document.createElement('input');
	questionInput.classList.add('prompt-input');
	questionInput.placeholder = 'Enter the new question';
	questionInput.value = '';

	const answerInput = document.createElement('input');
	answerInput.classList.add('prompt-input');
	answerInput.placeholder = 'Enter the new answer';
	answerInput.value = '';

	const confirmButton = document.createElement('button');
	confirmButton.classList.add('prompt-button');
	confirmButton.textContent = 'OK';

	const cancelButton = document.createElement('button');
	cancelButton.classList.add('prompt-button');
	cancelButton.textContent = 'Cancel';

	// Append elements to prompt container
	promptContainer.appendChild(promptHeading);
	promptContainer.appendChild(questionInput);
	promptContainer.appendChild(answerInput);
	promptContainer.appendChild(confirmButton);
	promptContainer.appendChild(cancelButton);

	// Display the prompt container
	document.body.appendChild(promptContainer);

	// Event listener for confirm button
	confirmButton.addEventListener('click', () => {
		const newQuestionValue = questionInput.value;
		const newAnswerValue = answerInput.value;

		if (newQuestionValue !== '' && newAnswerValue !== '') {
			flashcard.question = newQuestionValue;
			flashcard.answer = newAnswerValue;
			displayFlashcard(currentIndex);
			saveFlashcards();
		}

		// Remove the prompt container
		document.body.removeChild(promptContainer);
		editPromptContainer = null; // Reset the edit prompt container reference
	});

	// Event listener for cancel button
	cancelButton.addEventListener('click', () => {
		// Remove the prompt container
		document.body.removeChild(promptContainer);
		editPromptContainer = null; // Reset the edit prompt container reference
	});

	editPromptContainer = promptContainer; // Store the edit prompt container reference
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

// Load flashcards from local storage on page load
loadFlashcards();
