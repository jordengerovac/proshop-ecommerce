import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";

function OrderListScreen() {
	const { data: orders, isLoading, error } = useGetOrdersQuery({});

	return (
		<>
			<h1>Orders</h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{(error as any)?.data?.message || (error as any)?.error}</Message>
			) : (
				<Table hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>USER</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order: any) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>{order.user && order.user.name}</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>${order.totalPrice}</td>
								<td>
									{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes color="#c82323" />}
								</td>
								<td>
									{order.isDelivered ? (
										order.deliveredAt.substring(0, 10)
									) : (
										<FaTimes color="#c82323" />
									)}
								</td>
								<td>
									<LinkContainer to={`/order/${order._id}`}>
										<Button className="btn-sm" variant="light">
											Details
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
}

export default OrderListScreen;
