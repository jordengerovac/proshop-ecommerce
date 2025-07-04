import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetUsersQuery } from "../../slices/usersApiSlice";

function UserListScreen() {
	const { data: users, isLoading, error } = useGetUsersQuery({});

	return (
		<>
			<h1>Users</h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{(error as any)?.data?.message || (error as any)?.error}</Message>
			) : (
				<Table hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>IS_ADMIN</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user: any) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.isAdmin.toString()}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
}

export default UserListScreen;
