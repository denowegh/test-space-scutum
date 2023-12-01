import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

// Getting the DOM element with the id 'root' where the app will be mounted
const container = document.getElementById('root');

// Creating a concurrent mode root for rendering the app
const root = createRoot(container);

// Rendering the app
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
