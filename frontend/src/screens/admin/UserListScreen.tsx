import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

function UserListScreen() {
	const { data: users, isLoading, error, refetch } = useGetUsersQuery({});

	const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

	const deleteHandler = async (id: string) => {
		if (window.confirm("Are you sure")) {
			try {
				const res = await deleteUser({ userId: id as string });
				refetch();

				if ((res as any)?.error?.data?.message || (res as any)?.error?.error) {
					toast.error((res as any)?.error?.data?.message || (res as any)?.error?.error);
				}
			} catch (err) {
				toast.error(err?.data?.message || err?.error);
			}
		}
	};

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
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user: any) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>{user.isAdmin ? <FaCheck color="#16a21d" /> : <FaTimes color="#c82323" />}</td>
								<td>
									<LinkContainer to={`/admin/user/${user._id}/edit`}>
										<Button className="btn-sm mx-2" variant="light">
											<FaEdit />
										</Button>
									</LinkContainer>
									<Button
										className="btn-sm"
										variant="danger"
										onClick={() => deleteHandler(user._id)}
									>
										<FaTrash color="#fff" />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
}

export default UserListScreen;
