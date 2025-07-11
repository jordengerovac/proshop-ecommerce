import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentScreen() {
	const [paymentMethod, setPaymentMethod] = useState("PayPal");

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state: any) => state.cart);
	const { shippingAddress } = cart;

	useEffect(() => {
		if (!shippingAddress?.address) {
			navigate("/shipping");
		}
	}, [shippingAddress, navigate]);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod as any));
		navigate("/placeorder");
	};

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as="legend">Select Method</Form.Label>
					<Col>
						<Form.Check
							type="radio"
							label="PayPal or Credit Card"
							id="PayPal"
							name="paymentMethod"
							value="PayPal"
							checked
							onChange={(e) => setPaymentMethod(e.target.value)}
						></Form.Check>
					</Col>
				</Form.Group>

				<Button type="submit" variant="primary">
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
}

export default PaymentScreen;
