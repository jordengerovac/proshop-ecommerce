import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

function PlaceOrderScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state: any) => state.cart);

	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	useEffect(() => {
		if (!cart.shippingAddress) {
			navigate("/shipping");
		} else if (!cart.paymentMethod) {
			navigate("/payment");
		}
	}, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

	const placeOrderHandler = async () => {
		const order = {
			orderItems: cart.cartItems,
			shippingAddress: cart.shippingAddress,
			paymentMethod: cart.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		};

		try {
			const createdOrder = await createOrder({ order } as any).unwrap();
			dispatch(clearCartItems());
			navigate(`/order/${createdOrder._id}`);
		} catch (err) {
			console.error("Failed to place order:", err);
		}
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
								{cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup>
									{cart.cartItems.map((item: any) => (
										<ListGroup.Item key={item._id}>
											<Row>
												<Col md={1}>
													<Image src={item.image} alt={item.name} fluid rounded />
												</Col>
												<Col>
													<Link to={`/product/${item._id}`}>{item.name}</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<ListGroup>
						<ListGroup.Item>
							<h2>Order Summary</h2>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Items</Col>
								<Col>${cart.itemsPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Shipping</Col>
								<Col>${cart.shippingPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Tax</Col>
								<Col>${cart.taxPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Total</Col>
								<Col>${cart.totalPrice}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							{isLoading && <Loader />}
							{error && (
								<Message variant="danger">
									{(error as any).data?.message || (error as any).error}.
								</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item className="d-grid">
							<Button
								type="button"
								className="btn-block"
								disabled={cart.cartItems.length === 0}
								onClick={placeOrderHandler}
							>
								Place Order
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Col>
			</Row>
		</>
	);
}

export default PlaceOrderScreen;
