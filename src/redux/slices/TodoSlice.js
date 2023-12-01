import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos'; // API URL

// Async thunk for fetching todos from the API
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
	const response = await axios.get(API_URL);
	// Mapping response data to a simplified format for better structure
	return response.data.map(e => ({
		completed: e.completed,
		id: e.id,
		title: e.title,
	}));
});

// Async thunk for deleting a todo by ID
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async id => {
	await axios.delete(`${API_URL}/${id}`);
	return id;
});

// Async thunk for adding a new todo
export const addTodo = createAsyncThunk('todos/addTodo', async newTodo => {
	const response = await axios.post(API_URL, newTodo);
	console.log(response);
	return response.data;
});

// Async thunk for updating an existing todo
export const updateTodo = createAsyncThunk(
	'todos/updateTodo',
	async updatedTodo => {
		// Destructuring the updatedTodo to get the ID and other properties
		const { id, ...rest } = updatedTodo;
		const response = await axios.put(`${API_URL}/${id}`, rest);
		return response.data;
	}
);

// Creating a Redux slice for managing todos
const todosSlice = createSlice({
	name: 'todos',
	initialState: {
		// Initial state with empty data, 'idle' status, and no error
		data: [],
		status: 'idle',
		error: null,
	},
	reducers: {},
	// Handling extra reducers for async thunks using the builder
	extraReducers: builder => {
		builder
			// Handling the pending state when fetching todos
			.addCase(fetchTodos.pending, state => {
				state.status = 'loading';
			})
			// Handling the fulfilled state when fetching todos successfully
			.addCase(fetchTodos.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			// Handling the rejected state when fetching todos fails
			.addCase(fetchTodos.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			// Handling the fulfilled state when deleting a todo successfully
			.addCase(deleteTodo.fulfilled, (state, action) => {
				// Removing the deleted todo from the state
				state.data = state.data.filter(todo => todo.id !== action.payload);
			})
			// Handling the fulfilled state when adding a todo successfully
			.addCase(addTodo.fulfilled, (state, action) => {
				// Adding the newly created todo to the state
				state.data.push(action.payload);
			})
			// Handling the fulfilled state when updating a todo successfully
			.addCase(updateTodo.fulfilled, (state, action) => {
				// Updating the existing todo in the state
				const updatedIndex = state.data.findIndex(
					todo => todo.id === action.payload.id
				);
				if (updatedIndex !== -1) {
					state.data[updatedIndex] = action.payload;
				}
			});
	},
});

export default todosSlice.reducer;
