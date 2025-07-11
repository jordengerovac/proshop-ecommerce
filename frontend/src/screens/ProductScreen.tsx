import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

function ProductScreen() {
	const { id: productId } = useParams<{
		id: string;
	}>();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const {
		data: product,
		error,
		isLoading,
		refetch,
	} = useGetProductDetailsQuery({ id: productId as string });

	const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

	const { userInfo } = useSelector((state: any) => state.auth);

	const addToCartHandler = () => {
		dispatch(
			addToCart({
				...product,
				qty,
			}),
		);
		navigate("/cart");
	};

	const submitHandler = async (e: any) => {
		e.preventDefault();

		try {
			await createReview({
				productId,
				rating,
				comment,
			}).unwrap();
			refetch();
			toast.success("Review created successfully");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
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
				<>
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
					<Row className="review">
						<Col md={6}>
							<h2>Reviews</h2>
							{product?.reviews.length === 0 && <Message>No Reviews</Message>}
							<ListGroup variant="flush">
								{product?.reviews.map((review: any) => (
									<ListGroup.Item key={review._id}>
										<strong>{review.name}</strong>
										<Rating rating={{ value: review.rating }} />
										<p>{review.createdAt.substring(0, 10)}</p>
										<p>{review.comment}</p>
									</ListGroup.Item>
								))}
								<ListGroup.Item>
									<h2>Write a Customer Review</h2>

									{loadingProductReview && <Loader />}

									{userInfo ? (
										<Form onSubmit={submitHandler}>
											<Form.Group className="my-2" controlId="rating">
												<Form.Label>Rating</Form.Label>
												<Form.Control
													as="select"
													required
													value={rating}
													onChange={(e: any) => setRating(e.target.value)}
												>
													<option value="">Select...</option>
													<option value="1">1 - Poor</option>
													<option value="2">2 - Fair</option>
													<option value="3">3 - Good</option>
													<option value="4">4 - Very Good</option>
													<option value="5">5 - Excellent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group className="my-2" controlId="comment">
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as="textarea"
													required
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												></Form.Control>
											</Form.Group>
											<Button disabled={loadingProductReview} type="submit" variant="primary">
												Submit
											</Button>
										</Form>
									) : (
										<Message>
											Please <Link to="/login">sign in</Link> to write a review
										</Message>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
}

export default ProductScreen;
