import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

function OrderScreen() {
	const { id: orderId } = useParams();

	const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{(error as any).data?.message || (error as any).error}</Message>
			) : (
				<>
					<h1>Order {order._id}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong> {order.user.name}
									</p>
									<p>
										<strong>Email: </strong>
										<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
									</p>
									<p>
										<strong>Address: </strong>
										{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
										{order.shippingAddress.postalCode}, {order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant="success">Delivered on {order.deliveredAt}</Message>
									) : (
										<Message variant="danger">Not Delivered</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong> {order.paymentMethod}
									</p>
									{order.isPaid ? (
										<Message variant="success">Paid on {order.paidAt}</Message>
									) : (
										<Message variant="danger">Not Paid</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Order Items</h2>
									{order.orderItems.length === 0 ? (
										<Message>Your order is empty</Message>
									) : (
										<ListGroup>
											{order.orderItems.map((item: any) => (
												<ListGroup.Item key={item.product}>
													<Row>
														<Col md={1}>
															<Image src={item.image} alt={item.name} fluid rounded />
														</Col>
														<Col md={5}>
															<Link to={`/product/${item.product}`}>{item.name}</Link>
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
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Items</Col>
											<Col>${order.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>${order.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Tax</Col>
											<Col>${order.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>${order.totalPrice}</Col>
										</Row>
									</ListGroup.Item>

									{!order.isPaid && (
										<ListGroup.Item className="d-grid">
											{/* Payment button can be added here */}
											{/* Example: */}
											{/* <Button type="button" className="btn btn-block">Pay Now</Button> */}
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
}

export default OrderScreen;
