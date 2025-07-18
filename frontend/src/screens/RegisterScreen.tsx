import { useState, useEffect, use } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";

function RegisterScreen() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [register, { isLoading }] = useRegisterMutation();

	const { userInfo } = useSelector((state: any) => state.auth);

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") ? sp.get("redirect") : "/";

	useEffect(() => {
		if (userInfo) {
			navigate(redirect as string);
		}
	}, [userInfo, redirect, navigate]);

	const submitHandler = async (e: any) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		} else {
			try {
				const res = await register({ name, email, password }).unwrap();
				dispatch(setCredentials({ ...res, token: res.token }));
				toast.success("Login successful");
				navigate(redirect as string);
			} catch (err: any) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	return (
		<FormContainer>
			<h1>Sign In</h1>

			<Form onSubmit={submitHandler}>
				<Form.Group controlId="name" className="my-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId="email" className="my-3">
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId="password" className="my-3">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId="confirmPassword" className="my-3">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
					Sign In
				</Button>

				{isLoading && <Loader />}

				<Row className="py-3">
					<Col>
						Already have an account?{" "}
						<Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
					</Col>
				</Row>
			</Form>
		</FormContainer>
	);
}

export default RegisterScreen;
