import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import {
	fetchTodos,
	deleteTodo,
	updateTodo,
	addTodo,
} from '../redux/slices/TodoSlice';
import { validateTodo } from '../utils/validate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TodoList() {
	const dispatch = useDispatch();

	// State to manage validation errors and todos
	const [validationErrors, setValidationErrors] = useState({});
	const todos = useSelector(state => state.todo.data);
	const status = useSelector(state => state.todo.status);

	// Memoized columns for the MaterialReactTable
	const columns = useMemo(
		() => [
			// Column configuration for 'Id'
			{
				accessorKey: 'id',
				header: 'Id',
				enableEditing: false,
				size: 30,
			},
			// Column configuration for 'Todo' with validation properties
			{
				accessorKey: 'title',
				header: 'Todo',
				muiEditTextFieldProps: {
					type: 'email',
					required: true,
					error: !!validationErrors?.title,
					helperText: validationErrors?.title,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							email: undefined,
						}),
				},
			},
			// Column configuration for 'Completed' with select options
			{
				accessorKey: 'completed',
				header: 'Сompleted',
				editVariant: 'select',
				editSelectOptions: ['Completed', 'Not completed'], //Array options
				muiEditTextFieldProps: {
					required: true,
					select: true,
					error: !!validationErrors?.completed,
					helperText: validationErrors?.completed,
				},
				accessorFn: row => (
					<span>{row.completed ? 'Completed' : 'Not completed'} </span>
				),
			},
		],
		[validationErrors]
	);

	// Effect hook to fetch todos when the component mounts or when the status is 'idle'
	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchTodos());
		}
	}, [dispatch, status]);

	// Function to confirm and delete a todo
	const openDeleteConfirmModal = row => {
		if (window.confirm('Are you sure you want to delete this todo?')) {
			dispatch(deleteTodo(row.original.id));
		}
	};

	// Function to handle saving an edited todo
	const handleSaveTodo = async ({ values, table }) => {
		const newValidationErrors = validateTodo(values); //check error
		if (Object.values(newValidationErrors).some(error => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}
		dispatch(
			updateTodo({
				...values,
				completed: values.completed === 'Completed' ? true : false, //parse string to boolean
			})
		);
		table.setEditingRow(null);
	};

	// Function to handle creating a new todo
	const handleCreateTodo = async ({ values, table }) => {
		const newValidationErrors = validateTodo(values); //check error
		if (Object.values(newValidationErrors).some(error => error)) {
			setValidationErrors(newValidationErrors);
			return;
		}
		dispatch(
			addTodo({
				...values,
				completed: values.completed === 'Completed' ? true : false, //parse string to boolean
			})
		);
		table.setCreatingRow(null);
	};

	// Configuring MaterialReactTable using custom hooks and callbacks
	const table = useMaterialReactTable({
		columns,
		data: todos,
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		enableEditing: true,

		// Callbacks for row creation and editing
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateTodo,
		onEditingRowCancel: () => setValidationErrors({}),
		onEditingRowSave: handleSaveTodo,

		// Custom rendering for row actions and top toolbar button
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title='Edit'>
					<IconButton onClick={() => table.setEditingRow(row)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title='Delete'>
					<IconButton color='error' onClick={() => openDeleteConfirmModal(row)}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				variant='contained'
				onClick={() => {
					table.setCreatingRow(true);
				}}
			>
				Create New Todo
			</Button>
		),
	});

	// Rendering based on the status of todos loading
	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	// Rendering based on the status of todos failing to load
	if (status === 'failed') {
		return <div>Error loading todos</div>;
	}

	// Rendering MaterialReactTable component when todos are successfully loaded
	if (status === 'succeeded') {
		return <MaterialReactTable table={table} />;
	}
}
