import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useGetProductsQuery,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

function ProductListScreen() {
	const { pageNumber } = useParams();
	const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

	const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

	const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

	const deleteHandler = async (id: string) => {
		if (window.confirm("Are you sure")) {
			try {
				await deleteProduct({ productId: id as string });
				refetch();
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	const createProductHandler = async () => {
		if (window.confirm("Are you sure you want to create a new product?")) {
			try {
				await createProduct({});
				refetch();
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="text-end">
					<Button className="btn-sm m-3" onClick={createProductHandler}>
						<FaEdit /> Create Product
					</Button>
				</Col>
			</Row>
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
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>BRAND</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{data?.products.map((product: any) => (
							<tr key={product._id}>
								<td>{product._id}</td>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.brand}</td>
								<td>
									<LinkContainer to={`/admin/product/${product._id}/edit`}>
										<Button className="btn-sm mx-2" variant="light">
											<FaEdit />
										</Button>
									</LinkContainer>
									<Button
										className="btn-sm"
										variant="danger"
										onClick={() => deleteHandler(product._id)}
									>
										<FaTrash color="#fff" />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<Paginate pages={data?.pages} page={data?.page} isAdmin={true}></Paginate>
		</>
	);
}

export default ProductListScreen;
