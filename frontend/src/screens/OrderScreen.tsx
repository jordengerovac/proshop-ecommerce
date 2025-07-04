import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
	useGetOrderDetailsQuery,
	useGetPayPalClientIdQuery,
	usePayOrderMutation,
} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function OrderScreen() {
	const { id: orderId } = useParams();

	const {
		data: order,
		refetch,
		isLoading,
		error,
	} = useGetOrderDetailsQuery({ id: orderId as string });

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal,
	} = useGetPayPalClientIdQuery({});

	const { userInfo } = useSelector((state: any) => state.auth);

	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPayPalScript = async () => {
				paypalDispatch({
					type: "resetOptions" as any,
					value: {
						"client-id": paypal.clientId,
						currency: "CAD",
					} as any,
				});
				paypalDispatch({ type: "setLoadingStatus" as any, value: "pending" as any });
			};
			loadPayPalScript();
		}
	}, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

	const onApproveTest = async () => {
		await payOrder({ orderId, details: { payer: {} } });
		refetch();
		toast.success("Payment successful");
	};

	const createOrder = (data: any, actions: any) => {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: {
							value: order.totalPrice,
						},
					},
				],
			})
			.then((orderId: any) => {
				return orderId;
			});
	};

	const onApprove = (data: any, actions: any) => {
		return actions.order.capture().then(async function (details: any) {
			try {
				await payOrder({ orderId, details });
				refetch();
				toast.success("Payment successful");
			} catch (error) {
				toast.error(error.data.message || error.message);
			}
		});
	};

	const onError = () => {};

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
											{loadingPay && <Loader />}
											{isPending ? (
												<Loader />
											) : (
												<div>
													<Button onClick={onApproveTest} style={{ marginBottom: "10px" }}>
														Test Pay Order
													</Button>
													<div>
														<PayPalButtons
															createOrder={createOrder}
															onApprove={onApprove}
															onError={onError}
														></PayPalButtons>
													</div>
												</div>
											)}
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
