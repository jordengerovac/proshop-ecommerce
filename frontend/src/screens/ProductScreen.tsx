import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";

function ProductScreen() {
	const { id: productId } = useParams<{
		id: string;
	}>();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [qty, setQty] = useState(1);

	const { data: product, error, isLoading } = useGetProductDetailsQuery(productId);

	const addToCartHandler = () => {
		dispatch(
			addToCart({
				...product,
				qty,
			}),
		);
		navigate("/cart");
	};

	return (
		<>
			<Link to="/" className="btn btn-light my-3">
				Go Back
			</Link>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{(error as any)?.data?.message || (error as any)?.error}</Message>
			) : (
				<Row>
					<Col md={6}>
						<Image src={product?.image} alt={product?.name} fluid />
					</Col>
					<Col md={3}>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h3>{product?.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									rating={{
										value: product?.rating || 0,
										text: `${product?.numReviews} reviews`,
									}}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
							<ListGroup.Item>Description: {product?.description}</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>${product?.price}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>{(product?.countInStock ?? 0) > 0 ? "In Stock" : "Out of Stock"}</Col>
									</Row>
								</ListGroup.Item>
								{product.countInStock > 0 && (
									<ListGroup.Item>
										<Row>
											<Col>Qty</Col>
											<Col>
												<Form.Control
													as="select"
													value={qty}
													onChange={(e: any) => setQty(Number(e.target.value))}
												>
													{[...Array(product.countInStock).keys()].map((x) => (
														<option key={x + 1} value={x + 1}>
															{x + 1}
														</option>
													))}
												</Form.Control>
											</Col>
										</Row>
									</ListGroup.Item>
								)}
								<ListGroup.Item>
									<Button
										className="btn-block"
										type="button"
										disabled={(product?.countInStock ?? 0) === 0}
										onClick={addToCartHandler}
									>
										Add to Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
}

export default ProductScreen;
