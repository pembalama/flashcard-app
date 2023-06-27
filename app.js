//Get the necessary DOM elements
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const createFlashcardBtn = document.getElementById('create-flashcard-btn');
const displayFlashcardBtn = document.getElementById('display-flashcard-btn');
const currentFlashcard = document.getElementById('current-flashcard');

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

	console.log('Flashcard created!');
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

	// console.log('Question: ' + flashcard.question);
	// console.log('answer: ' + flashcard.answer);

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
}

function deleteFlashcard(index) {
	flashcards.splice(index, 1);
	displayFlashcard();
}
