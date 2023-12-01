// Function to validate if a value is required (non-empty)
const validateRequired = value => !!value.length;

// Function to validate a todo object
export function validateTodo(todo) {
	// checking for errors
	const titleError = !validateRequired(todo.title) ? 'Todo is Required' : '';
	const completedError = !validateRequired(todo.completed)
		? 'Completed is Required'
		: '';

	return {
		title: titleError,
		completed: completedError,
	};
}
