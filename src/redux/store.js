import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './slices/TodoSlice';

// Configuring the Redux store using configureStore
const store = configureStore({
	// Defining the root reducer for the store, which includes the todoSlice
	reducer: {
		todo: todoSlice,
	},
});

export default store;
