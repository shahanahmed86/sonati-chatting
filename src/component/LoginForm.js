import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';

function LoginForm({ handleJoin, isLoggedIn }) {
	const formRef = useRef(null);
	const history = useHistory();

	useEffect(() => {
		if (isLoggedIn) history.push('/');
	}, [isLoggedIn]);
	const onSubmitHandler = (ev) => {
		ev.preventDefault();

		const values = {
			name: formRef.current.name.value,
			room: formRef.current.room.value
		};

		if (!values.name.trim() || !values.room.trim()) {
			return toast.error('Name & Room are required...');
		}

		handleJoin(values);
	};
	return (
		<form onSubmit={onSubmitHandler} ref={formRef}>
			<input name='name' />
			<input name='room' />
			<input type='submit' value='submit' />
		</form>
	);
}

export default LoginForm;
