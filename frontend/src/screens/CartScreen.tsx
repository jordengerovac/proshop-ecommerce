import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

function CartScreen() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const cart = useSelector((state: any) => state.cart);
	const { cartItems } = cart;

	const addToCartHandler = async (product: any, qty: number) => {
		dispatch(
			addToCart({
				...product,
				qty,
			}),
		);
	};

	const removeFromCartHandler = async (id: any) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		navigate("/login?redirect=/shipping");
	};

	return (
		<Row>
			<Col md={8}>
				<h1
					style={{
						marginBottom: "20px",
					}}
				>
					Shopping Cart
				</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty <Link to="/">Go Back</Link>
					</Message>
				) : (
					<ListGroup variant="flush">
						{cartItems.map((item: any) => (
							<ListGroup.Item key={item._id}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item._id}`}>{item.name}</Link>
									</Col>
									<Col md={2}>${item.price}</Col>
									<Col md={2}>
										<Form.Control
											as="select"
											value={item.qty}
											onChange={(e: any) => addToCartHandler(item, Number(e.target.value))}
										>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button
											type="button"
											variant="light"
											onClick={() => removeFromCartHandler(item._id)}
										>
											<FaTrash />
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>
								Subtotal ({cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)} items)
							</h2>
							$
							{cartItems
								.reduce((acc: number, item: any) => acc + item.qty * item.price, 0)
								.toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type="button"
								className="btn-block"
								disabled={cartItems.length === 0}
								onClick={checkoutHandler}
							>
								Proceed to checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
}

export default CartScreen;
